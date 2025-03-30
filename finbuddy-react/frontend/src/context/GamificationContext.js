import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

// Create the Gamification context
export const GamificationContext = createContext();

export const GamificationProvider = ({ children }) => {
  const { isAuthenticated, token } = useContext(AuthContext);
  
  // State for gamification data
  const [achievements, setAchievements] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [userProgress, setUserProgress] = useState({
    level: 1,
    points: 0,
    nextLevelPoints: 100,
    percentToNextLevel: 0,
    streak: 0,
    lastActive: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);

  // API base URL - should be in an environment variable in production
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch gamification data when the component mounts and when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchGamificationData();
    }
  }, [isAuthenticated]);

  // Update streak when user activity changes
  useEffect(() => {
    if (isAuthenticated && userProgress.lastActive) {
      updateUserStreak();
    }
  }, [isAuthenticated, userProgress.lastActive]);

  // Fetch all gamification data from the API
  const fetchGamificationData = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      // Configure headers with the authentication token
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // Fetch achievements, badges, and user progress in parallel
      const [achievementsResponse, badgesResponse, progressResponse] = await Promise.all([
        axios.get(`${API_URL}/gamification/achievements`, config),
        axios.get(`${API_URL}/gamification/badges`, config),
        axios.get(`${API_URL}/gamification/progress`, config)
      ]);

      // Update state with the fetched data
      setAchievements(achievementsResponse.data);
      setUserBadges(badgesResponse.data);
      setUserProgress(progressResponse.data);
    } catch (err) {
      console.error('Error fetching gamification data:', err);
      setError('Failed to load your achievements and progress. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Log user activity and update progress
  const logActivity = async (activity, pointsEarned = 0, progressMade = 0) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.post(
        `${API_URL}/gamification/activity`, 
        { 
          activity,
          pointsEarned,
          progressMade 
        }, 
        config
      );

      // Update user progress with the new data
      setUserProgress(response.data.progress);
      
      // If the activity earned a new badge, update user badges
      if (response.data.newBadge) {
        setUserBadges([...userBadges, response.data.newBadge]);
        
        // Set recent activity to show notification
        setRecentActivity({
          type: 'badge',
          data: response.data.newBadge,
          message: `Congratulations! You earned the "${response.data.newBadge.name}" badge!`
        });
      } else if (pointsEarned > 0) {
        // Set recent activity to show notification for points
        setRecentActivity({
          type: 'points',
          data: { points: pointsEarned },
          message: `You earned ${pointsEarned} points!`
        });
      }

      return response.data;
    } catch (err) {
      console.error('Error logging activity:', err);
      setError('Failed to log your activity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear the recent activity notification
  const clearRecentActivity = () => {
    setRecentActivity(null);
  };

  // Update user streak based on last activity date
  const updateUserStreak = () => {
    const lastActive = new Date(userProgress.lastActive);
    const today = new Date();
    
    // If lastActive was today, no need to update streak
    if (lastActive.toDateString() === today.toDateString()) {
      return;
    }
    
    // If lastActive was yesterday, increment streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastActive.toDateString() === yesterday.toDateString()) {
      // Update locally for now, server will be updated on next activity
      setUserProgress({
        ...userProgress,
        streak: userProgress.streak + 1,
        lastActive: today.toISOString()
      });
    } else {
      // Reset streak if more than a day has passed
      setUserProgress({
        ...userProgress,
        streak: 1,
        lastActive: today.toISOString()
      });
    }
  };

  // Calculate percentage to next level
  const calculateLevelProgress = () => {
    const { points, nextLevelPoints } = userProgress;
    const currentLevelPoints = nextLevelPoints - (nextLevelPoints / 1.5); // Estimate previous level threshold
    const pointsInCurrentLevel = points - currentLevelPoints;
    const pointsNeededForNextLevel = nextLevelPoints - currentLevelPoints;
    
    return Math.min(100, Math.round((pointsInCurrentLevel / pointsNeededForNextLevel) * 100));
  };

  // Find achievement progress by ID
  const getAchievementProgress = (achievementId) => {
    const achievement = achievements.find(ach => ach.id === achievementId);
    
    if (!achievement) return { completed: false, progress: 0, percentage: 0 };
    
    // For completed achievements
    if (achievement.completed) {
      return { 
        completed: true, 
        progress: achievement.target, 
        percentage: 100 
      };
    }
    
    // For in-progress achievements
    const percentage = Math.min(100, Math.round((achievement.progress / achievement.target) * 100));
    
    return {
      completed: false,
      progress: achievement.progress,
      percentage
    };
  };

  // Value object to be provided to consumers of the context
  const value = {
    achievements,
    userBadges,
    userProgress,
    recentActivity,
    isLoading,
    error,
    fetchGamificationData,
    logActivity,
    clearRecentActivity,
    calculateLevelProgress,
    getAchievementProgress
  };

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
};