import express from "express";
import {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
} from "../controllers/problem.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router
  .route("/")
  .get(getProblems)
  .post(protect, upload.single("image"), createProblem);

router
  .route("/:id")
  .get(getProblemById)
  .put(protect, updateProblem)
  .delete(protect, deleteProblem);

export default router;
