import { useState } from 'react';
import api from '../api/axios';

const Comment = ({ solutionId, onCommentAdded }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setLoading(true);
    try {
      const { data } = await api.post(`/solutions/${solutionId}/comments`, { content: comment });
      onCommentAdded(data);
      setComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex">
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
        disabled={loading}
        className="bg-gray-200 text-gray-800 px-3 py-1 text-sm rounded-r hover:bg-gray-300 transition duration-200 disabled:bg-gray-100"
      >
        {loading ? '...' : 'Post'}
      </button>
    </form>
  );
};

export default Comment;