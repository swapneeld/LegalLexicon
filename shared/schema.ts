import { pgTable, text, serial, integer, boolean, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  profilePicture: text("profile_picture"),
  password: text("password"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  authProvider: text("auth_provider"),
  authId: text("auth_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Admin Users table (separate for security)
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  mobileNumber: text("mobile_number").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
});

// Public submissions table - for non-logged in users
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  term: text("term").notNull(),
  definition: text("definition").notNull(),
  category: text("category").notNull(),
  example: text("example"),
  caseName: text("case_name"),
  caseCitation: text("case_citation"),
  caseDescription: text("case_description"),
  submitterName: text("submitter_name"),
  submitterMobile: text("submitter_mobile").notNull(),
  submitterCity: text("submitter_city"),
  approved: boolean("approved").default(false).notNull(),
  processed: boolean("processed").default(false).notNull(),
  processedBy: integer("processed_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Legal terms dictionary
export const terms = pgTable("terms", {
  id: serial("id").primaryKey(),
  term: text("term").notNull().unique(),
  pronunciation: text("pronunciation"),
  origin: text("origin"),
  definition: text("definition").notNull(),
  example: text("example"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  submittedBy: integer("submitted_by").references(() => users.id),
  submissionId: integer("submission_id").references(() => submissions.id),
  isApproved: boolean("is_approved").default(false).notNull(),
  wordOfTheDayDate: timestamp("word_of_the_day_date"),
});

// Case references for legal terms
export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  termId: integer("term_id").references(() => terms.id).notNull(),
  caseName: text("case_name").notNull(),
  year: integer("year"),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  submittedBy: integer("submitted_by").references(() => users.id),
  submissionId: integer("submission_id").references(() => submissions.id),
  isApproved: boolean("is_approved").default(false).notNull(),
});

// User submitted examples
export const examples = pgTable("examples", {
  id: serial("id").primaryKey(),
  termId: integer("term_id").references(() => terms.id).notNull(),
  example: text("example").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  submittedBy: integer("submitted_by").references(() => users.id),
  submissionId: integer("submission_id").references(() => submissions.id),
  isApproved: boolean("is_approved").default(false).notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  downvotes: integer("downvotes").default(0).notNull(),
});

// User favorites
export const favorites = pgTable("favorites", {
  userId: integer("user_id").references(() => users.id).notNull(),
  termId: integer("term_id").references(() => terms.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.termId] }),
}));

// Reports for inappropriate content
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  contentType: text("content_type").notNull(), // 'term', 'example', 'case'
  contentId: integer("content_id").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reportedBy: integer("reported_by").references(() => users.id).notNull(),
  isResolved: boolean("is_resolved").default(false).notNull(),
  resolvedBy: integer("resolved_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
});

// Votes on examples
// Visitor tracking system
export const visitors = pgTable("visitors", {
  id: serial("id").primaryKey(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  visitDate: timestamp("visit_date").defaultNow().notNull(),
  path: text("path"),
  referrer: text("referrer"),
  deviceType: text("device_type") // 'mobile', 'tablet', 'desktop'
});

// Zod schemas for inserts
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  createdAt: true,
  approved: true,
  processed: true,
  processedBy: true,
}).extend({
  submitterMobile: z.string().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
});

export const insertTermSchema = createInsertSchema(terms).omit({
  id: true,
  createdAt: true,
});

export const insertCaseSchema = createInsertSchema(cases).omit({
  id: true,
  createdAt: true,
});

export const insertExampleSchema = createInsertSchema(examples).omit({
  id: true,
  createdAt: true,
  upvotes: true,
  downvotes: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
  isResolved: true,
  resolvedBy: true,
  resolvedAt: true,
});

export const insertVisitorSchema = createInsertSchema(visitors).omit({
  id: true,
  visitDate: true,
});

// Types for inserts
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type InsertTerm = z.infer<typeof insertTermSchema>;
export type InsertCase = z.infer<typeof insertCaseSchema>;
export type InsertExample = z.infer<typeof insertExampleSchema>;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type InsertVisitor = z.infer<typeof insertVisitorSchema>;

// Types for selects
export type User = typeof users.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type Term = typeof terms.$inferSelect;
export type Case = typeof cases.$inferSelect;
export type Example = typeof examples.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type Visitor = typeof visitors.$inferSelect;
