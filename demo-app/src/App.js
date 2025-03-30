import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import './styles/App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [mascotType, setMascotType] = useState('coin');
  const [theme, setTheme] = useState('primary');
  const [showMascotControls, setShowMascotControls] = useState(false);

  // Simulate loading for demo purposes
  useEffect(() => {
    // Automatically hide loading screen after 3 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Toggle mascot preview
  const toggleMascot = () => {
    setLoading(true);
    
    // Hide loading after 2 seconds
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    toggleMascot();
  };

  // Handle mascot type change
  const handleMascotChange = (newMascot) => {
    setMascotType(newMascot);
    toggleMascot();
  };

  return (
    <div className="app">
      <LoadingScreen 
        show={loading} 
        mascotType={mascotType}
        theme={theme}
      />
      
      <header className="app-header">
        <h1>FinBuddy</h1>
        <p className="tagline">Your AI Financial Assistant</p>
      </header>

      <main className="app-content">
        <section className="demo-section">
          <h2>Welcome to FinBuddy</h2>
          <p>
            FinBuddy helps you master your finances through engaging, AI-powered education and tools.
            From budgeting to investments, we're here to guide your financial journey.
          </p>
          
          <div className="card">
            <h3>Loading Screen Demo</h3>
            <p>Try out our animated financial mascots!</p>
            
            <div className="controls">
              <button 
                className="primary-button"
                onClick={() => setShowMascotControls(!showMascotControls)}
              >
                {showMascotControls ? 'Hide Controls' : 'Customize Mascot'}
              </button>
              
              <button 
                className="secondary-button"
                onClick={toggleMascot}
              >
                Show Loading Screen
              </button>
            </div>
            
            {showMascotControls && (
              <div className="customization-panel">
                <div className="option-group">
                  <h4>Mascot Type</h4>
                  <div className="option-buttons">
                    <button 
                      className={`option-button ${mascotType === 'coin' ? 'active' : ''}`}
                      onClick={() => handleMascotChange('coin')}
                    >
                      Coin
                    </button>
                    <button 
                      className={`option-button ${mascotType === 'piggy' ? 'active' : ''}`}
                      onClick={() => handleMascotChange('piggy')}
                    >
                      Piggy Bank
                    </button>
                    <button 
                      className={`option-button ${mascotType === 'chart' ? 'active' : ''}`}
                      onClick={() => handleMascotChange('chart')}
                    >
                      Chart
                    </button>
                    <button 
                      className={`option-button ${mascotType === 'rocket' ? 'active' : ''}`}
                      onClick={() => handleMascotChange('rocket')}
                    >
                      Rocket
                    </button>
                  </div>
                </div>
                
                <div className="option-group">
                  <h4>Theme Color</h4>
                  <div className="option-buttons">
                    <button 
                      className={`option-button color-primary ${theme === 'primary' ? 'active' : ''}`}
                      onClick={() => handleThemeChange('primary')}
                    >
                      Primary
                    </button>
                    <button 
                      className={`option-button color-success ${theme === 'success' ? 'active' : ''}`}
                      onClick={() => handleThemeChange('success')}
                    >
                      Success
                    </button>
                    <button 
                      className={`option-button color-warning ${theme === 'warning' ? 'active' : ''}`}
                      onClick={() => handleThemeChange('warning')}
                    >
                      Warning
                    </button>
                    <button 
                      className={`option-button color-danger ${theme === 'danger' ? 'active' : ''}`}
                      onClick={() => handleThemeChange('danger')}
                    >
                      Danger
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        
        <section className="features-section">
          <h2>Key Features</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Smart Budgeting</h3>
              <p>Create personalized budgets with AI assistance that adapts to your spending patterns.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Goal Tracking</h3>
              <p>Set financial goals and track your progress with interactive visualizations.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Financial Education</h3>
              <p>Learn financial concepts through personalized, bite-sized content.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Gamified Experience</h3>
              <p>Earn badges and rewards as you improve your financial health.</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="app-footer">
        <p>FinBuddy - Your AI-powered financial education platform</p>
        <p className="copyright">© 2023 FinBuddy</p>
      </footer>
    </div>
  );
}

export default App;