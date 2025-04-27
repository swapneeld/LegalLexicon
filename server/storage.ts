import {
  users, terms, cases, examples, favorites, reports, votes,
  type User, type Term, type Case, type Example, type Favorite, type Report, type Vote,
  type InsertUser, type InsertTerm, type InsertCase, type InsertExample, type InsertFavorite, type InsertReport, type InsertVote
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByAuthId(provider: string, authId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Term operations
  getTerm(id: number): Promise<Term | undefined>;
  getTermByName(term: string): Promise<Term | undefined>;
  getAllTerms(page: number, limit: number, approved?: boolean): Promise<Term[]>;
  getWordOfTheDay(): Promise<Term | undefined>;
  setWordOfTheDay(termId: number): Promise<Term | undefined>;
  createTerm(term: InsertTerm): Promise<Term>;
  updateTerm(id: number, term: Partial<InsertTerm>): Promise<Term | undefined>;
  deleteTerm(id: number): Promise<boolean>;
  searchTerms(query: string, page: number, limit: number): Promise<Term[]>;
  
  // Case operations
  getCase(id: number): Promise<Case | undefined>;
  getCasesByTermId(termId: number, approved?: boolean): Promise<Case[]>;
  createCase(caseRef: InsertCase): Promise<Case>;
  updateCase(id: number, caseRef: Partial<InsertCase>): Promise<Case | undefined>;
  deleteCase(id: number): Promise<boolean>;
  
  // Example operations
  getExample(id: number): Promise<Example | undefined>;
  getExamplesByTermId(termId: number, approved?: boolean): Promise<Example[]>;
  createExample(example: InsertExample): Promise<Example>;
  updateExample(id: number, example: Partial<InsertExample>): Promise<Example | undefined>;
  deleteExample(id: number): Promise<boolean>;
  
  // Favorite operations
  getUserFavorites(userId: number): Promise<Term[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, termId: number): Promise<boolean>;
  isFavorite(userId: number, termId: number): Promise<boolean>;
  
  // Report operations
  getReport(id: number): Promise<Report | undefined>;
  getPendingReports(page: number, limit: number): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  resolveReport(id: number, userId: number): Promise<Report | undefined>;
  
  // Vote operations
  addVote(vote: InsertVote): Promise<Vote>;
  removeVote(userId: number, exampleId: number): Promise<boolean>;
  getUserVote(userId: number, exampleId: number): Promise<Vote | undefined>;
  
  // Admin operations
  getPendingTerms(page: number, limit: number): Promise<Term[]>;
  getPendingExamples(page: number, limit: number): Promise<Example[]>;
  getPendingCases(page: number, limit: number): Promise<Case[]>;
  approveTerm(id: number): Promise<Term | undefined>;
  approveExample(id: number): Promise<Example | undefined>;
  approveCase(id: number): Promise<Case | undefined>;
}

export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private termsData: Map<number, Term>;
  private casesData: Map<number, Case>;
  private examplesData: Map<number, Example>;
  private favoritesData: Map<string, Favorite>;
  private reportsData: Map<number, Report>;
  private votesData: Map<string, Vote>;
  
  private currentUserId: number;
  private currentTermId: number;
  private currentCaseId: number;
  private currentExampleId: number;
  private currentReportId: number;

  constructor() {
    this.usersData = new Map();
    this.termsData = new Map();
    this.casesData = new Map();
    this.examplesData = new Map();
    this.favoritesData = new Map();
    this.reportsData = new Map();
    this.votesData = new Map();
    
    this.currentUserId = 1;
    this.currentTermId = 1;
    this.currentCaseId = 1;
    this.currentExampleId = 1;
    this.currentReportId = 1;
    
    // Seed with sample data
    this.seedData();
  }

  private seedData() {
    // Seed admin user
    const adminUser: InsertUser = {
      username: "admin",
      email: "admin@lawlexicon.com",
      displayName: "Admin User",
      password: "admin123",
      isAdmin: true,
      authProvider: "local",
      authId: "admin",
    };
    this.createUser(adminUser);
    
    // Seed initial terms
    const seedTerms: InsertTerm[] = [
      {
        term: "Habeas Corpus",
        pronunciation: "hay-bee-us kor-pus",
        origin: "Latin: \"that you have the body\"",
        definition: "A writ (court order) that requires a person under arrest to be brought before a judge or into court. This ensures the person's imprisonment or detention is not illegal. Often referred to as \"the Great Writ,\" it is a fundamental safeguard against illegal detention by authorities.",
        example: "The defense attorney filed a petition for a writ of habeas corpus, challenging the constitutionality of her client's detention without formal charges.",
        category: "Constitutional Law",
        isApproved: true,
        wordOfTheDayDate: new Date(),
      },
      {
        term: "Stare Decisis",
        pronunciation: "stair-ay dih-sai-sis",
        origin: "Latin: \"to stand by things decided\"",
        definition: "The doctrine that courts will adhere to precedent in making their decisions. This provides stability and predictability in the legal system.",
        example: "Citing stare decisis, the judge ruled consistently with previous cases on this matter, stating that established precedent must be followed.",
        category: "Legal Principles",
        isApproved: true,
      },
      {
        term: "Prima Facie",
        pronunciation: "prai-muh fay-shee",
        origin: "Latin: \"at first sight\"",
        definition: "Refers to a legal claim or defense that is sufficient on its face to establish a case unless contradicted or overcome by evidence to the contrary.",
        example: "The prosecution presented prima facie evidence of the defendant's involvement, enough to proceed with the trial.",
        category: "Evidence Law",
        isApproved: true,
      },
      {
        term: "Mens Rea",
        pronunciation: "menz ray-uh",
        origin: "Latin: \"guilty mind\"",
        definition: "The mental state required to constitute a crime. It is the element of criminal responsibility focusing on the defendant's awareness and intent.",
        example: "To convict for first-degree murder, the prosecution must prove mens rea by demonstrating the defendant acted with premeditation and deliberate intent.",
        category: "Criminal Law",
        isApproved: true,
      },
    ];
    
    seedTerms.forEach(term => this.createTerm(term));
    
    // Seed case reference
    const exParteMilligan: InsertCase = {
      termId: 1,
      caseName: "Ex parte Milligan",
      year: 1866,
      description: "The U.S. Supreme Court held that the federal government could not establish military tribunals to try civilians in areas where civil courts were functioning, even during wartime. This case strengthened the protection of habeas corpus for civilians.",
      submittedBy: 1,
      isApproved: true,
    };
    this.createCase(exParteMilligan);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByAuthId(provider: string, authId: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.authProvider === provider && user.authId === authId,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const timestamp = new Date();
    const newUser: User = { ...user, id, createdAt: timestamp };
    this.usersData.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.usersData.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...user };
    this.usersData.set(id, updatedUser);
    return updatedUser;
  }

  // Term operations
  async getTerm(id: number): Promise<Term | undefined> {
    return this.termsData.get(id);
  }

  async getTermByName(term: string): Promise<Term | undefined> {
    return Array.from(this.termsData.values()).find(
      (t) => t.term.toLowerCase() === term.toLowerCase(),
    );
  }

  async getAllTerms(page: number = 1, limit: number = 10, approved?: boolean): Promise<Term[]> {
    let terms = Array.from(this.termsData.values());
    
    if (approved !== undefined) {
      terms = terms.filter(term => term.isApproved === approved);
    }
    
    return terms
      .sort((a, b) => a.term.localeCompare(b.term))
      .slice((page - 1) * limit, page * limit);
  }

  async getWordOfTheDay(): Promise<Term | undefined> {
    // Get current date in YYYY-MM-DD format
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find term scheduled for today
    const wotd = Array.from(this.termsData.values())
      .find(term => {
        if (!term.wordOfTheDayDate) return false;
        const termDate = new Date(term.wordOfTheDayDate);
        termDate.setHours(0, 0, 0, 0);
        return termDate.getTime() === today.getTime() && term.isApproved;
      });
    
    if (wotd) return wotd;
    
    // If no term is scheduled, return a random approved term
    const approvedTerms = Array.from(this.termsData.values())
      .filter(term => term.isApproved);
    
    if (approvedTerms.length === 0) return undefined;
    
    // Select a random term
    const randomIndex = Math.floor(Math.random() * approvedTerms.length);
    return approvedTerms[randomIndex];
  }

  async setWordOfTheDay(termId: number): Promise<Term | undefined> {
    const term = this.termsData.get(termId);
    if (!term) return undefined;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const updatedTerm = { ...term, wordOfTheDayDate: tomorrow };
    this.termsData.set(termId, updatedTerm);
    return updatedTerm;
  }

  async createTerm(term: InsertTerm): Promise<Term> {
    const id = this.currentTermId++;
    const timestamp = new Date();
    const newTerm: Term = { ...term, id, createdAt: timestamp };
    this.termsData.set(id, newTerm);
    return newTerm;
  }

  async updateTerm(id: number, term: Partial<InsertTerm>): Promise<Term | undefined> {
    const existingTerm = this.termsData.get(id);
    if (!existingTerm) return undefined;
    
    const updatedTerm = { ...existingTerm, ...term };
    this.termsData.set(id, updatedTerm);
    return updatedTerm;
  }

  async deleteTerm(id: number): Promise<boolean> {
    return this.termsData.delete(id);
  }

  async searchTerms(query: string, page: number = 1, limit: number = 10): Promise<Term[]> {
    const lowerCaseQuery = query.toLowerCase();
    const matchingTerms = Array.from(this.termsData.values())
      .filter(term => 
        term.isApproved && (
          term.term.toLowerCase().includes(lowerCaseQuery) ||
          term.definition.toLowerCase().includes(lowerCaseQuery) ||
          (term.example && term.example.toLowerCase().includes(lowerCaseQuery))
        )
      )
      .sort((a, b) => {
        // Sort exact matches first
        const aExact = a.term.toLowerCase() === lowerCaseQuery;
        const bExact = b.term.toLowerCase() === lowerCaseQuery;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Then sort by starts with
        const aStartsWith = a.term.toLowerCase().startsWith(lowerCaseQuery);
        const bStartsWith = b.term.toLowerCase().startsWith(lowerCaseQuery);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        // Then alphabetical
        return a.term.localeCompare(b.term);
      })
      .slice((page - 1) * limit, page * limit);
    
    return matchingTerms;
  }

  // Case operations
  async getCase(id: number): Promise<Case | undefined> {
    return this.casesData.get(id);
  }

  async getCasesByTermId(termId: number, approved?: boolean): Promise<Case[]> {
    let cases = Array.from(this.casesData.values())
      .filter(caseItem => caseItem.termId === termId);
    
    if (approved !== undefined) {
      cases = cases.filter(caseItem => caseItem.isApproved === approved);
    }
    
    return cases.sort((a, b) => (b.year || 0) - (a.year || 0));
  }

  async createCase(caseRef: InsertCase): Promise<Case> {
    const id = this.currentCaseId++;
    const timestamp = new Date();
    const newCase: Case = { ...caseRef, id, createdAt: timestamp };
    this.casesData.set(id, newCase);
    return newCase;
  }

  async updateCase(id: number, caseRef: Partial<InsertCase>): Promise<Case | undefined> {
    const existingCase = this.casesData.get(id);
    if (!existingCase) return undefined;
    
    const updatedCase = { ...existingCase, ...caseRef };
    this.casesData.set(id, updatedCase);
    return updatedCase;
  }

  async deleteCase(id: number): Promise<boolean> {
    return this.casesData.delete(id);
  }

  // Example operations
  async getExample(id: number): Promise<Example | undefined> {
    return this.examplesData.get(id);
  }

  async getExamplesByTermId(termId: number, approved?: boolean): Promise<Example[]> {
    let examples = Array.from(this.examplesData.values())
      .filter(example => example.termId === termId);
    
    if (approved !== undefined) {
      examples = examples.filter(example => example.isApproved === approved);
    }
    
    return examples.sort((a, b) => b.upvotes - a.upvotes);
  }

  async createExample(example: InsertExample): Promise<Example> {
    const id = this.currentExampleId++;
    const timestamp = new Date();
    const newExample: Example = { 
      ...example, 
      id, 
      createdAt: timestamp,
      upvotes: 0,
      downvotes: 0
    };
    this.examplesData.set(id, newExample);
    return newExample;
  }

  async updateExample(id: number, example: Partial<InsertExample>): Promise<Example | undefined> {
    const existingExample = this.examplesData.get(id);
    if (!existingExample) return undefined;
    
    const updatedExample = { ...existingExample, ...example };
    this.examplesData.set(id, updatedExample);
    return updatedExample;
  }

  async deleteExample(id: number): Promise<boolean> {
    return this.examplesData.delete(id);
  }

  // Favorite operations
  async getUserFavorites(userId: number): Promise<Term[]> {
    const userFavorites = Array.from(this.favoritesData.values())
      .filter(fav => fav.userId === userId);
    
    return userFavorites.map(fav => {
      const term = this.termsData.get(fav.termId);
      return term!;
    }).filter(term => term !== undefined);
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const key = `${favorite.userId}-${favorite.termId}`;
    const timestamp = new Date();
    const newFavorite: Favorite = { ...favorite, createdAt: timestamp };
    this.favoritesData.set(key, newFavorite);
    return newFavorite;
  }

  async removeFavorite(userId: number, termId: number): Promise<boolean> {
    const key = `${userId}-${termId}`;
    return this.favoritesData.delete(key);
  }

  async isFavorite(userId: number, termId: number): Promise<boolean> {
    const key = `${userId}-${termId}`;
    return this.favoritesData.has(key);
  }

  // Report operations
  async getReport(id: number): Promise<Report | undefined> {
    return this.reportsData.get(id);
  }

  async getPendingReports(page: number = 1, limit: number = 10): Promise<Report[]> {
    const pendingReports = Array.from(this.reportsData.values())
      .filter(report => !report.isResolved)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * limit, page * limit);
    
    return pendingReports;
  }

  async createReport(report: InsertReport): Promise<Report> {
    const id = this.currentReportId++;
    const timestamp = new Date();
    const newReport: Report = { 
      ...report, 
      id, 
      createdAt: timestamp,
      isResolved: false,
      resolvedAt: undefined,
    };
    this.reportsData.set(id, newReport);
    return newReport;
  }

  async resolveReport(id: number, userId: number): Promise<Report | undefined> {
    const report = this.reportsData.get(id);
    if (!report) return undefined;
    
    const resolvedReport = { 
      ...report, 
      isResolved: true, 
      resolvedBy: userId,
      resolvedAt: new Date()
    };
    this.reportsData.set(id, resolvedReport);
    return resolvedReport;
  }

  // Vote operations
  async addVote(vote: InsertVote): Promise<Vote> {
    const key = `${vote.userId}-${vote.exampleId}`;
    const timestamp = new Date();
    const newVote: Vote = { ...vote, createdAt: timestamp };
    
    // Update the example vote count
    const example = this.examplesData.get(vote.exampleId);
    if (example) {
      // Remove previous vote if exists
      const existingVote = this.votesData.get(key);
      if (existingVote) {
        if (existingVote.vote === 1) {
          example.upvotes -= 1;
        } else if (existingVote.vote === -1) {
          example.downvotes -= 1;
        }
      }
      
      // Add new vote
      if (vote.vote === 1) {
        example.upvotes += 1;
      } else if (vote.vote === -1) {
        example.downvotes += 1;
      }
      
      this.examplesData.set(example.id, example);
    }
    
    this.votesData.set(key, newVote);
    return newVote;
  }

  async removeVote(userId: number, exampleId: number): Promise<boolean> {
    const key = `${userId}-${exampleId}`;
    const vote = this.votesData.get(key);
    
    if (vote) {
      // Update the example vote count
      const example = this.examplesData.get(exampleId);
      if (example) {
        if (vote.vote === 1) {
          example.upvotes -= 1;
        } else if (vote.vote === -1) {
          example.downvotes -= 1;
        }
        this.examplesData.set(example.id, example);
      }
      
      return this.votesData.delete(key);
    }
    
    return false;
  }

  async getUserVote(userId: number, exampleId: number): Promise<Vote | undefined> {
    const key = `${userId}-${exampleId}`;
    return this.votesData.get(key);
  }

  // Admin operations
  async getPendingTerms(page: number = 1, limit: number = 10): Promise<Term[]> {
    return Array.from(this.termsData.values())
      .filter(term => !term.isApproved)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * limit, page * limit);
  }

  async getPendingExamples(page: number = 1, limit: number = 10): Promise<Example[]> {
    return Array.from(this.examplesData.values())
      .filter(example => !example.isApproved)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * limit, page * limit);
  }

  async getPendingCases(page: number = 1, limit: number = 10): Promise<Case[]> {
    return Array.from(this.casesData.values())
      .filter(caseItem => !caseItem.isApproved)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * limit, page * limit);
  }

  async approveTerm(id: number): Promise<Term | undefined> {
    const term = this.termsData.get(id);
    if (!term) return undefined;
    
    const approvedTerm = { ...term, isApproved: true };
    this.termsData.set(id, approvedTerm);
    return approvedTerm;
  }

  async approveExample(id: number): Promise<Example | undefined> {
    const example = this.examplesData.get(id);
    if (!example) return undefined;
    
    const approvedExample = { ...example, isApproved: true };
    this.examplesData.set(id, approvedExample);
    return approvedExample;
  }

  async approveCase(id: number): Promise<Case | undefined> {
    const caseItem = this.casesData.get(id);
    if (!caseItem) return undefined;
    
    const approvedCase = { ...caseItem, isApproved: true };
    this.casesData.set(id, approvedCase);
    return approvedCase;
  }
}

export const storage = new MemStorage();
