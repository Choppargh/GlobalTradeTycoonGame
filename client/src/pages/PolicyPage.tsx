import React from 'react';

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              Global Trading Tycoon collects minimal information necessary to provide our gaming service:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Account information (username, email, display name) when you register</li>
              <li>OAuth authentication data from third-party providers (Google, Twitter)</li>
              <li>Game progress and scores for leaderboard functionality</li>
              <li>Session data for authentication purposes</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use collected information to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Provide and maintain the game service</li>
              <li>Authenticate users and maintain game sessions</li>
              <li>Display leaderboards and track game progress</li>
              <li>Improve our service and user experience</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Data Storage and Security</h2>
            <p className="text-gray-700 mb-4">
              Your data is stored securely using industry-standard encryption and security practices. 
              Game data is stored locally in your browser and synchronized with our secure servers.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              We use OAuth authentication with Google and Twitter. Please review their respective 
              privacy policies for information about how they handle your data.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this privacy policy, please contact us through the game interface.
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}