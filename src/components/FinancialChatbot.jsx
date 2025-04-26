import { useState, useEffect, useRef } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { generateFinancialPlan } from '../utils/financialPlanner';
import { analyzeFinancialGoals, getInvestmentRecommendations } from '../services/financialAdvisor';
import ChatbotGRU from '../utils/chatbotGRU';

const knowledgeBase = {
  'stock market': {
    basics: [
      'Stocks represent ownership in a company',
      'Stock prices fluctuate based on supply and demand',
      'Diversification helps reduce investment risk',
      'Market indices like SENSEX and NIFTY track overall market performance'
    ],
    tips: [
      'Start with blue-chip stocks for stability',
      'Research companies before investing',
      'Consider long-term investment horizons',
      'Monitor market trends and news'
    ]
  },
  'sip': {
    basics: [
      'SIP stands for Systematic Investment Plan',
      'Allows regular investment in mutual funds',
      'Benefits from rupee cost averaging',
      'Helps build long-term wealth through disciplined investing'
    ],
    advantages: [
      'Automated investment process',
      'Start with small amounts',
      'Reduces market timing risk',
      'Power of compounding'
    ]
  },
  'mutual funds': {
    types: [
      'Equity funds - invest in stocks',
      'Debt funds - invest in bonds',
      'Hybrid funds - mix of equity and debt',
      'Index funds - track market indices'
    ],
    benefits: [
      'Professional management',
      'Portfolio diversification',
      'Liquidity and flexibility',
      'Regulated by SEBI'
    ]
  },
  'budgeting': {
    strategies: [
      '50/30/20 rule - needs/wants/savings',
      'Zero-based budgeting',
      'Envelope method',
      'Digital expense tracking'
    ]
  }
};

const FinancialChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { financialData } = useFinancial();
  const [chatbot] = useState(() => new ChatbotGRU());
  const [isModelReady, setIsModelReady] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize and train the GRU model when component mounts
    const initializeModel = async () => {
      try {
        setIsTyping(true);
        setIsModelReady(false);
        // Comprehensive training data for financial domain
        const trainingData = [
          { input: 'investment strategy', output: 'investment_response' },
          { input: 'portfolio analysis', output: 'portfolio_response' },
          { input: 'market insights', output: 'market_response' },
          { input: 'financial planning', output: 'planning_response' },
          { input: 'risk assessment', output: 'risk_response' },
          { input: 'stock market advice', output: 'investment_response' },
          { input: 'mutual funds', output: 'investment_response' },
          { input: 'portfolio performance', output: 'portfolio_response' },
          { input: 'market trends', output: 'market_response' },
          { input: 'retirement planning', output: 'planning_response' },
          // Add more domain-specific training examples
          { input: 'tax planning', output: 'planning_response' },
          { input: 'wealth management', output: 'investment_response' },
          { input: 'emergency fund', output: 'planning_response' },
          { input: 'debt management', output: 'planning_response' },
          { input: 'insurance advice', output: 'risk_response' }
        ];
    
        // Initialize and train the model with progress tracking
        await chatbot.train(trainingData);
        console.log('Model training completed successfully');
        setIsModelReady(true);
        
        // Add welcome message after model is ready
        setMessages([{
          text: 'Hello! I\'m your AI Financial Assistant powered by GRU. I can help you with:\n• Investment strategies\n• Portfolio analysis\n• Market insights\n• Financial planning\n• Tax optimization\n• Wealth building strategies\n\nHow can I assist you today?',
          sender: 'bot'
        }]);
      } catch (error) {
        console.error('Error initializing chatbot model:', error);
        setMessages([{
          text: 'I apologize, but I encountered an issue during initialization. Please try refreshing the page.',
          sender: 'bot'
        }]);
      } finally {
        setIsTyping(false);
      }
    };

    initializeModel();
  }, []);

  const generateResponse = async (query) => {
    if (!isModelReady) {
      return 'I\'m still initializing. Please try again in a moment.';
    }

    // Get enhanced response using GRU model
    const enhancedResponse = await chatbot.getEnhancedResponse(query, financialData);
    chatbot.updateContext(messages);
    setIsTyping(true);
    let response = '';

    try {
      // Process query to identify topics and investment-related keywords
      const queryLower = query.toLowerCase();
      let matchedTopics = [];
      
      // Check if query is about investment strategies
      if (queryLower.includes('investment') || queryLower.includes('invest') || queryLower.includes('strategy')) {
        try {
          const riskProfile = financialData?.riskTolerance || 'moderate';
          const investmentAmount = financialData?.monthlyIncome ? financialData.monthlyIncome * 12 : 100000;
          
          const recommendations = getInvestmentRecommendations(riskProfile, investmentAmount);
          
          response = `Based on your ${riskProfile} risk profile, here's a recommended investment strategy:\n\n`;
          
          // Add allocation recommendations
          response += 'Asset Allocation:\n';
          recommendations.allocation.forEach(asset => {
            response += `• ${asset.type} (${asset.percentage}%) - ${asset.description}\n`;
            if (asset.suggestedAmount) {
              response += `  Suggested Amount: ₹${asset.suggestedAmount.toLocaleString()}\n`;
            }
          });
          
          response += `\nExpected Returns: ${recommendations.expectedReturns}\n`;
          response += `Recommended Rebalancing: ${recommendations.rebalancingFrequency}\n`;
          response += `Minimum Investment Period: ${recommendations.minimumInvestmentPeriod}\n\n`;
          
          // Add suggested funds
          response += 'Recommended Funds:\n';
          recommendations.suggestedFunds.forEach(fund => {
            response += `• ${fund.name}\n  Type: ${fund.type}, Risk: ${fund.risk}\n  Min Investment: ₹${fund.minInvestment.toLocaleString()}\n`;
          });
          
          return response;
        } catch (error) {
          console.error('Error generating investment recommendations:', error);
          response = 'Here are some general investment principles:\n\n';
          response += '• Diversify your portfolio across multiple asset classes\n';
          response += '• Start with small, regular investments (SIP)\n';
          response += '• Research thoroughly before investing\n';
          response += '• Monitor and rebalance periodically\n';
          response += '• Consider your investment horizon\n';
          response += '• Consult with a financial advisor for personalized advice\n';
          return response;
        }
      }
      
      // Check knowledge base for other topics
      for (const [topic, info] of Object.entries(knowledgeBase)) {
        if (queryLower.includes(topic)) {
          matchedTopics.push({ topic, info });
        }
      }

      if (matchedTopics.length > 0) {
        // Provide information from knowledge base
        response = 'Here\'s what I know about your query:\n\n';
        
        matchedTopics.forEach(({ topic, info }) => {
          response += `About ${topic.toUpperCase()}:\n\n`;
          
          for (const [category, points] of Object.entries(info)) {
            response += `${category.charAt(0).toUpperCase() + category.slice(1)}:\n`;
            points.forEach(point => {
              response += `• ${point}\n`;
            });
            response += '\n';
          }
        });
      } else if (financialData) {
        // Get personalized recommendations based on user's financial data
        const goals = await analyzeFinancialGoals({
          ...financialData,
          query
        });

        const plan = generateFinancialPlan({
          monthlyIncome: financialData.monthlyIncome || 0,
          monthlyExpenses: financialData.monthlyExpenses || 0,
          targetAmount: goals.targetAmount || 0,
          timeline: goals.timeline || 5,
          riskTolerance: financialData.riskTolerance || 'moderate'
        });

        response = `Based on your financial profile and query, here are my recommendations:\n\n`;
        
        if (plan.suggestions && plan.suggestions.length > 0) {
          plan.suggestions.forEach(suggestion => {
            response += `${suggestion.title}:\n`;
            suggestion.steps.forEach(step => {
              response += `• ${step}\n`;
            });
            response += '\n';
          });
        }

        if (plan.investmentPlan) {
          response += `Investment Allocation Suggestion:\n`;
          plan.investmentPlan.allocation.forEach(item => {
            response += `• ${item.type}: ${item.percentage}% - ${item.description}\n`;
          });
          response += `\nExpected Annual Return: ${plan.investmentPlan.expectedReturn}`;
        }
      } else {
        response = 'I can provide more personalized recommendations if you update your financial profile. For now, here\'s some general advice:\n\n';
        response += '• Start with a clear financial goal\n';
        response += '• Create a budget and track expenses\n';
        response += '• Build an emergency fund\n';
        response += '• Consider diversifying investments\n';
        response += '• Review and adjust your strategy regularly\n';
      }
    } catch (error) {
      console.error('Error generating response:', error);
      response = 'I apologize, but I encountered an error while processing your request. Please try again or rephrase your question.';
    }

    setIsTyping(false);
    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !isModelReady) {
      if (!isModelReady) {
        setMessages(prev => [...prev, {
          text: "The model is still initializing. Please wait a moment before trying again.",
          sender: 'bot'
        }]);
      }
      return;
    }

    const userMessage = {
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await generateResponse(currentInput);
      const botResponse = { text: responseText, sender: 'bot' };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error in chat response:', error);
      const errorResponse = { 
        text: 'Sorry, I encountered an error. Please try again.', 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${message.sender === 'user'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-800'
                }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{message.text}</pre>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about your finances..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            disabled={!input.trim() || isTyping}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default FinancialChatbot;