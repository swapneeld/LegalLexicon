import { db } from './db';
import * as schema from '@shared/schema';
import { eq, or, and, ilike, desc, sql } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

// Define the storage interface
export interface IStorage {
  // Admin user operations
  getAdminByMobile(mobileNumber: string): Promise<schema.AdminUser | undefined>;
  createAdminUser(admin: Omit<schema.InsertAdminUser, 'passwordHash'> & { password: string }): Promise<schema.AdminUser>;
  verifyAdminLogin(mobileNumber: string, password: string): Promise<schema.AdminUser | null>;
  updateAdminLastLogin(id: number): Promise<void>;
  
  // Term operations
  getTerm(id: number): Promise<schema.Term | undefined>;
  getTerms(options?: { 
    page?: number; 
    limit?: number; 
    category?: string;
    search?: string;
    approved?: boolean;
  }): Promise<{ terms: schema.Term[]; total: number }>;
  getWordOfTheDay(): Promise<schema.Term | undefined>;
  getCasesByTermId(termId: number, approved?: boolean): Promise<schema.Case[]>;
  deleteTermById(id: number): Promise<boolean>;
  updateTerm(id: number, termData: Partial<schema.InsertTerm>): Promise<schema.Term | undefined>;
  
  // Submission operations
  createSubmission(submission: schema.InsertSubmission): Promise<schema.Submission>;
  getSubmission(id: number): Promise<schema.Submission | undefined>;
  getSubmissions(options?: {
    page?: number;
    limit?: number;
    processed?: boolean;
    approved?: boolean;
  }): Promise<{ submissions: schema.Submission[]; total: number }>;
  approveSubmission(id: number, adminId: number): Promise<boolean>;
  rejectSubmission(id: number, adminId: number): Promise<boolean>;
  
  // Visitor tracking
  recordVisit(visitor: schema.InsertVisitor): Promise<schema.Visitor>;
  getVisitorStats(): Promise<{ 
    total: number; 
    today: number;
    lastWeek: number;
    byPath: { path: string; count: number }[];
    byDevice: { deviceType: string; count: number }[];
  }>;
  
  // Law Notes operations
  createLawCourse(course: schema.InsertLawCourse): Promise<schema.LawCourse>;
  getLawCourses(options?: { semester?: number; active?: boolean }): Promise<schema.LawCourse[]>;
  getLawCourse(id: number): Promise<schema.LawCourse | undefined>;
  updateLawCourse(id: number, course: Partial<schema.InsertLawCourse>): Promise<schema.LawCourse>;
  
  createLawTopic(topic: schema.InsertLawTopic): Promise<schema.LawTopic>;
  getLawTopics(courseId: number, options?: { visible?: boolean }): Promise<schema.LawTopic[]>;
  getLawTopic(id: number): Promise<schema.LawTopic | undefined>;
  updateLawTopic(id: number, topic: Partial<schema.InsertLawTopic>): Promise<schema.LawTopic>;
  
  createLawQuestion(question: schema.InsertLawQuestion): Promise<schema.LawQuestion>;
  getLawQuestions(topicId: number, options?: { visible?: boolean }): Promise<schema.LawQuestion[]>;
  getLawQuestion(id: number): Promise<schema.LawQuestion | undefined>;
  updateLawQuestion(id: number, question: Partial<schema.InsertLawQuestion>): Promise<schema.LawQuestion>;
}

// Database implementation of the storage interface
export class DatabaseStorage implements IStorage {
  // Admin user operations
  async getAdminByMobile(mobileNumber: string): Promise<schema.AdminUser | undefined> {
    const [admin] = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.mobileNumber, mobileNumber));
    return admin;
  }
  
  async createAdminUser(admin: Omit<schema.InsertAdminUser, 'passwordHash'> & { password: string }): Promise<schema.AdminUser> {
    const { password, ...rest } = admin;
    const passwordHash = await bcrypt.hash(password, 10);
    
    const [newAdmin] = await db.insert(schema.adminUsers)
      .values({ ...rest, passwordHash })
      .returning();
      
    return newAdmin;
  }
  
  async verifyAdminLogin(mobileNumber: string, password: string): Promise<schema.AdminUser | null> {
    const admin = await this.getAdminByMobile(mobileNumber);
    
    if (!admin) {
      return null;
    }
    
    const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
    
    if (!passwordMatches) {
      return null;
    }
    
    return admin;
  }
  
  async updateAdminLastLogin(id: number): Promise<void> {
    await db.update(schema.adminUsers)
      .set({ lastLogin: new Date() })
      .where(eq(schema.adminUsers.id, id));
  }
  
  // Term operations
  async getTerm(id: number): Promise<schema.Term | undefined> {
    const [term] = await db.select().from(schema.terms).where(eq(schema.terms.id, id));
    return term;
  }
  
  async getTerms(options: { 
    page?: number; 
    limit?: number; 
    category?: string;
    search?: string;
    approved?: boolean;
  } = {}): Promise<{ terms: schema.Term[]; total: number }> {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search,
      approved = true
    } = options;
    
    const offset = (page - 1) * limit;
    
    // Build the where clause
    let whereClause = eq(schema.terms.isApproved, approved);
    
    if (category) {
      whereClause = and(whereClause, eq(schema.terms.category, category));
    }
    
    if (search) {
      whereClause = and(
        whereClause,
        or(
          ilike(schema.terms.term, `%${search}%`),
          ilike(schema.terms.definition, `%${search}%`)
        )
      );
    }
    
    // Get the terms
    const terms = await db.select()
      .from(schema.terms)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(schema.terms.createdAt));
      
    // Get the total count
    const [{ count }] = await db.select({
      count: sql<number>`count(*)`
    })
    .from(schema.terms)
    .where(whereClause);
    
    return {
      terms,
      total: Number(count) || 0
    };
  }
  
  async getWordOfTheDay(): Promise<schema.Term | undefined> {
    // Try to get a term that is set as word of the day for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Try to find a term that has been set as word of the day for today
    const [term] = await db.select()
      .from(schema.terms)
      .where(
        and(
          eq(schema.terms.isApproved, true),
          sql`${schema.terms.wordOfTheDayDate} >= ${today} AND ${schema.terms.wordOfTheDayDate} < ${tomorrow}`
        )
      );
      
    if (term) {
      return term;
    }
    
    // If no term is set for today, get a random approved term
    const [randomTerm] = await db.select()
      .from(schema.terms)
      .where(eq(schema.terms.isApproved, true))
      .orderBy(sql`RANDOM()`)
      .limit(1);
      
    if (randomTerm) {
      // Set this term as word of the day
      await db.update(schema.terms)
        .set({ wordOfTheDayDate: today })
        .where(eq(schema.terms.id, randomTerm.id));
        
      return { ...randomTerm, wordOfTheDayDate: today };
    }
    
    return undefined;
  }
  
  async getCasesByTermId(termId: number, approved: boolean = true): Promise<schema.Case[]> {
    const cases = await db.select()
      .from(schema.cases)
      .where(
        and(
          eq(schema.cases.termId, termId),
          eq(schema.cases.isApproved, approved)
        )
      );
    
    return cases;
  }
  
  async deleteTermById(id: number): Promise<boolean> {
    // First check if the term exists
    const term = await this.getTerm(id);
    if (!term) {
      return false;
    }
    
    // Start a transaction to maintain referential integrity
    return await db.transaction(async (tx) => {
      // Delete related cases first
      await tx.delete(schema.cases)
        .where(eq(schema.cases.termId, id));
      
      // Delete related examples
      await tx.delete(schema.examples)
        .where(eq(schema.examples.termId, id));
      
      // Delete term
      const [deletedTerm] = await tx.delete(schema.terms)
        .where(eq(schema.terms.id, id))
        .returning();
        
      return !!deletedTerm;
    });
  }
  
  async updateTerm(id: number, termData: Partial<schema.InsertTerm>): Promise<schema.Term | undefined> {
    // Check if the term exists
    const term = await this.getTerm(id);
    if (!term) {
      return undefined;
    }
    
    // Update the term
    const [updatedTerm] = await db.update(schema.terms)
      .set(termData)
      .where(eq(schema.terms.id, id))
      .returning();
      
    return updatedTerm;
  }
  
  // Submission operations
  async createSubmission(submission: schema.InsertSubmission): Promise<schema.Submission> {
    const [newSubmission] = await db.insert(schema.submissions)
      .values(submission)
      .returning();
      
    return newSubmission;
  }
  
  async getSubmission(id: number): Promise<schema.Submission | undefined> {
    const [submission] = await db.select().from(schema.submissions).where(eq(schema.submissions.id, id));
    return submission;
  }
  
  async getSubmissions(options: {
    page?: number;
    limit?: number;
    processed?: boolean;
    approved?: boolean;
  } = {}): Promise<{ submissions: schema.Submission[]; total: number }> {
    const { 
      page = 1, 
      limit = 10, 
      processed,
      approved 
    } = options;
    
    const offset = (page - 1) * limit;
    
    // Build the where clause
    let whereClause = sql`1=1`; // Always true
    
    if (processed !== undefined) {
      whereClause = and(whereClause, eq(schema.submissions.processed, processed));
    }
    
    if (approved !== undefined) {
      whereClause = and(whereClause, eq(schema.submissions.approved, approved));
    }
    
    // Get the submissions
    const submissions = await db.select()
      .from(schema.submissions)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(schema.submissions.createdAt));
      
    // Get the total count
    const [{ count }] = await db.select({
      count: sql<number>`count(*)`
    })
    .from(schema.submissions)
    .where(whereClause);
    
    return {
      submissions,
      total: Number(count) || 0
    };
  }
  
  async approveSubmission(id: number, adminId: number): Promise<boolean> {
    // Start a transaction
    return await db.transaction(async (tx) => {
      // Update the submission
      const [updatedSubmission] = await tx.update(schema.submissions)
        .set({ 
          processed: true, 
          approved: true,
          processedBy: adminId
        })
        .where(eq(schema.submissions.id, id))
        .returning();
        
      if (!updatedSubmission) {
        return false;
      }
      
      // Create a new term
      const [newTerm] = await tx.insert(schema.terms)
        .values({
          term: updatedSubmission.term,
          definition: updatedSubmission.definition,
          category: updatedSubmission.category,
          example: updatedSubmission.example,
          isApproved: true,
          submissionId: updatedSubmission.id
        })
        .returning();
        
      // If there's a case, create it
      if (updatedSubmission.caseName) {
        await tx.insert(schema.cases)
          .values({
            termId: newTerm.id,
            caseName: updatedSubmission.caseName,
            description: updatedSubmission.caseDescription || '',
            year: updatedSubmission.caseCitation ? 
              parseInt(updatedSubmission.caseCitation.match(/\d{4}/)?.[0] || '0') : 
              null,
            isApproved: true,
            submissionId: updatedSubmission.id
          });
      }
      
      return true;
    });
  }
  
  async rejectSubmission(id: number, adminId: number): Promise<boolean> {
    const [updatedSubmission] = await db.update(schema.submissions)
      .set({ 
        processed: true, 
        approved: false,
        processedBy: adminId
      })
      .where(eq(schema.submissions.id, id))
      .returning();
      
    return !!updatedSubmission;
  }
  
  // Visitor tracking
  async recordVisit(visitor: schema.InsertVisitor): Promise<schema.Visitor> {
    const [newVisitor] = await db.insert(schema.visitors)
      .values(visitor)
      .returning();
      
    return newVisitor;
  }
  
  async getVisitorStats(): Promise<{ 
    total: number; 
    today: number;
    lastWeek: number;
    byPath: { path: string; count: number }[];
    byDevice: { deviceType: string; count: number }[];
  }> {
    // Get total count
    const [{ count: total }] = await db.select({
      count: sql<number>`count(*)`
    })
    .from(schema.visitors);
    
    // Get today's count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const [{ count: todayCount }] = await db.select({
      count: sql<number>`count(*)`
    })
    .from(schema.visitors)
    .where(
      sql`${schema.visitors.visitDate} >= ${today} AND ${schema.visitors.visitDate} < ${tomorrow}`
    );
    
    // Get last week's count
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const [{ count: lastWeekCount }] = await db.select({
      count: sql<number>`count(*)`
    })
    .from(schema.visitors)
    .where(
      sql`${schema.visitors.visitDate} >= ${lastWeek}`
    );
    
    // Get count by path
    const byPathData = await db.select({
      path: schema.visitors.path,
      count: sql<number>`count(*)`
    })
    .from(schema.visitors)
    .groupBy(schema.visitors.path)
    .orderBy(sql`count(*) DESC`)
    .limit(10);
    
    // Get count by device type
    const byDeviceData = await db.select({
      deviceType: schema.visitors.deviceType,
      count: sql<number>`count(*)`
    })
    .from(schema.visitors)
    .groupBy(schema.visitors.deviceType)
    .orderBy(sql`count(*) DESC`);
    
    return {
      total: Number(total) || 0,
      today: Number(todayCount) || 0,
      lastWeek: Number(lastWeekCount) || 0,
      byPath: byPathData.map(item => ({ 
        path: item.path || 'unknown', 
        count: Number(item.count) || 0 
      })),
      byDevice: byDeviceData.map(item => ({ 
        deviceType: item.deviceType || 'unknown', 
        count: Number(item.count) || 0 
      }))
    };
  }

  // Law Notes operations
  async createLawCourse(course: schema.InsertLawCourse): Promise<schema.LawCourse> {
    const [newCourse] = await db.insert(schema.lawCourses)
      .values({
        ...course,
        updatedAt: new Date() // Ensure updatedAt is set
      })
      .returning();
    
    return newCourse;
  }
  
  async getLawCourses(options: { semester?: number; active?: boolean } = {}): Promise<schema.LawCourse[]> {
    const { semester, active } = options;
    
    let query = db.select().from(schema.lawCourses);
    
    if (semester !== undefined) {
      query = query.where(eq(schema.lawCourses.semester, semester));
    }
    
    if (active !== undefined) {
      query = query.where(eq(schema.lawCourses.isActive, active));
    }
    
    return await query.orderBy(schema.lawCourses.semester, schema.lawCourses.name);
  }
  
  async getLawCourse(id: number): Promise<schema.LawCourse | undefined> {
    const [course] = await db.select().from(schema.lawCourses).where(eq(schema.lawCourses.id, id));
    return course;
  }
  
  async updateLawCourse(id: number, course: Partial<schema.InsertLawCourse>): Promise<schema.LawCourse> {
    const [updatedCourse] = await db.update(schema.lawCourses)
      .set({
        ...course,
        updatedAt: new Date()
      })
      .where(eq(schema.lawCourses.id, id))
      .returning();
    
    return updatedCourse;
  }
  
  async createLawTopic(topic: schema.InsertLawTopic): Promise<schema.LawTopic> {
    const [newTopic] = await db.insert(schema.lawTopics)
      .values({
        ...topic,
        updatedAt: new Date()
      })
      .returning();
    
    return newTopic;
  }
  
  async getLawTopics(courseId: number, options: { visible?: boolean } = {}): Promise<schema.LawTopic[]> {
    const { visible } = options;
    
    let query = db.select().from(schema.lawTopics).where(eq(schema.lawTopics.courseId, courseId));
    
    if (visible !== undefined) {
      query = query.where(eq(schema.lawTopics.isVisible, visible));
    }
    
    return await query.orderBy(schema.lawTopics.orderIndex);
  }
  
  async getLawTopic(id: number): Promise<schema.LawTopic | undefined> {
    const [topic] = await db.select().from(schema.lawTopics).where(eq(schema.lawTopics.id, id));
    return topic;
  }
  
  async updateLawTopic(id: number, topic: Partial<schema.InsertLawTopic>): Promise<schema.LawTopic> {
    const [updatedTopic] = await db.update(schema.lawTopics)
      .set({
        ...topic,
        updatedAt: new Date()
      })
      .where(eq(schema.lawTopics.id, id))
      .returning();
    
    return updatedTopic;
  }
  
  async createLawQuestion(question: schema.InsertLawQuestion): Promise<schema.LawQuestion> {
    const [newQuestion] = await db.insert(schema.lawQuestions)
      .values({
        ...question,
        updatedAt: new Date()
      })
      .returning();
    
    return newQuestion;
  }
  
  async getLawQuestions(topicId: number, options: { visible?: boolean } = {}): Promise<schema.LawQuestion[]> {
    const { visible } = options;
    
    let query = db.select().from(schema.lawQuestions).where(eq(schema.lawQuestions.topicId, topicId));
    
    if (visible !== undefined) {
      query = query.where(eq(schema.lawQuestions.isVisible, visible));
    }
    
    return await query.orderBy(schema.lawQuestions.questionNumber);
  }
  
  async getLawQuestion(id: number): Promise<schema.LawQuestion | undefined> {
    const [question] = await db.select().from(schema.lawQuestions).where(eq(schema.lawQuestions.id, id));
    return question;
  }
  
  async updateLawQuestion(id: number, question: Partial<schema.InsertLawQuestion>): Promise<schema.LawQuestion> {
    const [updatedQuestion] = await db.update(schema.lawQuestions)
      .set({
        ...question,
        updatedAt: new Date()
      })
      .where(eq(schema.lawQuestions.id, id))
      .returning();
    
    return updatedQuestion;
  }
}

export const storage = new DatabaseStorage();