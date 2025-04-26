import { useState, useEffect } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { generateFinancialPlan } from '../utils/financialPlanner';
import { analyzeFinancialGoals } from '../services/financialAdvisor';

const Goals = () => {
  const { financialData, updateFinancialData } = useFinancial();
  const { goals = [], monthlyIncome = 0, monthlyExpenses = 0, riskTolerance = 'moderate' } = financialData;
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    currentAmount: 0,
    milestones: []
  });
  const [recommendations, setRecommendations] = useState([]);

  // Get recommendations when goals or financial data changes
  useEffect(() => {
    try {
      setLoading(true);
      const goalRecommendations = analyzeFinancialGoals({
        ...financialData,
        monthlyIncome,
        monthlyExpenses,
        riskTolerance,
        goals
      });
      setRecommendations(goalRecommendations || []);
    } catch (error) {
      console.error('Error analyzing goals:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [financialData, monthlyIncome, monthlyExpenses, riskTolerance, goals]);

  const calculateProgress = (currentAmount, targetAmount) => {
    return (currentAmount / targetAmount) * 100;
  };

  const getTimeRemaining = (targetDate) => {
    const remaining = new Date(targetDate) - new Date();
    const days = Math.ceil(remaining / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days remaining` : 'Deadline passed';
  };

  const updateMilestone = (goalId, milestoneId, completed) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(milestone => {
          if (milestone.id === milestoneId) {
            return { ...milestone, completed };
          }
          return milestone;
        });

        // Update current amount based on last completed milestone
        const lastCompletedMilestone = [...updatedMilestones]
          .reverse()
          .find(m => m.completed);

        return {
          ...goal,
          currentAmount: lastCompletedMilestone ? lastCompletedMilestone.amount : 0,
          milestones: updatedMilestones
        };
      }
      return goal;
    });
    
    updateFinancialData({ goals: updatedGoals });
  };

  return (
    <>
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold">Financial Goals</h1>

        {/* Add New Goal Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Add New Goal</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          const goalWithId = {
            ...newGoal,
            id: Date.now(),
            targetAmount: Number(newGoal.targetAmount),
            currentAmount: Number(newGoal.currentAmount)
          };
          updateFinancialData({
            goals: [...goals, goalWithId]
          });
          setNewGoal({
            name: '',
            targetAmount: '',
            targetDate: '',
            currentAmount: 0,
            milestones: []
          });
        }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Goal Name</label>
            <input
              type="text"
              value={newGoal.name}
              onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Amount</label>
            <input
              type="number"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Date</label>
            <input
              type="date"
              value={newGoal.targetDate}
              onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Amount</label>
            <input
              type="number"
              value={newGoal.currentAmount}
              onChange={(e) => setNewGoal(prev => ({ ...prev, currentAmount: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              min="0"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Add Goal
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h2 className="text-xl font-medium text-gray-600">No financial goals yet</h2>
          <p className="text-gray-500 mt-2">Add your first financial goal using the form above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {goals.map(goal => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const recommendation = recommendations.find(r => r.goalId === goal.id);
            return (
              <div key={goal.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">{goal.name}</h2>
                      <p className="text-sm text-gray-500">{getTimeRemaining(goal.targetDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary-600">
                        ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">{progress.toFixed(1)}% Complete</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${progress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                      ></div>
                    </div>
                  </div>

                  {/* Smart Recommendations */}
                  {recommendation && (
                    <div className={`mt-4 p-4 rounded-lg ${recommendation.isAchievable ? 'bg-green-50' : 'bg-red-50'}`}>
                      <h4 className={`font-medium mb-2 ${recommendation.isAchievable ? 'text-green-600' : 'text-red-600'}`}>
                        {recommendation.isAchievable ? (
                          'You are on track to achieve this goal!'
                        ) : (
                          `Additional ₹${Math.round(recommendation.gap).toLocaleString()} monthly savings needed`
                        )}
                      </h4>
                      
                      {recommendation.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="mt-3 border rounded-lg p-4 bg-white">
                          <h5 className="font-medium text-primary-600 mb-2">{suggestion.title}</h5>
                          {suggestion.type === 'investment' ? (
                            <div className="space-y-2">
                              <h6 className="text-sm font-medium">Recommended Investment Allocation:</h6>
                              {suggestion.options.allocation.map((asset, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                  <span>{asset.type}</span>
                                  <span>{asset.percentage}%</span>
                                </div>
                              ))}
                              <p className="text-sm text-gray-600 mt-2">Expected Return: {suggestion.options.expectedReturn}</p>
                            </div>
                          ) : suggestion.type === 'income' ? (
                            <div className="space-y-2">
                              {suggestion.options.map((option, i) => (
                                <div key={i} className="text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                  <p className="font-medium">{option.title || option.name}</p>
                                  <p className="text-gray-600">{option.description}</p>
                                  {option.income && <p className="text-primary-600">Potential Income: {option.income}</p>}
                                  {option.platforms && (
                                    <p className="text-gray-500 text-xs mt-1">Platforms: {option.platforms.join(', ')}</p>
                                  )}
                                  {option.cost && (
                                    <p className="text-gray-500 text-xs">Cost: {option.cost}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : suggestion.type === 'skill_development' ? (
                            <div className="space-y-2">
                              {suggestion.options.map((option, i) => (
                                <div key={i} className="text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                  <p className="font-medium">{option.platform}</p>
                                  <p className="text-gray-600">Focus: {option.focus}</p>
                                  <p className="text-gray-500">Duration: {option.duration}</p>
                                  <p className="text-primary-600">Cost: {option.cost}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {suggestion.steps?.map((step, i) => (
                                <p key={i} className="text-sm text-gray-600">• {step}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Financial Plan */}
                  {goal.recommendedMonthlySaving && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3">Financial Plan</h3>
                      {(() => {
                        const plan = generateFinancialPlan({
                          monthlyIncome: financialData.monthlyIncome || 0,
                          monthlyExpenses: financialData.monthlyExpenses || 0,
                          targetAmount: goal.targetAmount,
                          targetDate: goal.targetDate,
                          riskTolerance: financialData.riskTolerance || 'moderate',
                          recommendedMonthlySaving: goal.recommendedMonthlySaving
                        });

                        const recommendation = recommendations.find(r => r.goalId === goal.id);
          return (
                          <div className="space-y-4">
                            {/* Income Growth Suggestions */}
                            {plan.incomeGrowth.length > 0 && (
                              <div>
                                <h4 className="font-medium text-primary-600">Income Growth Strategy</h4>
                                <ul className="mt-2 space-y-1 text-sm">
                                  {plan.incomeGrowth[0].steps.map((step, index) => (
                                    <li key={index} className="flex items-start">
                                      <span className="mr-2">•</span>
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Investment Plan */}
                            <div>
                              <h4 className="font-medium text-primary-600">Recommended Investment Mix</h4>
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                {plan.investment.monthlyInvestmentPlan.allocation.map((item, index) => (
                                  <div key={index} className="p-2 bg-white rounded border">
                                    <p className="font-medium">{item.type}</p>
                                    <p className="text-sm text-gray-500">{item.percentage}%</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Savings Strategies */}
                            {plan.savingsStrategies.length > 0 && (
                              <div>
                                <h4 className="font-medium text-primary-600">Optimization Strategies</h4>
                                {plan.savingsStrategies.map((strategy, index) => (
                                  <div key={index} className="mt-2">
                                    <p className="text-sm font-medium">{strategy.title}</p>
                                    <ul className="mt-1 space-y-1 text-sm">
                                      {strategy.suggestions.slice(0, 3).map((suggestion, idx) => (
                                        <li key={idx} className="flex items-start">
                                          <span className="mr-2">•</span>
                                          <span>{suggestion}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()} 
                    </div>
                  )}

                  {/* Milestones */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Milestones</h3>
                    <div className="space-y-4">
                      {goal.milestones.map(milestone => (
                        <div key={milestone.id} className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={milestone.completed}
                            onChange={(e) => updateMilestone(goal.id, milestone.id, e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{milestone.name}</p>
                            <p className="text-sm text-gray-500">₹{milestone.amount.toLocaleString()}</p>
                          </div>
                          <div
                            className={`text-sm font-medium ${milestone.completed ? 'text-green-600' : 'text-gray-500'}`}
                          >
                            {milestone.completed ? 'Completed' : 'Pending'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    </>
  );
};

export default Goals;