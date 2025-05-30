import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './pages/Dashboard'; // Make sure path is correct
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Route */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          
          {/* Fallback Route */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;