import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const intervalRef = useRef(null);
  const pauseRef = useRef(false);

  useEffect(() => {
    // Ensure we start on section 1
    setCurrentSection(0);

    // Delay auto-scroll start to let user see section 1 first
    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        if (!pauseRef.current) {
          setCurrentSection(prev => (prev + 1) % 5);
        }
      }, 2000);
    };

    const timer = setTimeout(startAutoScroll, 3000); // Start auto-scroll after 3 seconds
    return () => {
      clearTimeout(timer);
      clearInterval(intervalRef.current);
    };
  }, []);

  const handleWheel = (e) => {
    e.preventDefault();
    pauseRef.current = true;
    if (e.deltaY > 0) {
      setCurrentSection(prev => (prev + 1) % 5);
    } else {
      setCurrentSection(prev => (prev - 1 + 5) % 5);
    }
    setTimeout(() => {
      pauseRef.current = false;
    }, 3000);
  };

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="relative overflow-hidden h-screen">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <img src="https://thumbs.dreamstime.com/b/cute-wallet-cartoon-money-coins-yellow-background-adorable-smiling-face-full-paper-currency-all-great-383920644.jpg" alt="Wallet Icon" className="w-12 h-12 rounded-full" />
              <div className="text-4xl font-bold text-black">Budget Bae</div>
            </div>
            <div className="flex gap-4">
              <Link to="/login" className="border border-black text-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition text-lg font-semibold">Sign In</Link>
              <Link to="/register" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition text-lg font-semibold">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sections Container */}
      <div className="h-[500vh] transition-transform duration-1000 ease-in-out" style={{ transform: `translateY(-${currentSection * 100}vh)` }}>
        {/* Section 1: Hero */}
        <section className="h-screen flex items-center bg-yellow-50 text-gray-800 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <img src="https://thumbs.dreamstime.com/b/cute-wallet-cartoon-money-coins-yellow-background-adorable-smiling-face-full-paper-currency-all-great-383920644.jpg" alt="Expense Tracker Illustration" className="w-full max-w-lg mx-auto lg:mx-0 rounded-lg shadow-lg" />
            </div>
            <div className="lg:w-1/2 lg:pl-8 text-center lg:text-left">
              <h1 className="text-5xl sm:text-6xl font-bold mb-6">Track Your Expenses Like a Pro</h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto lg:mx-0">
                Take control of your finances with our sleek, modern expense tracker. Monitor spending, set budgets, and achieve your financial goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link to="/register" className="bg-white text-black px-12 py-5 rounded-lg font-semibold hover:bg-gray-100 transition text-xl">Get Started</Link>
                <Link to="/login" className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">Sign In</Link>
              </div>
              {/* Illustrations */}
              <div className="flex justify-center lg:justify-start gap-8">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-4xl">💰</div>
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-4xl">📱</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: App Preview Hero */}
        <section className="h-screen flex items-center bg-gray-100 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 items-center gap-12">
            <div className="flex justify-center">
              <img src="https://cdn.dribbble.com/userupload/25853584/file/original-46496797d25b9c612e945be479524914.png?resize=752x&vertical=center" alt="App Dashboard Mockup" className="w-full max-w-2xl rounded-lg shadow-lg" />
            </div>
            <div className="text-center">
              <h2 className="text-6xl font-bold mb-8 text-gray-800">Visualize Your Finances</h2>
              <p className="text-3xl text-gray-600">See your spending patterns at a glance with our intuitive dashboard. Bright charts and real-time numbers keep you informed.</p>
            </div>
            <div className="flex justify-center">
              <img src="https://flevy.com/images/slideshows/8256/0.gif" alt="Expense Tracking Animation" className="w-full max-w-2xl rounded-lg shadow-lg" />
            </div>
          </div>
        </section>

        {/* Section 3: Feature Cards + CTA */}
        <section className="h-screen flex flex-col items-center justify-center bg-yellow-50 text-gray-800 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 max-w-6xl">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">📊</div>
              <h3 className="text-2xl font-semibold mb-4">Expense Tracking</h3>
              <p className="text-xl text-gray-600">Log and categorize every expense effortlessly</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">💰</div>
              <h3 className="text-2xl font-semibold mb-4">Budget Management</h3>
              <p className="text-xl text-gray-600">Set limits and stay on track with your goals</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">📈</div>
              <h3 className="text-2xl font-semibold mb-4">Detailed Reports</h3>
              <p className="text-xl text-gray-600">Gain insights with comprehensive analytics</p>
            </div>
          </div>
          <div className="text-center max-w-3xl">
            <h2 className="text-5xl font-bold mb-6">Ready to Take Control of Your Finances?</h2>
            <p className="text-2xl mb-10 text-gray-600">Join thousands already managing money smarter</p>
            <Link to="/register" className="bg-blue-500 text-white px-10 py-4 rounded-lg font-semibold hover:bg-blue-600 transition text-xl">Start Tracking Today</Link>
          </div>
        </section>

        {/* Section 4: App Overview */}
        <section className="h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-6xl">
            <h2 className="text-5xl font-bold mb-12 text-gray-800">About Budget Bae</h2>
            <p className="text-2xl mb-12 text-gray-600">The Budget Bae application enables users to track expenses, manage budgets, and review financial records in a centralized platform. The system is designed to be user-friendly, secure, and efficient for personal finance management.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-blue-50 p-8 rounded-lg">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl text-white">📊</div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Track Expenses</h3>
                <p className="text-xl text-gray-600">Monitor every expense with ease and categorize them for better insights.</p>
              </div>
              <div className="bg-blue-50 p-8 rounded-lg">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl text-white">💰</div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Manage Budgets</h3>
                <p className="text-xl text-gray-600">Set and control your budgets to stay on track with your financial goals.</p>
              </div>
              <div className="bg-blue-50 p-8 rounded-lg">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl text-white">🔒</div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Secure & Efficient</h3>
                <p className="text-xl text-gray-600">Review records securely in one place, designed for user-friendly and efficient management.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Footer / Final CTA */}
        <section className="h-screen flex flex-col items-center justify-center bg-gray-800 text-white px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-6xl font-bold mb-6">Budget Bae</h2>
            <p className="text-2xl mb-12 text-gray-300">Start your journey to financial freedom today</p>
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <a href="#" className="text-blue-400 hover:text-blue-300 transition text-xl">About</a>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition text-xl">Pricing</a>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition text-xl">Blog</a>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition text-xl">Contact</a>
            </div>
            <div className="flex justify-center gap-8 mb-12">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition text-3xl">📘</div>
              <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition text-3xl">🐦</div>
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-600 transition text-3xl">📷</div>
            </div>
            <Link to="/register" className="bg-blue-500 text-white px-12 py-5 rounded-lg font-semibold hover:bg-blue-600 transition text-2xl">Get Started Free</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
