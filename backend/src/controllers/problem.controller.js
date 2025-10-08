import Problem from "../models/Problem.model.js";
import Solution from "../models/Solution.model.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.js";

export const createProblem = async (req, res, next) => {
  try {
    const { title, description, location } = req.body;
    let imageUrl = "";

    // If image is uploaded, upload to cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const problem = await Problem.create({
      title,
      description,
      location,
      image: imageUrl,
      user: req.user._id,
    });

    const populatedProblem = await Problem.findById(problem._id).populate(
      "user",
      "name email avatar"
    );

    res.status(201).json({
      success: true,
      problem: populatedProblem,
    });
  } catch (error) {
    next(error);
  }
};

export const getProblems = async (req, res, next) => {
  try {
    const { status, location } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (location) filter.location = { $regex: location, $options: "i" };

    const problems = await Problem.find(filter)
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    next(error);
  }
};

export const getProblemById = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id).populate(
      "user",
      "name email avatar"
    );

    if (!problem) {
      throw new ApiError(404, "Problem not found");
    }

    // Get solutions for this problem
    const solutions = await Solution.find({ problem: req.params.id })
      .populate("user", "name email avatar")
      .populate("comments.user", "name avatar")
      .sort({ upvoteCount: -1 });

    res.status(200).json({
      success: true,
      problem,
      solutions,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProblem = async (req, res, next) => {
  try {
    let problem = await Problem.findById(req.params.id);

    if (!problem) {
      throw new ApiError(404, "Problem not found");
    }

    // Check if user owns the problem
    if (problem.user.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not authorized to update this problem");
    }

    problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("user", "name email avatar");

    res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      throw new ApiError(404, "Problem not found");
    }

    // Check if user owns the problem
    if (problem.user.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not authorized to delete this problem");
    }

    // Delete all solutions for this problem
    await Solution.deleteMany({ problem: req.params.id });

    await problem.deleteOne();

    res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
