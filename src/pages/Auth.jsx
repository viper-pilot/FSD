import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Login from '../components/auth/Login';
// Ensure consistent import
import Signup from '../components/auth/Signup';  // lowercase 'u'
import '../styles/auth.css';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [authType, setAuthType] = useState('login');

  useEffect(() => {
    const type = searchParams.get('type');
    setAuthType(type === 'signup' ? 'signup' : 'login');
  }, [searchParams]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{authType === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <div className="auth-toggle">
            <button 
              className={authType === 'login' ? 'active' : ''}
              onClick={() => setAuthType('login')}
            >
              Login
            </button>
            <button 
              className={authType === 'signup' ? 'active' : ''}
              onClick={() => setAuthType('signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
        
        {authType === 'login' ? <Login /> : <Signup />}
      </div>
    </div>
  );
}