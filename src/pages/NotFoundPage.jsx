// NotFoundPage.js

import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-5xl font-bold text-gray-800">404 Not Found</h1>
      <p className="text-xl text-gray-600 mt-4">The page you are looking for does not exist.</p>
      <a href="/" className="mt-6 text-lg text-blue-600 hover:text-blue-800 transition duration-300">Go Home</a>
    </div>
  );
};

export default NotFoundPage;
