import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BudgetTracker = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: ''
  });
  const [editingBudget, setEditingBudget] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [budgetsRes, expensesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/budgets'),
        axios.get('http://localhost:5000/api/expenses')
      ]);
      setBudgets(budgetsRes.data);
      setExpenses(expensesRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Food', 'Transportation', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Education', 'Other'
  ];

  const getSpentAmount = (category) => {
    return expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/budgets', formData);
      setSuccess(`Budget for ${formData.category} category added successfully!`);
      setFormData({ category: '', amount: '' });
      setShowForm(false);
      fetchData();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add budget');
    }
  };

  const deleteBudget = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await axios.delete(`http://localhost:5000/api/budgets/${id}`);
        setBudgets(budgets.filter(budget => budget._id !== id));
      } catch (err) {
        setError('Failed to delete budget');
      }
    }
  };

  const editBudget = (budget) => {
    setEditingBudget(budget);
    setFormData({ category: budget.category, amount: budget.amount });
    setShowForm(true);
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.put(`http://localhost:5000/api/budgets/${editingBudget._id}`, formData);
      setSuccess(`Budget for ${formData.category} category updated successfully!`);
      setFormData({ category: '', amount: '' });
      setShowForm(false);
      setEditingBudget(null);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update budget');
    }
  };

  const cancelEdit = () => {
    setEditingBudget(null);
    setFormData({ category: '', amount: '' });
    setShowForm(false);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-accent';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-accent">Budget Tracker</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : 'Add Budget'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">Add New Budget</h3>
          <form onSubmit={editingBudget ? handleEditSubmit : onSubmit} className="space-y-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-textPrimary mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
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
              <label htmlFor="amount" className="block text-sm font-medium text-textPrimary mb-2">
                Budget Amount ($)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={onChange}
                className="input-field w-full"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            <div className="flex space-x-4">
              <button type="submit" className="btn-primary flex-1">
                {editingBudget ? 'Update Budget' : 'Add Budget'}
              </button>
              {editingBudget && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {budgets.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-textSecondary mb-4">No budgets set</p>
          <p className="text-sm text-textSecondary">Create budgets to track your spending limits</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {budgets.map((budget) => {
            const spent = getSpentAmount(budget.category);
            const percentage = (spent / budget.amount) * 100;
            const remaining = budget.amount - spent;

            return (
              <div key={budget._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-textPrimary mb-1">
                      {budget.category}
                    </h3>
                    <p className="text-textSecondary text-sm">
                      ${spent.toFixed(2)} of ${budget.amount.toFixed(2)} spent
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editBudget(budget)}
                      className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-500/10 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteBudget(budget._id)}
                      className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-textSecondary">Balance</span>
                    <span className={`font-medium ${percentage >= 100 ? 'text-red-400' : percentage >= 80 ? 'text-yellow-400' : 'text-accent'}`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-primary rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-textSecondary">
                      {remaining >= 0 ? `$${remaining.toFixed(2)} remaining` : `$${Math.abs(remaining).toFixed(2)} over budget`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetTracker;
