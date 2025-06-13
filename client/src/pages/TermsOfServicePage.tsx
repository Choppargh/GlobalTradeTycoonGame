import React from 'react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen py-8" style={{
      backgroundImage: `url('/images/GTC_Background.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
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
            
            <h2 className="text-xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using Global Trade Tycoon ("the Game," "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our service.
            </p>

            <h2 className="text-xl font-semibold mb-4">Description of Service</h2>
            <p className="mb-4">
              Global Trade Tycoon is a web-based trading simulation game where players engage in virtual commerce across different global markets. The game includes features such as user accounts, leaderboards, progress tracking, and social authentication.
            </p>

            <h2 className="text-xl font-semibold mb-4">User Accounts</h2>
            <h3 className="text-lg font-medium mb-2">Account Creation</h3>
            <ul className="list-disc ml-6 mb-4">
              <li>You may create an account using email/password or third-party authentication (Google, Twitter)</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You must provide accurate and complete information when creating your account</li>
              <li>You are responsible for all activities that occur under your account</li>
            </ul>

            <h3 className="text-lg font-medium mb-2">Account Restrictions</h3>
            <ul className="list-disc ml-6 mb-4">
              <li>One account per person</li>
              <li>You must be at least 13 years old to create an account</li>
              <li>Accounts used for fraudulent purposes will be terminated</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">Acceptable Use</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Use the service for any unlawful purpose or in violation of applicable laws</li>
              <li>Attempt to gain unauthorized access to the service or other users' accounts</li>
              <li>Use automated scripts, bots, or other means to manipulate gameplay</li>
              <li>Exploit bugs or glitches for unfair advantage</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Upload or transmit viruses, malware, or other harmful code</li>
              <li>Reverse engineer, decompile, or attempt to extract source code</li>
              <li>Create multiple accounts to manipulate leaderboards</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">Game Rules and Fair Play</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>Players must follow the established game mechanics and rules</li>
              <li>Cheating, exploiting, or manipulating game systems is prohibited</li>
              <li>Leaderboard scores must be achieved through legitimate gameplay</li>
              <li>We reserve the right to reset or remove scores that violate fair play principles</li>
              <li>Players found violating game rules may face account restrictions or termination</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">Privacy and Data</h2>
            <p className="mb-4">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. By using the service, you consent to our data practices as described in the Privacy Policy.
            </p>

            <h2 className="text-xl font-semibold mb-4">Intellectual Property</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>The game, including all content, features, and functionality, is owned by us and protected by copyright and other intellectual property laws</li>
              <li>You may not copy, modify, distribute, or create derivative works based on the game</li>
              <li>All game assets, including graphics, text, and code, remain our property</li>
              <li>User-generated content (usernames, game data) remains subject to these terms</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">Service Availability</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>We strive to maintain service availability but cannot guarantee 100% uptime</li>
              <li>Scheduled maintenance may temporarily interrupt service</li>
              <li>We reserve the right to modify or discontinue features with notice when possible</li>
              <li>Game progress is automatically saved, but we recommend not relying solely on our servers</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="mb-4">
              The service is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses.
            </p>

            <h2 className="text-xl font-semibold mb-4">Indemnification</h2>
            <p className="mb-4">
              You agree to indemnify and hold us harmless from any claims, damages, losses, or expenses arising from your use of the service or violation of these terms.
            </p>

            <h2 className="text-xl font-semibold mb-4">Termination</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>You may terminate your account at any time by contacting us</li>
              <li>We may terminate or suspend your account for violations of these terms</li>
              <li>Upon termination, your right to use the service ceases immediately</li>
              <li>We may retain certain information as required by law or for legitimate business purposes</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">Third-Party Services</h2>
            <p className="mb-4">
              Our service integrates with third-party authentication providers (Google, Twitter). Your use of these services is subject to their respective terms of service and privacy policies.
            </p>

            <h2 className="text-xl font-semibold mb-4">Updates to Terms</h2>
            <p className="mb-4">
              We may update these Terms of Service from time to time. Significant changes will be communicated through the service or via email. Continued use of the service after changes constitutes acceptance of the updated terms.
            </p>

            <h2 className="text-xl font-semibold mb-4">Governing Law</h2>
            <p className="mb-4">
              These terms shall be interpreted and governed in accordance with applicable laws. Any disputes will be resolved through appropriate legal channels.
            </p>

            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <p className="mb-4">
              If you have questions about these Terms of Service, please contact us through the game interface or visit our support page.
            </p>

            <h2 className="text-xl font-semibold mb-4">Severability</h2>
            <p className="mb-4">
              If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}