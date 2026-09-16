import React from 'react';
import Login from './Login';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Login />;
  }

  return children;
}