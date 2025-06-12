import React from 'react';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Game Rules</h1>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
          >
            Back to Home
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">🎯 Objective</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700">
                Build your trading empire by buying and selling products across different global markets. 
                Maximize your net worth (cash + bank balance - loan amount) within 7 days to compete on the global leaderboard.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">💰 Starting Conditions</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-2 text-gray-700">
                <li>• You start with $2,000 cash (from an initial loan)</li>
                <li>• You have $2,000 in loan debt (5% interest per day)</li>
                <li>• You have 7 days to trade</li>
                <li>• You start in a random location</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">🌍 Trading Mechanics</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-semibold mb-2">Market Prices</h4>
                  <p>Each location has different prices for products based on local supply and demand. Products are cheaper where they're produced and more expensive where they're in demand.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Trading Rules</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• You cannot sell products you bought at the same location on the same day</li>
                    <li>• You cannot buy products you sold at the same location on the same day</li>
                    <li>• Travel between locations costs 1 day</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Available Products</h4>
                  <p>Trade in commodities like Wheat, Corn, Coffee, Tea, Spices, Silk, Cotton, Gold, Silver, Oil, Electronics, and Pharmaceuticals.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">🏦 Banking System</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3 text-gray-700">
                <div>
                  <strong>Bank Account:</strong> Earn 3% interest per day on your bank balance
                </div>
                <div>
                  <strong>Loans:</strong> Borrow up to $10,000 total, but pay 5% interest per day
                </div>
                <div>
                  <strong>Strategy Tip:</strong> Keep money in the bank when not trading to earn interest!
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">⚡ Random Events</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3 text-gray-700">
                <p>Random events can occur while traveling or trading:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Market crashes or booms affecting product prices</li>
                  <li>• Cash bonuses from successful deals</li>
                  <li>• Inventory boosts from finding extra products</li>
                  <li>• Airport security delays or cash confiscation</li>
                  <li>• Product spoilage during travel</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">🏆 Scoring & Leaderboard</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3 text-gray-700">
                <div>
                  <strong>Final Score:</strong> Cash + Bank Balance - Loan Amount
                </div>
                <div>
                  <strong>Leaderboard:</strong> Compete globally with players worldwide
                </div>
                <div>
                  <strong>Reset:</strong> Leaderboard resets every Monday at midnight UTC
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <strong>Pro Tip:</strong> The key to success is finding price differences between locations and managing your time and money efficiently!
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">🎮 Controls</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3 text-gray-700">
                <div>
                  <strong>Buy Tab:</strong> Purchase products available in your current location
                </div>
                <div>
                  <strong>Sell Tab:</strong> Sell products from your inventory
                </div>
                <div>
                  <strong>Travel:</strong> Move to different global markets (costs 1 day)
                </div>
                <div>
                  <strong>Bank:</strong> Deposit, withdraw, borrow, or repay loans
                </div>
                <div>
                  <strong>End Game:</strong> Finish early to submit your score anytime
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => window.location.href = '/game'}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Start Trading Now
          </button>
        </div>
      </div>
    </div>
  );
}