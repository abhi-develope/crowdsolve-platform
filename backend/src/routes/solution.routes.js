import express from "express";
import {
  createSolution,
  upvoteSolution,
  addComment,
} from "../controllers/solution.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/problems/:problemId/solutions", protect, createSolution);
router.put("/:id/upvote", protect, upvoteSolution);
router.post("/:id/comments", protect, addComment);

export default router;
