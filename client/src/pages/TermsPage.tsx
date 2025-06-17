import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and playing Global Trading Tycoon, you agree to be bound by these Terms of Service 
              and our Privacy Policy. If you do not agree to these terms, please do not use our service.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Game Rules and Fair Play</h2>
            <p className="text-gray-700 mb-4">
              Global Trading Tycoon is a trading simulation game. Users are expected to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Play fairly and not attempt to exploit game mechanics</li>
              <li>Not use automated tools or scripts to gain unfair advantages</li>
              <li>Respect other players in leaderboard competitions</li>
              <li>Use authentic information when creating accounts</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">User Accounts</h2>
            <p className="text-gray-700 mb-4">
              You are responsible for maintaining the confidentiality of your account and for all activities 
              that occur under your account. You agree to notify us immediately of any unauthorized use of 
              your account.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              The game, including all content, features, and functionality, is owned by Global Trading Tycoon 
              and is protected by copyright and other intellectual property laws.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              Global Trading Tycoon is provided "as is" without warranties of any kind. We shall not be 
              liable for any damages arising from the use of this game.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Termination</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to terminate or suspend accounts that violate these terms or engage 
              in unfair play.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these terms at any time. Continued use of the service 
              constitutes acceptance of the modified terms.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about these Terms of Service, please contact us through the game interface.
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