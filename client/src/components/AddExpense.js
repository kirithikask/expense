import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api';

const AddExpense = () => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { amount, category, description, date } = formData;

  const categories = [
    'Food', 'Transportation', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Education', 'Other'
  ];

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/api/expenses', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-accent mb-2">Add Expense</h1>
            <p className="text-textSecondary">Track your spending</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-textPrimary mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={amount}
                onChange={onChange}
                className="input-field w-full"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-textPrimary mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={onChange}
                className="input-field w-full"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-textPrimary mb-2">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={description}
                onChange={onChange}
                className="input-field w-full"
                placeholder="What did you spend on?"
                required
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-textPrimary mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={date}
                onChange={onChange}
                className="input-field w-full"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Expense'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
