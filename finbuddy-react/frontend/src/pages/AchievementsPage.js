import React, { useContext, useState, useEffect } from 'react';
import { GamificationContext } from '../context/GamificationContext';
import { LoadingSpinner } from '../components';

/**
 * Achievements page component for gamification features
 * 
 * @returns {JSX.Element} Achievements page
 */
const AchievementsPage = () => {
  const { achievements, userProgress, badges, fetchAchievements } = useContext(GamificationContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchAchievements();
      } catch (error) {
        console.error('Error loading achievements data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchAchievements]);

  if (loading) {
    return (
      <div className="page-container loading-container">
        <LoadingSpinner size="large" text="Loading achievements..." theme="success" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Achievements</h1>
        <p>Track your progress and earn badges as you learn financial skills</p>
      </div>

      <div className="content-card">
        <h2>Your Progress</h2>
        <p>This is a placeholder for the achievements page. It will display badges, achievements, and progress tracking.</p>
      </div>
    </div>
  );
};

export default AchievementsPage;