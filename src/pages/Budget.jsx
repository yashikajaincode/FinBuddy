import { useState, useEffect } from 'react';
import { useFinancial } from '../context/FinancialContext';

const Budget = () => {
  const { financialData, updateFinancialData } = useFinancial();
  const { monthlyIncome, monthlyExpenses, budget } = financialData;

  const [categories, setCategories] = useState(budget.categories || []);
  const [newCategory, setNewCategory] = useState({
    name: '',
    allocated: '',
    color: '#3B82F6'
  });

  const totalAllocated = categories.reduce((sum, category) => sum + (Number(category.allocated) || 0), 0);
  const totalSpent = categories.reduce((sum, category) => sum + (Number(category.spent) || 0), 0);
  const remainingBudget = monthlyIncome - totalAllocated;

  const handleAllocationChange = (categoryId, value) => {
    const newValue = Number(value);
    const updatedCategories = categories.map(category =>
      category.id === categoryId
        ? { ...category, allocated: newValue }
        : category
    );
    setCategories(updatedCategories);
    updateFinancialData({ budget: { ...budget, categories: updatedCategories } });
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Budget Planning</h1>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white rounded-lg p-6">
          <h3 className="text-lg font-semibold">Monthly Income</h3>
          <p className="text-2xl font-bold mt-2">₹{monthlyIncome.toLocaleString()}</p>
        </div>
        <div className="bg-green-500 text-white rounded-lg p-6">
          <h3 className="text-lg font-semibold">Total Allocated</h3>
          <p className="text-2xl font-bold mt-2">₹{totalAllocated.toLocaleString()}</p>
        </div>
        <div className={`${remainingBudget >= 0 ? 'bg-purple-500' : 'bg-red-500'} text-white rounded-lg p-6`}>
          <h3 className="text-lg font-semibold">Remaining Budget</h3>
          <p className="text-2xl font-bold mt-2">₹{remainingBudget.toLocaleString()}</p>
        </div>
      </div>

      {/* Category-wise Budget Allocation */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Category Allocation</h2>
          <div className="space-y-6">
            {categories.map(category => {
              const spentPercentage = (category.spent / category.allocated) * 100;
              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-gray-500">
                        Spent: ₹{category.spent.toLocaleString()} of ₹{category.allocated.toLocaleString()}
                      </p>
                    </div>
                    <input
                      type="number"
                      value={category.allocated}
                      onChange={(e) => handleAllocationChange(category.id, e.target.value)}
                      className="w-32 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${spentPercentage > 100 ? 'bg-red-500' : 'bg-primary-500'}`}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add New Category */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          const newCategoryWithId = {
            ...newCategory,
            id: Date.now(),
            spent: 0,
            allocated: Number(newCategory.allocated)
          };
          const updatedCategories = [...categories, newCategoryWithId];
          setCategories(updatedCategories);
          updateFinancialData({ budget: { ...budget, categories: updatedCategories } });
          setNewCategory({ name: '', allocated: '', color: '#3B82F6' });
        }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Allocated Amount</label>
            <input
              type="number"
              value={newCategory.allocated}
              onChange={(e) => setNewCategory(prev => ({ ...prev, allocated: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
              min="0"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>

      {/* Budget Tips */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Budget Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-primary-600 mb-2">50/30/20 Rule</h3>
            <p className="text-sm text-gray-600">
              Allocate 50% for needs, 30% for wants, and 20% for savings and debt repayment.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-primary-600 mb-2">Emergency Fund</h3>
            <p className="text-sm text-gray-600">
              Aim to save 3-6 months of expenses in an easily accessible emergency fund.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;