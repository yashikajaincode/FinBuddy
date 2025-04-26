import { useState } from 'react';

import { generateFinancialPlan } from '../../utils/financialPlanner';

const FinancialDataForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    totalBalance: initialData?.totalBalance || 0,
    monthlyIncome: initialData?.monthlyIncome || 0,
    monthlyExpenses: initialData?.monthlyExpenses || 0,
    goalName: initialData?.goalName || '',
    targetAmount: initialData?.targetAmount || 0,
    targetDate: initialData?.targetDate || new Date().toISOString().split('T')[0],
    riskTolerance: initialData?.riskTolerance || 'moderate',
    investmentHorizon: initialData?.investmentHorizon || 1
  });

  const calculateSavingsPlan = () => {
    const monthlyIncome = Number(formData.monthlyIncome);
    const monthlyExpenses = Number(formData.monthlyExpenses);
    const availableSavings = monthlyIncome - monthlyExpenses;
    const targetAmount = Number(formData.targetAmount);
    
    const targetDate = new Date(formData.targetDate);
    const today = new Date();
    const monthsToGoal = (targetDate.getFullYear() - today.getFullYear()) * 12 + (targetDate.getMonth() - today.getMonth());
    
    const recommendedMonthlySaving = targetAmount / monthsToGoal;
    
    const financialPlan = generateFinancialPlan({
      monthlyIncome,
      monthlyExpenses,
      targetAmount,
      targetDate,
      riskTolerance: formData.riskTolerance,
      recommendedMonthlySaving
    });
    
    if (recommendedMonthlySaving > availableSavings) {
      return {
        isAchievable: false,
        recommendedMonthlySaving: recommendedMonthlySaving,
        message: "Goal may be difficult to achieve with current income. Consider extending the timeline or reducing target amount.",
        plan: financialPlan
      };
    }
    
    return {
      isAchievable: true,
      recommendedMonthlySaving: recommendedMonthlySaving,
      message: `Save ₹${recommendedMonthlySaving.toLocaleString()} monthly to reach your goal`,
      plan: financialPlan
    };
  };

  const [investmentPlan, setInvestmentPlan] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers and decimal point
    if (name === 'totalBalance' || name === 'monthlyIncome' || name === 'monthlyExpenses' || name === 'targetAmount') {
      const numericValue = value.replace(/[^0-9.]/g, '');
      if (numericValue === '' || /^\d*\.?\d*$/.test(numericValue)) {
        setFormData(prev => ({
          ...prev,
          [name]: numericValue
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Parse all numeric values using parseFloat to handle large numbers accurately
      const monthlyExpenses = parseFloat(formData.monthlyExpenses);
      const monthlyIncome = parseFloat(formData.monthlyIncome);
      const totalBalance = parseFloat(formData.totalBalance);
      const targetAmount = parseFloat(formData.targetAmount);

      if (monthlyExpenses > monthlyIncome) {
        throw new Error('Monthly expenses cannot exceed monthly income');
      }
      if (totalBalance < 0 || monthlyIncome < 0 || monthlyExpenses < 0) {
        throw new Error('Financial values cannot be negative');
      }
      const plan = calculateSavingsPlan();
      setInvestmentPlan(plan);
      await onSubmit({
        ...formData,
        totalBalance: totalBalance,
        monthlyIncome: monthlyIncome,
        monthlyExpenses: monthlyExpenses,
        goals: [{
          id: Date.now().toString(),
          name: formData.goalName,
          targetAmount: targetAmount,
          currentAmount: 0,
          targetDate: new Date(formData.targetDate),
          recommendedMonthlySaving: plan.recommendedMonthlySaving,
          milestones: [
            {
              id: '1',
              name: '25% Progress',
              amount: targetAmount * 0.25,
              completed: false
            },
            {
              id: '2',
              name: '50% Progress',
              amount: targetAmount * 0.5,
              completed: false
            },
            {
              id: '3',
              name: '75% Progress',
              amount: targetAmount * 0.75,
              completed: false
            },
            {
              id: '4',
              name: '100% Progress',
              amount: targetAmount,
              completed: false
            }
          ]
        }]
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      alert(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="totalBalance" className="block text-sm font-medium text-gray-700">
          Total Balance
        </label>
        <input
          type="text"
          id="totalBalance"
          name="totalBalance"
          value={formData.totalBalance}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700">
          Monthly Income
        </label>
        <input
          type="text"
          id="monthlyIncome"
          name="monthlyIncome"
          value={formData.monthlyIncome}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label htmlFor="monthlyExpenses" className="block text-sm font-medium text-gray-700">
          Monthly Expenses
        </label>
        <input
          type="text"
          id="monthlyExpenses"
          name="monthlyExpenses"
          value={formData.monthlyExpenses}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label htmlFor="goalName" className="block text-sm font-medium text-gray-700">
          Goal Name (e.g., "Buy a Car")
        </label>
        <input
          type="text"
          id="goalName"
          name="goalName"
          value={formData.goalName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">
          Target Amount (₹)
        </label>
        <input
          type="text"
          id="targetAmount"
          name="targetAmount"
          value={formData.targetAmount}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">
          Target Date
        </label>
        <input
          type="date"
          id="targetDate"
          name="targetDate"
          value={formData.targetDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div>
        <label htmlFor="riskTolerance" className="block text-sm font-medium text-gray-700">
          Risk Tolerance
        </label>
        <select
          id="riskTolerance"
          name="riskTolerance"
          value={formData.riskTolerance}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        >
          <option value="conservative">Conservative</option>
          <option value="moderate">Moderate</option>
          <option value="aggressive">Aggressive</option>
        </select>
      </div>

      <div>
        <label htmlFor="investmentHorizon" className="block text-sm font-medium text-gray-700">
          Investment Horizon (years)
        </label>
        <input
          type="number"
          id="investmentHorizon"
          name="investmentHorizon"
          value={formData.investmentHorizon}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
          min="1"
          max="30"
        />
      </div>

      {investmentPlan && (
        <div className={`p-4 rounded-md ${investmentPlan.isAchievable ? 'bg-green-50' : 'bg-yellow-50'}`}>
          <h4 className="text-lg font-semibold mb-2">Savings Plan for {formData.goalName}</h4>
          <p className="mb-2">{investmentPlan.message}</p>
          
          {investmentPlan.plan && (
            <div className="mt-4 space-y-4">
              {investmentPlan.plan.incomeGrowth.length > 0 && (
                <div className="border-t pt-4">
                  <h5 className="font-semibold mb-2">Income Growth Strategy</h5>
                  {investmentPlan.plan.incomeGrowth.map((strategy, index) => (
                    <div key={index} className="mb-3">
                      <p className="font-medium">{strategy.description}</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        {strategy.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-sm">{step}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="border-t pt-4">
                <h5 className="font-semibold mb-2">Investment Allocation</h5>
                <div className="grid grid-cols-2 gap-4">
                  {investmentPlan.plan.investment.monthlyInvestmentPlan.allocation.map((item, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{item.type}</span>
                        <span className="text-primary-600">{item.percentage}%</span>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Expected Annual Return: {investmentPlan.plan.investment.monthlyInvestmentPlan.expectedReturn}
                </p>
              </div>
              
              {investmentPlan.plan.savingsStrategies.length > 0 && (
                <div className="border-t pt-4">
                  <h5 className="font-semibold mb-2">Additional Strategies</h5>
                  {investmentPlan.plan.savingsStrategies.map((strategy, index) => (
                    <div key={index} className="mb-3">
                      <p className="font-medium">{strategy.title}</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        {strategy.suggestions.map((suggestion, suggIndex) => (
                          <li key={suggIndex} className="text-sm">{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {!investmentPlan.isAchievable && (
            <p className="text-yellow-700 mt-4">Consider adjusting your goal or timeline to make it more achievable.</p>
          )}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Calculate & Save Changes
      </button>
    </form>
  );
};

export default FinancialDataForm;