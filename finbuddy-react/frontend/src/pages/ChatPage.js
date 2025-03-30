import React, { useState, useEffect, useContext, useRef } from 'react';
import { ChatContext } from '../context/ChatContext';
import { LoadingSpinner } from '../components';

/**
 * AI Chat assistant page component
 * 
 * @returns {JSX.Element} Chat page
 */
const ChatPage = () => {
  const { messages, sendMessage, loading } = useContext(ChatContext);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>FinBuddy Chat</h1>
        <p>Ask your AI financial assistant anything about personal finance</p>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-welcome">
              <h3>Welcome to FinBuddy Chat!</h3>
              <p>Ask me anything about personal finance, budgeting, saving, or investing.</p>
              <p>Here are some questions you could ask:</p>
              <ul>
                <li>How do I create a budget?</li>
                <li>What's the difference between stocks and mutual funds?</li>
                <li>How much should I save for emergencies?</li>
                <li>What's the 50/30/20 rule?</li>
              </ul>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className={`chat-message ${msg.isUser ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            disabled={loading}
            className="chat-input"
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()} 
            className="chat-send-button"
          >
            {loading ? <LoadingSpinner size="small" /> : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;