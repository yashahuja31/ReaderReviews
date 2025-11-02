import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Book, Sparkles, Loader } from 'lucide-react';
import './BookRecommendation.css';

const BookRecommendation = () => {
  const { user } = useAuth();
  const [readBooks, setReadBooks] = useState([]);
  const [wantToReadBooks, setWantToReadBooks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  // Fetch user's read books and want-to-read books
  useEffect(() => {
    if (user) {
      fetchUserBooks();
    }
  }, [user]);

  const fetchUserBooks = async () => {
    try {
      // Fetch read books
      const readResponse = await axios.get('/api/users/read-books', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReadBooks(readResponse.data);

      // Fetch want-to-read books
      const wantToReadResponse = await axios.get('/api/users/want-to-read-books', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setWantToReadBooks(wantToReadResponse.data);
    } catch (err) {
      console.error('Error fetching user books:', err);
      setError('Failed to fetch your books. Please try again later.');
    }
  };

  const generateRecommendations = async () => {
    if (!apiKey) {
      setShowApiKeyInput(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare data for the Gemini API
      const readBookTitles = readBooks.map(book => `${book.title} by ${book.author}`);
      const wantToReadTitles = wantToReadBooks.map(book => `${book.title} by ${book.author}`);

      // Create prompt for Gemini API
      const prompt = `
        Based on the following books that I've read:
        ${readBookTitles.join(', ')}
        
        And these books that I want to read:
        ${wantToReadTitles.join(', ')}
        
        Please recommend 5 books that I might enjoy. For each book, provide:
        1. Title
        2. Author
        3. Genre
        4. A brief description (2-3 sentences)
        5. Why you think I would enjoy it based on my reading history
        
        Format the response as a JSON array with objects containing title, author, genre, description, and reason fields.
      `;

      // Call your backend endpoint that will interact with Gemini API
      const response = await axios.post('/api/recommendations', {
        prompt,
        apiKey
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Parse and set recommendations
      setRecommendations(response.data);
      
      // Save API key to localStorage for future use
      localStorage.setItem('geminiApiKey', apiKey);
      
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError('Failed to generate recommendations. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  return (
    <div className="book-recommendation-container">
      <div className="recommendation-header">
        <h2><Sparkles className="recommendation-icon" /> Book Recommendations</h2>
        <p>Get personalized book recommendations based on your reading history and interests</p>
      </div>

      {showApiKeyInput && (
        <div className="api-key-section">
          <h3>Enter your Gemini API Key</h3>
          <p>We need your Gemini API key to generate personalized recommendations. Your key is stored locally and never sent to our servers.</p>
          <div className="api-key-input">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
            />
            <button 
              onClick={() => {
                if (apiKey) {
                  setShowApiKeyInput(false);
                  generateRecommendations();
                }
              }}
              disabled={!apiKey}
            >
              Save & Generate
            </button>
          </div>
          <p className="api-key-help">
            <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer">
              Get a Gemini API key here
            </a>
          </p>
        </div>
      )}

      {!showApiKeyInput && (
        <button 
          className="generate-button"
          onClick={generateRecommendations}
          disabled={loading}
        >
          {loading ? <Loader className="spinner" /> : <Sparkles />} 
          {loading ? 'Generating Recommendations...' : 'Generate Recommendations'}
        </button>
      )}

      {error && <div className="error-message">{error}</div>}

      {recommendations.length > 0 && (
        <div className="recommendations-list">
          <h3>Your Personalized Recommendations</h3>
          {recommendations.map((book, index) => (
            <div className="recommendation-card" key={index}>
              <div className="recommendation-header">
                <h4>{book.title}</h4>
                <span className="recommendation-author">by {book.author}</span>
                <span className="recommendation-genre">{book.genre}</span>
              </div>
              <p className="recommendation-description">{book.description}</p>
              <div className="recommendation-reason">
                <strong>Why we think you'll like it:</strong> {book.reason}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && recommendations.length === 0 && !showApiKeyInput && (
        <div className="empty-recommendations">
          <Book size={48} />
          <p>No recommendations generated yet. Click the button above to get started!</p>
        </div>
      )}
    </div>
  );
};

export default BookRecommendation;