// src/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">404</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Page Not Found
          </p>
        </div>
        <div className="mt-8">
          <div className="text-sm">
            <p className="text-gray-600 mb-4">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <Link
              to="/"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Go back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;