import { useState, useEffect } from 'react';
import FinancialChatbot from '../components/FinancialChatbot';

const Assistant = () => {
  const [marketData, setMarketData] = useState({
    SENSEX: { value: 72000, change: '+1.2%' },
    NIFTY: { value: 21800, change: '+0.9%' },
    'USD/INR': { value: 82.5, change: '-0.3%' }
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Financial Assistant</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main chatbot interface */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-12rem)] flex flex-col overflow-hidden">
            <FinancialChatbot />
          </div>
        </div>

        {/* Quick access panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Topics</h2>
            <div className="space-y-2">
              {[
                'Investment Strategies',
                'Portfolio Analysis',
                'Risk Management',
                'Market Analysis',
                'Financial Planning',
                'Tax Optimization',
                'Wealth Building'
              ].map((topic, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-primary-50 text-primary-700 transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Market Updates</h2>
            <div className="space-y-4">
              {Object.entries(marketData).map(([index, data]) => (
                <div key={index} className="border-l-4 border-primary-500 pl-3">
                  <p className="text-sm font-medium">{index}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-semibold">{data.value}</p>
                    <p className={`text-sm font-medium ${data.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {data.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">AI Features</h2>
            <div className="space-y-3">
              <div className="p-3 bg-primary-50 rounded-lg">
                <h3 className="font-medium text-primary-700">Smart Analysis</h3>
                <p className="text-sm text-gray-600 mt-1">Get AI-powered insights on your portfolio performance</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <h3 className="font-medium text-primary-700">Risk Assessment</h3>
                <p className="text-sm text-gray-600 mt-1">Analyze investment risks with advanced AI models</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <h3 className="font-medium text-primary-700">Market Predictions</h3>
                <p className="text-sm text-gray-600 mt-1">Get market trend forecasts using AI algorithms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;