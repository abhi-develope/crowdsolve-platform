import Solution from "../models/Solution.model.js";
import Problem from "../models/Problem.model.js";
import ApiError from "../utils/ApiError.js";

export const createSolution = async (req, res, next) => {
  try {
    const { description } = req.body;
    const { problemId } = req.params;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      throw new ApiError(404, "Problem not found");
    }

    const solution = await Solution.create({
      description,
      problem: problemId,
      user: req.user._id,
    });

    // Update problem's solution count
    await Problem.findByIdAndUpdate(problemId, {
      $inc: { solutionsCount: 1 },
    });

    const populatedSolution = await Solution.findById(solution._id)
      .populate("user", "name email avatar")
      .populate("comments.user", "name avatar");

    res.status(201).json({
      success: true,
      solution: populatedSolution,
    });
  } catch (error) {
    next(error);
  }
};

export const upvoteSolution = async (req, res, next) => {
  try {
    const solution = await Solution.findById(req.params.id);

    if (!solution) {
      throw new ApiError(404, "Solution not found");
    }

    const hasUpvoted = solution.upvotes.includes(req.user._id);

    if (hasUpvoted) {
      // Remove upvote
      solution.upvotes = solution.upvotes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
      solution.upvoteCount -= 1;
    } else {
      // Add upvote
      solution.upvotes.push(req.user._id);
      solution.upvoteCount += 1;
    }

    await solution.save();

    res.status(200).json({
      success: true,
      upvoteCount: solution.upvoteCount,
      hasUpvoted: !hasUpvoted,
    });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const solution = await Solution.findById(req.params.id);

    if (!solution) {
      throw new ApiError(404, "Solution not found");
    }

    const comment = {
      user: req.user._id,
      text,
      createdAt: Date.now(),
    };

    solution.comments.push(comment);
    await solution.save();

    const populatedSolution = await Solution.findById(solution._id)
      .populate("user", "name email avatar")
      .populate("comments.user", "name avatar");

    res.status(201).json({
      success: true,
      solution: populatedSolution,
    });
  } catch (error) {
    next(error);
  }
};
