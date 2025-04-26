import { useState, useMemo } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { generateFinancialPlan } from '../utils/financialPlanner';
import InvestmentForm from '../components/forms/InvestmentForm';

const Investments = () => {
  const { financialData } = useFinancial();
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const { monthlyIncome, monthlyExpenses, goals, riskTolerance = 'moderate' } = financialData;
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');

  const portfolio = useMemo(() => {
    if (!goals || goals.length === 0) {
      return {
        totalValue: 0,
        lastUpdated: new Date().toISOString().split('T')[0],
        assets: []
      };
    }

    const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const plan = generateFinancialPlan({
      monthlyIncome,
      monthlyExpenses,
      targetAmount: totalTargetAmount,
      targetDate: Math.max(...goals.map(g => new Date(g.targetDate))),
      riskTolerance,
      recommendedMonthlySaving: goals.reduce((sum, goal) => sum + goal.recommendedMonthlySaving, 0)
    });

    const { allocation } = plan.investment.monthlyInvestmentPlan;
    const totalValue = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

    return {
      totalValue,
      lastUpdated: new Date().toISOString().split('T')[0],
      assets: allocation.map((asset, index) => ({
        id: index + 1,
        name: asset.type,
        value: (totalValue * asset.percentage) / 100,
        allocation: asset.percentage,
        returns: parseFloat(plan.investment.monthlyInvestmentPlan.expectedReturn.split('-')[0]),
        risk: asset.description
      }))
    };
  }, [goals, monthlyIncome, monthlyExpenses, riskTolerance]);

  // Calculate performance data based on risk profile and investment timeline
  const performanceData = useMemo(() => {
    if (!portfolio) return {};
    
    const baseReturns = {
      conservative: { monthly: 0.6, benchmark: 0.5 },
      moderate: { monthly: 0.8, benchmark: 0.7 },
      aggressive: { monthly: 1.0, benchmark: 0.9 }
    }[riskTolerance];

    const calculateCompoundReturns = (monthlyReturn, months) => {
      return ((1 + monthlyReturn / 100) ** months - 1) * 100;
    };

    return {
      '1M': {
        return: baseReturns.monthly.toFixed(1),
        benchmark: baseReturns.benchmark.toFixed(1)
      },
      '3M': {
        return: calculateCompoundReturns(baseReturns.monthly, 3).toFixed(1),
        benchmark: calculateCompoundReturns(baseReturns.benchmark, 3).toFixed(1)
      },
      '6M': {
        return: calculateCompoundReturns(baseReturns.monthly, 6).toFixed(1),
        benchmark: calculateCompoundReturns(baseReturns.benchmark, 6).toFixed(1)
      },
      '1Y': {
        return: calculateCompoundReturns(baseReturns.monthly, 12).toFixed(1),
        benchmark: calculateCompoundReturns(baseReturns.benchmark, 12).toFixed(1)
      },
      '3Y': {
        return: calculateCompoundReturns(baseReturns.monthly, 36).toFixed(1),
        benchmark: calculateCompoundReturns(baseReturns.benchmark, 36).toFixed(1)
      }
    };
  }, [portfolio, riskTolerance]);

  const calculateTotalReturns = () => {
    const totalInvestment = portfolio.assets.reduce((sum, asset) => sum + asset.value, 0);
    const weightedReturns = portfolio.assets.reduce((sum, asset) => {
      return sum + (asset.returns * (asset.value / totalInvestment));
    }, 0);
    return weightedReturns.toFixed(2);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Investment Portfolio</h1>
        <button
          onClick={() => setShowInvestmentForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Add Investment
        </button>
      </div>

      {showInvestmentForm && (
        <InvestmentForm onClose={() => setShowInvestmentForm(false)} />
      )}

      {portfolio ? (
        <>
          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Total Portfolio Value</h3>
              <p className="text-2xl font-bold text-primary-600 mt-2">
                ₹{portfolio.totalValue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">Last updated: {portfolio.lastUpdated}</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Portfolio Returns</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">{calculateTotalReturns()}%</p>
              <p className="text-sm text-gray-500 mt-1">Weighted average returns</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Risk Profile</h3>
              <p className="text-2xl font-bold text-primary-600 mt-2">{riskTolerance}</p>
              <p className="text-sm text-gray-500 mt-1">Based on current allocation</p>
            </div>
          </div>

          {/* Asset Allocation */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Asset Allocation</h2>
              <div className="space-y-4">
                {portfolio.assets.map(asset => (
                  <div key={asset.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{asset.name}</h3>
                        <p className="text-sm text-gray-500">Risk: {asset.risk}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{asset.value.toLocaleString()}</p>
                        <p className="text-sm text-green-600">+{asset.returns}% returns</p>
                      </div>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-200">
                            {asset.allocation}% allocation
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                        <div
                          style={{ width: `${asset.allocation}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Comparison */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Performance Comparison</h2>
                <div className="space-x-2">
                  {Object.keys(performanceData).map(timeframe => (
                    <button
                      key={timeframe}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={`px-3 py-1 rounded ${selectedTimeframe === timeframe ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">Your Portfolio</p>
                    <p className="text-green-600 font-medium">
                      +{performanceData[selectedTimeframe]?.return}%
                    </p>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${performanceData[selectedTimeframe]?.return}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">Market Benchmark</p>
                    <p className="text-blue-600 font-medium">
                      +{performanceData[selectedTimeframe]?.benchmark}%
                    </p>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${performanceData[selectedTimeframe]?.benchmark}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
          <h3 className="text-lg font-semibold text-gray-900">No Investment Data Available</h3>
          <p className="text-gray-500 mt-2">Please add financial goals to view your investment portfolio.</p>
        </div>
      )}
    </div>
  );
};

export default Investments;