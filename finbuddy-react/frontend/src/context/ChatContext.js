import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { GamificationContext } from './GamificationContext';

// Create the Chat context
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { isAuthenticated, token } = useContext(AuthContext);
  const { logActivity } = useContext(GamificationContext);
  
  // State for chat data
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  // API base URL - should be in an environment variable in production
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch conversation list when the component mounts and when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  // Fetch all conversations from the API
  const fetchConversations = async () => {
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

      const response = await axios.get(`${API_URL}/chat/conversations`, config);
      setConversations(response.data);

      // If there are conversations and no active one, set the most recent as active
      if (response.data.length > 0 && !activeConversation) {
        setActiveConversation(response.data[0]);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load your chat history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (conversationId) => {
    if (!token || !conversationId) return;

    setIsLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.get(`${API_URL}/chat/conversations/${conversationId}/messages`, config);
      setMessages(response.data);

      // Fetch suggested questions based on conversation context
      fetchSuggestedQuestions(conversationId);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load chat messages. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new conversation
  const createConversation = async (title = 'New Conversation') => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.post(`${API_URL}/chat/conversations`, { title }, config);
      
      // Add the new conversation to the list and set it as active
      const newConversation = response.data;
      setConversations([newConversation, ...conversations]);
      setActiveConversation(newConversation);
      setMessages([]);

      return newConversation;
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError('Failed to create a new conversation. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message in the active conversation
  const sendMessage = async (content) => {
    if (!token || !activeConversation) return;

    setIsSending(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // If no active conversation, create one first
      let conversationId = activeConversation.id;
      if (!conversationId) {
        const newConversation = await createConversation();
        conversationId = newConversation.id;
      }

      // Optimistically add user message to the UI
      const tempUserMessage = {
        id: `temp-${Date.now()}`,
        conversationId,
        role: 'user',
        content,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, tempUserMessage]);

      // Send the message to the server
      const response = await axios.post(
        `${API_URL}/chat/conversations/${conversationId}/messages`, 
        { content }, 
        config
      );

      // Replace the temp message with the actual message from the server
      const { userMessage, aiMessage } = response.data;
      
      setMessages(prevMessages => 
        prevMessages
          .filter(msg => msg.id !== tempUserMessage.id) // Remove temp message
          .concat([userMessage, aiMessage]) // Add both user and AI messages
      );

      // Update suggested questions
      setSuggestedQuestions(response.data.suggestedQuestions || []);

      // Log activity for gamification (financial question asked)
      await logActivity('ask_financial_question', 5);

      return response.data;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      
      // Remove the temp message if there was an error
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== `temp-${Date.now()}`)
      );
      
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  // Fetch suggested follow-up questions
  const fetchSuggestedQuestions = async (conversationId) => {
    if (!token || !conversationId) return;

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.get(
        `${API_URL}/chat/conversations/${conversationId}/suggestions`, 
        config
      );
      
      setSuggestedQuestions(response.data);
    } catch (err) {
      console.error('Error fetching suggested questions:', err);
      // Silently fail - not showing suggestions is not critical
      setSuggestedQuestions([]);
    }
  };

  // Update conversation title
  const updateConversationTitle = async (conversationId, title) => {
    if (!token || !conversationId) return;

    setIsLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.put(
        `${API_URL}/chat/conversations/${conversationId}`, 
        { title }, 
        config
      );
      
      // Update conversations list
      setConversations(conversations.map(conv => 
        conv.id === conversationId ? { ...conv, title } : conv
      ));
      
      // Update active conversation if it's the one being edited
      if (activeConversation && activeConversation.id === conversationId) {
        setActiveConversation({ ...activeConversation, title });
      }

      return response.data;
    } catch (err) {
      console.error('Error updating conversation title:', err);
      setError('Failed to update conversation title. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a conversation
  const deleteConversation = async (conversationId) => {
    if (!token || !conversationId) return;

    setIsLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.delete(`${API_URL}/chat/conversations/${conversationId}`, config);
      
      // Remove conversation from list
      const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
      setConversations(updatedConversations);
      
      // If the active conversation was deleted, set a new active conversation
      if (activeConversation && activeConversation.id === conversationId) {
        if (updatedConversations.length > 0) {
          setActiveConversation(updatedConversations[0]);
        } else {
          setActiveConversation(null);
        }
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
      setError('Failed to delete conversation. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Switch to a different conversation
  const switchConversation = (conversationId) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setActiveConversation(conversation);
    }
  };

  // Clear the current error
  const clearError = () => {
    setError(null);
  };

  // Value object to be provided to consumers of the context
  const value = {
    conversations,
    activeConversation,
    messages,
    suggestedQuestions,
    isLoading,
    isSending,
    error,
    fetchConversations,
    createConversation,
    sendMessage,
    updateConversationTitle,
    deleteConversation,
    switchConversation,
    clearError
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};