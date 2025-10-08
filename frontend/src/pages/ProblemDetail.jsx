import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

const ProblemDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [solution, setSolution] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await api.get(`/problems/${id}`);
        setProblem(data);
      } catch (err) {
        setError("Failed to fetch problem details");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleSolutionSubmit = async (e) => {
    e.preventDefault();
    if (!solution.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await api.post(`/solutions/problems/${id}/solutions`, {
        description: solution,
      });
      setProblem((prev) => ({
        ...prev,
        solutions: [...(prev.solutions || []), data],
      }));
      setSolution("");
    } catch (err) {
      setError(
        "Failed to submit solution: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (solutionId) => {
    try {
      await api.put(`/solutions/${solutionId}/upvote`);
      setProblem((prev) => ({
        ...prev,
        solutions: prev.solutions.map((sol) =>
          sol._id === solutionId ? { ...sol, upvotes: sol.upvotes + 1 } : sol
        ),
      }));
    } catch (err) {
      setError("Failed to upvote solution");
    }
  };

  const handleCommentSubmit = async (e, solutionId) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const { data } = await api.post(`/solutions/${solutionId}/comments`, {
        text: comment,
      });
      setProblem((prev) => ({
        ...prev,
        solutions: prev.solutions.map((sol) =>
          sol._id === solutionId
            ? { ...sol, comments: [...(sol.comments || []), data] }
            : sol
        ),
      }));
      setComment("");
    } catch (err) {
      setError(
        "Failed to add comment: " + (err.response?.data?.message || err.message)
      );
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading problem details...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-red-100 text-red-700 rounded">
        {error}
      </div>
    );
  }

  if (!problem) {
    return <div className="text-center py-10">Problem not found</div>;
  }

  return (
    <div className="container py-4">
      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          {/* Solution Form */}
          {user ? (
            <div className="card shadow mb-4">
              <div className="card-body">
                <h2 className="card-title h5 mb-3">Add Your Solution</h2>
                {error && (
                  <div className="alert alert-danger mb-3">{error}</div>
                )}
                <form onSubmit={handleSolutionSubmit}>
                  <div className="mb-3">
                    <textarea
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      className="form-control"
                      rows="4"
                      placeholder="Share your solution..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Solution"}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="alert alert-info mb-4">
              <p className="mb-0">
                Please{" "}
                <a href="/login" className="fw-bold">
                  log in
                </a>{" "}
                to add your solution.
              </p>
            </div>
          )}

          {/* Solutions List */}
          <div className="card shadow">
            <div className="card-header bg-white">
              <h2 className="h5 mb-0">
                Solutions ({problem.solutions?.length || 0})
              </h2>
            </div>
            <div className="card-body">
              {problem.solutions && problem.solutions.length > 0 ? (
                <div className="solution-list">
                  {problem.solutions.map((sol) => (
                    <div key={sol._id} className="border-bottom pb-3 mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <p className="fw-bold mb-0">
                            {sol.user?.name || "Anonymous"}
                          </p>
                          <p className="text-muted small">
                            {new Date(sol.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <button
                            onClick={() => handleUpvote(sol._id)}
                            className={`btn btn-sm ${
                              sol.upvotedBy?.includes(user?._id)
                                ? "btn-success"
                                : "btn-outline-primary"
                            }`}
                            disabled={!user}
                          >
                            <i className="bi bi-hand-thumbs-up me-1"></i>
                            <span>{sol.upvotes || 0}</span>
                          </button>
                        </div>
                      </div>
                      <div className="card-text mb-3 p-2 bg-light rounded">
                        {sol.description || sol.content}
                      </div>

                      {/* Comments Section */}
                      <div className="mt-3 ps-3 border-start border-primary">
                        <h5 className="h6 mb-2">
                          <i className="bi bi-chat-dots me-1"></i>
                          Comments ({sol.comments?.length || 0})
                        </h5>

                        {sol.comments && sol.comments.length > 0 ? (
                          <div className="mb-3">
                            {sol.comments.map((comment) => (
                              <div
                                key={comment._id}
                                className="mb-2 small p-2 bg-light rounded"
                              >
                                <div className="d-flex align-items-center mb-1">
                                  <span className="fw-bold">
                                    {comment.user?.name || "Anonymous"}
                                  </span>
                                  <small className="text-muted ms-2">
                                    {new Date(
                                      comment.createdAt
                                    ).toLocaleDateString()}
                                  </small>
                                </div>
                                <span>{comment.text || comment.content}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted small mb-3">
                            No comments yet
                          </p>
                        )}

                        {user && (
                          <form
                            onSubmit={(e) => handleCommentSubmit(e, sol._id)}
                            className="d-flex mt-3"
                          >
                            <div className="input-group">
                              <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="form-control form-control-sm"
                                placeholder="Add a comment..."
                                required
                              />
                              <button
                                type="submit"
                                className="btn btn-sm btn-primary"
                              >
                                <i className="bi bi-send me-1"></i>
                                Post
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">
                  No solutions yet. Be the first to contribute!
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProblemDetail;
