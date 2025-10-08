import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const ProblemDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [solution, setSolution] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await api.get(`/problems/${id}`);
        setProblem(data);
      } catch (err) {
        setError('Failed to fetch problem details');
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
      const { data } = await api.post(`/solutions/problems/${id}/solutions`, { content: solution });
      setProblem(prev => ({
        ...prev,
        solutions: [...(prev.solutions || []), data]
      }));
      setSolution('');
    } catch (err) {
      setError('Failed to submit solution');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (solutionId) => {
    try {
      await api.put(`/solutions/${solutionId}/upvote`);
      setProblem(prev => ({
        ...prev,
        solutions: prev.solutions.map(sol => 
          sol._id === solutionId 
            ? { ...sol, upvotes: sol.upvotes + 1 } 
            : sol
        )
      }));
    } catch (err) {
      setError('Failed to upvote solution');
    }
  };

  const handleCommentSubmit = async (e, solutionId) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    try {
      const { data } = await api.post(`/solutions/${solutionId}/comments`, { content: comment });
      setProblem(prev => ({
        ...prev,
        solutions: prev.solutions.map(sol => 
          sol._id === solutionId 
            ? { ...sol, comments: [...(sol.comments || []), data] } 
            : sol
        )
      }));
      setComment('');
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading problem details...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto mt-10 p-6 bg-red-100 text-red-700 rounded">{error}</div>;
  }

  if (!problem) {
    return <div className="text-center py-10">Problem not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        {problem.image && (
          <div className="w-full h-64 overflow-hidden">
            <img 
              src={problem.image} 
              alt={problem.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{problem.title}</h1>
          <p className="text-gray-600 mb-4">{problem.description}</p>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span className="mr-4">Location: {problem.location}</span>
            <span>Posted by: {problem.user?.name || 'Anonymous'}</span>
          </div>
        </div>
      </div>

      {user && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit a Solution</h2>
          <form onSubmit={handleSolutionSubmit}>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows="4"
              placeholder="Share your solution..."
              required
            ></textarea>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 disabled:bg-blue-400"
            >
              {submitting ? 'Submitting...' : 'Submit Solution'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Solutions ({problem.solutions?.length || 0})</h2>
        
        {problem.solutions?.length === 0 ? (
          <p className="text-gray-600">No solutions yet. Be the first to contribute!</p>
        ) : (
          <div className="space-y-6">
            {problem.solutions?.map((sol) => (
              <div key={sol._id} className="border-b border-gray-200 pb-6 last:border-0">
                <p className="text-gray-800 mb-3">{sol.content}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">By: {sol.user?.name || 'Anonymous'}</span>
                  <div className="flex items-center">
                    <button
                      onClick={() => user && handleUpvote(sol._id)}
                      disabled={!user}
                      className="flex items-center text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{sol.upvotes || 0}</span>
                    </button>
                  </div>
                </div>

                {/* Comments section */}
                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Comments ({sol.comments?.length || 0})</h3>
                  
                  {sol.comments?.map((comment) => (
                    <div key={comment._id} className="mb-2 text-sm">
                      <p className="text-gray-800">{comment.content}</p>
                      <span className="text-xs text-gray-500">By: {comment.user?.name || 'Anonymous'}</span>
                    </div>
                  ))}
                  
                  {user && (
                    <form onSubmit={(e) => handleCommentSubmit(e, sol._id)} className="mt-2 flex">
                      <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="flex-grow px-3 py-1 text-sm border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Add a comment..."
                        required
                      />
                      <button
                        type="submit"
                        className="bg-gray-200 text-gray-800 px-3 py-1 text-sm rounded-r hover:bg-gray-300 transition duration-200"
                      >
                        Post
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDetail;