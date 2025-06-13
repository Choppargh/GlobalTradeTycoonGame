import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-8" style={{
      backgroundImage: `url('/images/GTC_Background.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 border border-white rounded-md bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
          >
            Back to Home
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow p-8">
          <div className="prose max-w-none">
            <p className="text-sm text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl font-semibold mb-4">Introduction</h2>
            <p className="mb-4">
              Global Trade Tycoon ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our trading game application.
            </p>

            <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
            <h3 className="text-lg font-medium mb-2">Personal Information</h3>
            <p className="mb-4">When you create an account or use our services, we may collect:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Username and display name</li>
              <li>Email address (when using email registration)</li>
              <li>Profile information from third-party services (Google, Twitter) when you use social login</li>
              <li>Game progress and scores</li>
            </ul>

            <h3 className="text-lg font-medium mb-2">Automatically Collected Information</h3>
            <ul className="list-disc ml-6 mb-4">
              <li>Device information and browser type</li>
              <li>IP address and general location</li>
              <li>Usage patterns and game statistics</li>
              <li>Session information and preferences</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>Provide and maintain the game service</li>
              <li>Create and manage your account</li>
              <li>Save your game progress and scores</li>
              <li>Display leaderboards and statistics</li>
              <li>Improve our game and user experience</li>
              <li>Communicate with you about the service</li>
              <li>Ensure fair play and prevent abuse</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">Information Sharing</h2>
            <p className="mb-4">We do not sell, trade, or rent your personal information. We may share information in these limited circumstances:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>In connection with a business transfer</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">Third-Party Services</h2>
            <p className="mb-4">
              Our application integrates with third-party authentication services (Google OAuth, Twitter OAuth). These services have their own privacy policies, and we encourage you to review them. We only receive basic profile information necessary for account creation.
            </p>

            <h2 className="text-xl font-semibold mb-4">Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Withdraw consent for data processing</li>
              <li>Receive a copy of your data</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">Children's Privacy</h2>
            <p className="mb-4">
              Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
            </p>

            <h2 className="text-xl font-semibold mb-4">Cookies and Local Storage</h2>
            <p className="mb-4">
              We use cookies and local storage to maintain your login session, save game preferences, and improve your experience. You can control cookie settings through your browser.
            </p>

            <h2 className="text-xl font-semibold mb-4">Updates to Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy periodically. We will notify you of significant changes by posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us through the game interface or visit our support page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}