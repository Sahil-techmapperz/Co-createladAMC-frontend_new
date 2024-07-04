import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Get the token from localStorage
  
  if (!token) {
    // If there is no token, the user is not logged in
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds

    if (decodedToken.exp < currentTime) {
      // Token is expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />; // Redirect to login page
    }
    
    // Token is not expired, render the protected component
    return children;
  } catch (error) {
    // If there's an error decoding the token (e.g., it is invalid)
    localStorage.removeItem('token'); // Remove the possibly corrupted token
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />; // Redirect to login page
  }
};

export default ProtectedRoute;
