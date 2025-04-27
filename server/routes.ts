import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertTermSchema, insertCaseSchema, 
  insertExampleSchema, insertFavoriteSchema, insertReportSchema, 
  insertVisitorSchema, insertSubmissionSchema,
  insertLawCourseSchema, insertLawTopicSchema, insertLawQuestionSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

// Session types
declare module 'express-session' {
  interface SessionData {
    adminUser?: {
      id: number;
      mobileNumber: string;
      name?: string;
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiRouter = "/api";
  
  // Setup session middleware
  const PgSession = connectPgSimple(session);
  
  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: 'session', // Use default table name
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || 'lawlexicon-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV === 'production',
      },
    })
  );
  
  // Error handler
  const handleError = (res: Response, err: any) => {
    console.error(err);
    if (err instanceof ZodError) {
      return res.status(400).json({ message: fromZodError(err).message });
    }
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  };
  
  // Middleware to check if user is admin
  const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.adminUser) {
      return res.status(401).json({ message: "Unauthorized - Admin access required" });
    }
    next();
  };

  // Terms endpoints
  app.get(`${apiRouter}/terms`, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const approved = req.query.approved === undefined ? true : req.query.approved === "true";

      const terms = await storage.getAllTerms(page, limit, approved);
      res.json(terms);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.get(`${apiRouter}/terms/search`, async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const terms = await storage.searchTerms(query, page, limit);
      res.json(terms);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.get(`${apiRouter}/terms/word-of-the-day`, async (_req, res) => {
    try {
      const term = await storage.getWordOfTheDay();
      if (!term) {
        return res.status(404).json({ message: "No word of the day found" });
      }

      // Get the case reference(s) for the term
      const cases = await storage.getCasesByTermId(term.id, true);
      
      res.json({ ...term, cases });
    } catch (err) {
      handleError(res, err);
    }
  });

  app.get(`${apiRouter}/terms/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const term = await storage.getTerm(id);
      if (!term) {
        return res.status(404).json({ message: "Term not found" });
      }

      // Get the case references and examples for the term
      const cases = await storage.getCasesByTermId(id, true);
      const examples = await storage.getExamplesByTermId(id, true);
      
      res.json({ ...term, cases, examples });
    } catch (err) {
      handleError(res, err);
    }
  });

  app.post(`${apiRouter}/terms`, async (req, res) => {
    try {
      const data = insertTermSchema.parse(req.body);
      const term = await storage.createTerm(data);
      res.status(201).json(term);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.put(`${apiRouter}/terms/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertTermSchema.partial().parse(req.body);
      const term = await storage.updateTerm(id, data);
      if (!term) {
        return res.status(404).json({ message: "Term not found" });
      }
      res.json(term);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.delete(`${apiRouter}/terms/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTerm(id);
      if (!success) {
        return res.status(404).json({ message: "Term not found" });
      }
      res.status(204).send();
    } catch (err) {
      handleError(res, err);
    }
  });

  // Cases endpoints
  app.get(`${apiRouter}/terms/:termId/cases`, async (req, res) => {
    try {
      const termId = parseInt(req.params.termId);
      const approved = req.query.approved === undefined ? true : req.query.approved === "true";
      
      const cases = await storage.getCasesByTermId(termId, approved);
      res.json(cases);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.post(`${apiRouter}/cases`, async (req, res) => {
    try {
      const data = insertCaseSchema.parse(req.body);
      const caseRef = await storage.createCase(data);
      res.status(201).json(caseRef);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.put(`${apiRouter}/cases/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertCaseSchema.partial().parse(req.body);
      const caseRef = await storage.updateCase(id, data);
      if (!caseRef) {
        return res.status(404).json({ message: "Case not found" });
      }
      res.json(caseRef);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.delete(`${apiRouter}/cases/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCase(id);
      if (!success) {
        return res.status(404).json({ message: "Case not found" });
      }
      res.status(204).send();
    } catch (err) {
      handleError(res, err);
    }
  });

  // Examples endpoints
  app.get(`${apiRouter}/terms/:termId/examples`, async (req, res) => {
    try {
      const termId = parseInt(req.params.termId);
      const approved = req.query.approved === undefined ? true : req.query.approved === "true";
      
      const examples = await storage.getExamplesByTermId(termId, approved);
      res.json(examples);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.post(`${apiRouter}/examples`, async (req, res) => {
    try {
      const data = insertExampleSchema.parse(req.body);
      const example = await storage.createExample(data);
      res.status(201).json(example);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.put(`${apiRouter}/examples/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertExampleSchema.partial().parse(req.body);
      const example = await storage.updateExample(id, data);
      if (!example) {
        return res.status(404).json({ message: "Example not found" });
      }
      res.json(example);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.delete(`${apiRouter}/examples/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteExample(id);
      if (!success) {
        return res.status(404).json({ message: "Example not found" });
      }
      res.status(204).send();
    } catch (err) {
      handleError(res, err);
    }
  });

  // Visitor tracking endpoints
  app.post(`${apiRouter}/track-visit`, async (req, res) => {
    try {
      const data = insertVisitorSchema.parse(req.body);
      const visit = await storage.recordVisit(data);
      res.status(201).json(visit);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.get(`${apiRouter}/visitor-stats`, isAdmin, async (req, res) => {
    try {
      const stats = await storage.getVisitorStats();
      res.json(stats);
    } catch (err) {
      handleError(res, err);
    }
  });

  // Favorites endpoints
  app.get(`${apiRouter}/users/:userId/favorites`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.post(`${apiRouter}/favorites`, async (req, res) => {
    try {
      const data = insertFavoriteSchema.parse(req.body);
      const favorite = await storage.addFavorite(data);
      res.status(201).json(favorite);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.delete(`${apiRouter}/favorites/:userId/:termId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const termId = parseInt(req.params.termId);
      const success = await storage.removeFavorite(userId, termId);
      if (!success) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      res.status(204).send();
    } catch (err) {
      handleError(res, err);
    }
  });

  app.get(`${apiRouter}/favorites/:userId/:termId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const termId = parseInt(req.params.termId);
      const isFavorite = await storage.isFavorite(userId, termId);
      res.json({ isFavorite });
    } catch (err) {
      handleError(res, err);
    }
  });

  // Reports endpoints
  app.post(`${apiRouter}/reports`, async (req, res) => {
    try {
      const data = insertReportSchema.parse(req.body);
      const report = await storage.createReport(data);
      res.status(201).json(report);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.get(`${apiRouter}/reports/pending`, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const reports = await storage.getPendingReports(page, limit);
      res.json(reports);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.put(`${apiRouter}/reports/:id/resolve`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = parseInt(req.body.userId);
      const report = await storage.resolveReport(id, userId);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(report);
    } catch (err) {
      handleError(res, err);
    }
  });

  // Admin endpoints
  app.get(`${apiRouter}/admin/pending/terms`, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const terms = await storage.getPendingTerms(page, limit);
      res.json(terms);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.get(`${apiRouter}/admin/pending/examples`, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const examples = await storage.getPendingExamples(page, limit);
      res.json(examples);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.get(`${apiRouter}/admin/pending/cases`, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const cases = await storage.getPendingCases(page, limit);
      res.json(cases);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.put(`${apiRouter}/admin/approve/term/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const term = await storage.approveTerm(id);
      if (!term) {
        return res.status(404).json({ message: "Term not found" });
      }
      res.json(term);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.put(`${apiRouter}/admin/approve/example/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const example = await storage.approveExample(id);
      if (!example) {
        return res.status(404).json({ message: "Example not found" });
      }
      res.json(example);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.put(`${apiRouter}/admin/approve/case/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const caseRef = await storage.approveCase(id);
      if (!caseRef) {
        return res.status(404).json({ message: "Case not found" });
      }
      res.json(caseRef);
    } catch (err) {
      handleError(res, err);
    }
  });

  // Submissions endpoint
  app.post(`${apiRouter}/submissions`, async (req, res) => {
    try {
      const data = insertSubmissionSchema.parse(req.body);
      
      // Create a submission
      const submission = await storage.createSubmission(data);
      res.status(201).json(submission);
    } catch (err) {
      handleError(res, err);
    }
  });
  
  app.get(`${apiRouter}/admin/submissions`, isAdmin, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const processed = req.query.processed === "true";
      
      const result = await storage.getSubmissions({
        page,
        limit,
        processed
      });
      
      res.json(result);
    } catch (err) {
      handleError(res, err);
    }
  });
  
  app.put(`${apiRouter}/admin/submissions/:id/approve`, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const adminId = req.session.adminUser!.id;
      
      const success = await storage.approveSubmission(id, adminId);
      if (!success) {
        return res.status(404).json({ message: "Submission not found" });
      }
      
      res.json({ success: true });
    } catch (err) {
      handleError(res, err);
    }
  });
  
  app.put(`${apiRouter}/admin/submissions/:id/reject`, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const adminId = req.session.adminUser!.id;
      
      const success = await storage.rejectSubmission(id, adminId);
      if (!success) {
        return res.status(404).json({ message: "Submission not found" });
      }
      
      res.json({ success: true });
    } catch (err) {
      handleError(res, err);
    }
  });
  
  // Admin authentication
  app.post(`${apiRouter}/admin/login`, async (req, res) => {
    try {
      const { mobileNumber, password } = req.body;
      
      if (!mobileNumber || !password) {
        return res.status(400).json({ message: "Mobile number and password are required" });
      }
      
      // Hardcoded admin check for specific user
      if (mobileNumber === '8007348348' && password === '8007348348') {
        // Check if admin user exists in DB
        let adminUser = await storage.getAdminByMobile(mobileNumber);
        
        // If not, create admin user
        if (!adminUser) {
          adminUser = await storage.createAdminUser({
            mobileNumber,
            password,
            name: 'Admin',
            isActive: true
          });
        }
        
        // Set session
        req.session.adminUser = {
          id: adminUser.id,
          mobileNumber: adminUser.mobileNumber,
          name: adminUser.name
        };
        
        // Update last login time
        await storage.updateAdminLastLogin(adminUser.id);
        
        return res.json({
          id: adminUser.id,
          mobileNumber: adminUser.mobileNumber,
          name: adminUser.name
        });
      }
      
      // Regular DB authentication as fallback
      const adminUser = await storage.verifyAdminLogin(mobileNumber, password);
      if (!adminUser) {
        return res.status(401).json({ message: "Invalid mobile number or password" });
      }
      
      // Set session
      req.session.adminUser = {
        id: adminUser.id,
        mobileNumber: adminUser.mobileNumber,
        name: adminUser.name
      };
      
      // Update last login time
      await storage.updateAdminLastLogin(adminUser.id);
      
      res.json({
        id: adminUser.id,
        mobileNumber: adminUser.mobileNumber,
        name: adminUser.name
      });
    } catch (err) {
      handleError(res, err);
    }
  });
  
  app.post(`${apiRouter}/admin/logout`, (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return handleError(res, err);
      }
      res.json({ success: true });
    });
  });
  
  app.get(`${apiRouter}/admin/me`, (req, res) => {
    if (req.session.adminUser) {
      return res.json(req.session.adminUser);
    }
    res.status(401).json({ message: "Not authenticated" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
