import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import LoadingScreen from '../components/LoadingScreen';
import '../styles/HomePage.css';

/**
 * Home page component with demonstration of loading screens
 * 
 * @returns {JSX.Element} Home page
 */
const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [loadingType, setLoadingType] = useState('spinner');
  const [theme, setTheme] = useState('primary');
  const [mascot, setMascot] = useState('coin');
  
  // Simulate initial loading
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  
  // Show a demo loading screen
  const showDemo = (type, themeColor, mascotType) => {
    setLoadingType(type);
    setTheme(themeColor);
    setMascot(mascotType);
    setLoading(true);
    
    // Hide the loading screen after 3 seconds
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };
  
  // Render appropriate loading component
  if (loading) {
    if (loadingType === 'full') {
      return <LoadingScreen 
        show={true} 
        message="Welcome to FinBuddy!" 
        theme={theme}
        mascotType={mascot}
      />;
    } else {
      return <LoadingSpinner 
        text="Loading FinBuddy..." 
        size="large" 
        fullScreen={false}
        theme={theme}
      />;
    }
  }
  
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to FinBuddy</h1>
          <h2>Your AI Financial Assistant</h2>
          <p>Learn budgeting, saving, and investing with a gamified, conversational approach</p>
          
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-outline">Login</Link>
          </div>
        </div>
        
        <div className="hero-image">
          {/* Financial illustration would go here */}
          <div className="hero-mascot coin"></div>
        </div>
      </section>
      
      <section className="features-section">
        <h2>Main Features</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Budget Planning</h3>
            <p>Create and manage your budget with easy-to-use tools</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Savings Goals</h3>
            <p>Set and track your savings goals with visual progress indicators</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Financial Education</h3>
            <p>Learn about investing and financial concepts in a fun way</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Assistant</h3>
            <p>Get personalized financial advice from our AI assistant</p>
          </div>
        </div>
      </section>
      
      <section className="demo-section">
        <h2>Loading Screen Demos</h2>
        <p>Click on the buttons below to see our different loading indicators:</p>
        
        <div className="demo-buttons">
          <button className="btn btn-primary" onClick={() => showDemo('spinner', 'primary', 'coin')}>
            Simple Spinner
          </button>
          
          <button className="btn btn-success" onClick={() => showDemo('full', 'success', 'piggy')}>
            Piggy Bank Mascot
          </button>
          
          <button className="btn btn-warning" onClick={() => showDemo('full', 'warning', 'chart')}>
            Chart Mascot
          </button>
          
          <button className="btn btn-danger" onClick={() => showDemo('full', 'danger', 'rocket')}>
            Rocket Mascot
          </button>
        </div>
      </section>
      
      <section className="testimonial-section">
        <h2>What Users Say</h2>
        
        <div className="testimonials">
          <div className="testimonial-card">
            <div className="testimonial-text">
              "FinBuddy helped me save for my first car! The gamification made budgeting actually fun."
            </div>
            <div className="testimonial-author">- Priya S., College Student</div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-text">
              "The AI assistant answered all my investing questions in simple terms I could understand."
            </div>
            <div className="testimonial-author">- Rahul M., Young Professional</div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-text">
              "I finally understand how to budget properly! The visual breakdowns made it so clear."
            </div>
            <div className="testimonial-author">- Ananya K., Grad Student</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;