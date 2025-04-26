import { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';

const InvestmentForm = ({ onClose }) => {
  const { financialData, updateFinancialData } = useFinancial();
  const [formData, setFormData] = useState({
    investmentType: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const investmentTypes = [
    'Fixed Deposits',
    'Government Bonds',
    'Blue-chip Stocks',
    'Gold',
    'Mutual Funds',
    'Index Funds',
    'Corporate Bonds',
    'Real Estate Funds',
    'Growth Stocks',
    'Mid-cap Funds',
    'International Stocks',
    'Cryptocurrency'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newInvestment = {
        type: formData.investmentType,
        amount: Number(formData.amount),
        date: formData.date,
        description: formData.description
      };

      const updatedInvestments = [...(financialData.investments || []), newInvestment];
      await updateFinancialData({ investments: updatedInvestments });
      onClose();
    } catch (error) {
      alert('Failed to add investment: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Investment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="investmentType" className="block text-sm font-medium text-gray-700">
              Investment Type
            </label>
            <select
              id="investmentType"
              name="investmentType"
              value={formData.investmentType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            >
              <option value="">Select investment type</option>
              {investmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
              min="0"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Investment Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Add any additional details about your investment"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Add Investment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentForm;