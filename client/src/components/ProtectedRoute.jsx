import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // LocalStorage থেকে টোকেন আপডেট চেক করা
    const currentToken = localStorage.getItem('token');
    setToken(currentToken);
    setIsLoading(false);
  }, []);

  // চেক করার সময় সামান্য লোডিং স্টেট দেখানো
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p className="text-sm opacity-70">Checking authentication...</p>
      </div>
    );
  }

  // টোকেন না থাকলে সরাসরি /login Route-এ পাঠাবে
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // টোকেন থাকলে মেইন পেজ/চাইল্ড কম্পোনেন্ট রেন্ডার করবে
  return children;
};

export default ProtectedRoute;