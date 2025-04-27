import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertTermSchema, insertCaseSchema, 
  insertExampleSchema, insertFavoriteSchema, insertReportSchema, 
  insertVoteSchema 
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiRouter = "/api";

  // Error handler
  const handleError = (res: Response, err: any) => {
    console.error(err);
    if (err instanceof ZodError) {
      return res.status(400).json({ message: fromZodError(err).message });
    }
    return res.status(500).json({ message: err.message || "Internal Server Error" });
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

  // Votes endpoints
  app.post(`${apiRouter}/votes`, async (req, res) => {
    try {
      const data = insertVoteSchema.parse(req.body);
      const vote = await storage.addVote(data);
      res.status(201).json(vote);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.delete(`${apiRouter}/votes/:userId/:exampleId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const exampleId = parseInt(req.params.exampleId);
      const success = await storage.removeVote(userId, exampleId);
      if (!success) {
        return res.status(404).json({ message: "Vote not found" });
      }
      res.status(204).send();
    } catch (err) {
      handleError(res, err);
    }
  });

  app.get(`${apiRouter}/votes/:userId/:exampleId`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const exampleId = parseInt(req.params.exampleId);
      const vote = await storage.getUserVote(userId, exampleId);
      if (!vote) {
        return res.status(404).json({ message: "Vote not found" });
      }
      res.json(vote);
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

  // Users
  app.post(`${apiRouter}/users`, async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      // Check if user already exists with this email
      const existingUserByEmail = await storage.getUserByEmail(data.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      // Check if username is taken
      if (data.username) {
        const existingUserByUsername = await storage.getUserByUsername(data.username);
        if (existingUserByUsername) {
          return res.status(400).json({ message: "Username is already taken" });
        }
      }
      
      const user = await storage.createUser(data);
      res.status(201).json(user);
    } catch (err) {
      handleError(res, err);
    }
  });

  app.get(`${apiRouter}/users/auth/:provider/:authId`, async (req, res) => {
    try {
      const provider = req.params.provider;
      const authId = req.params.authId;
      
      const user = await storage.getUserByAuthId(provider, authId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (err) {
      handleError(res, err);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
