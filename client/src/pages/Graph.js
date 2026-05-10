import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import api from '../api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Graph = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    // Fetch expenses data for charts
    const fetchExpenses = async () => {
      try {
        const res = await api.get('/api/expenses');
        setExpenses(res.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, []);

  // Simple chart representation (placeholder for actual chart library)
  const categoryData = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 flex-1 bg-gray-50 min-h-screen">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Spending Analytics</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Spending by Category */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Spending by Category</h2>
              {Object.keys(categoryData).length > 0 ? (
                <Pie
                  data={{
                    labels: Object.keys(categoryData),
                    datasets: [{
                      data: Object.values(categoryData),
                      backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                      ]
                    }]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                      title: {
                        display: true,
                        text: 'Spending by Category'
                      }
                    }
                  }}
                />
              ) : (
                <div className="text-center text-gray-500">No data available</div>
              )}
            </div>

            {/* Monthly Trend */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Trend</h2>
              {expenses.length > 0 ? (
                <Line
                  data={{
                    labels: expenses.map(exp => new Date(exp.date).toLocaleDateString()),
                    datasets: [{
                      label: 'Expenses',
                      data: expenses.map(exp => exp.amount),
                      borderColor: '#36A2EB',
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      fill: true
                    }]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Monthly Expense Trend'
                      }
                    }
                  }}
                />
              ) : (
                <div className="text-center text-gray-500">No data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graph;
