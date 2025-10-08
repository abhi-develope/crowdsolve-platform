import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostProblem from './pages/PostProblem';
import ProblemDetail from './pages/ProblemDetail';

function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100 bg-light">
        <Navbar />
        <main className="flex-grow-1 container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/post-problem" element={<PostProblem />} />
            <Route path="/problems/:id" element={<ProblemDetail />} />
          </Routes>
        </main>
        <footer className="bg-white py-3 shadow-sm">
          <div className="container text-center text-muted">
            &copy; {new Date().getFullYear()} CrowdSolve Platform. All rights reserved.
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;
