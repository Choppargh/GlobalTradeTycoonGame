import React from 'react';

export default function SimpleHomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Homepage Working!</h1>
        <p className="text-gray-600">This confirms React Router is functioning properly.</p>
        <p className="text-sm text-gray-500 mt-2">Simple HomePage component loaded successfully</p>
      </div>
    </div>
  );
}