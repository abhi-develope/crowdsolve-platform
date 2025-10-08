import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Home = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await api.get("/problems");
        setProblems(data.problems || []);
      } catch (err) {
        setError("Failed to fetch problems. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading problems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <h1 className="mb-3 mb-md-0">Community Problems</h1>
        <Link to="/post-problem" className="btn btn-primary">
          Post a Problem
        </Link>
      </div>

      {problems.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">
            No problems have been posted yet. Be the first to post a problem!
          </p>
        </div>
      ) : (
        <div className="row">
          {problems.map((problem) => (
            <div className="col-md-6 col-lg-4 mb-4" key={problem._id}>
              <div className="card h-100">
                {problem.image && (
                  <img
                    src={problem.image}
                    className="card-img-top"
                    alt={problem.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{problem.title}</h5>
                  <p className="card-text text-truncate">
                    {problem.description}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link
                      to={`/problems/${problem._id}`}
                      className="btn btn-outline-primary"
                    >
                      Add Solution
                    </Link>
                    <span className="badge bg-secondary">
                      {problem.location}
                    </span>
                  </div>
                </div>
                <div className="card-footer text-muted">
                  <small>Posted by {problem.user?.name || "Anonymous"}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
