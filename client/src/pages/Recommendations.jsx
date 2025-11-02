import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star,  Book, Heart } from 'react-feather';
import './Recommendations.css';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call to your backend
        // const response = await axios.get('/api/recommendations');
        
        // For now, we'll use sample data
        const sampleRecommendations = [
          {
            title: "The Midnight Library",
            author: "Matt Haig",
            genre: "Fiction",
            description: "A novel about the choices that go into a life well lived.",
            coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600"
          },
          {
            title: "Project Hail Mary",
            author: "Andy Weir",
            genre: "Science Fiction",
            description: "A lone astronaut must save the earth from disaster.",
            coverImage: "https://images.unsplash.com/photo-1614531341773-3bff8b7cb3fc?w=400&h=600"
          },
          {
            title: "The Silent Patient",
            author: "Alex Michaelides",
            genre: "Thriller",
            description: "A psychological thriller about a woman who shoots her husband.",
            coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600"
          },
          {
            title: "Educated",
            author: "Tara Westover",
            genre: "Memoir",
            description: "A memoir about a woman who leaves her survivalist family.",
            coverImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600"
          },
          {
            title: "Where the Crawdads Sing",
            author: "Delia Owens",
            genre: "Fiction",
            description: "A murder mystery about a girl who grew up in the marsh.",
            coverImage: "https://images.unsplash.com/photo-1512045482940-f37f5216f639?w=400&h=600"
          }
        ];
        
        setRecommendations(sampleRecommendations);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch recommendations');
        setLoading(false);
        console.error(err);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return <div className="loading-container"><div className="loader"></div></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <Sparkles className="recommendations-icon" />
        <h1>Personalized Book Recommendations</h1>
      </div>
      
      <div className="recommendations-description">
        <p>Based on your reading history and preferences, we think you'll love these books:</p>
      </div>
      
      <div className="recommendations-grid">
        {recommendations.map((book, index) => (
          <div className="recommendation-card" key={index}>
            <div className="recommendation-image">
              <img src={book.coverImage} alt={book.title} />
            </div>
            <div className="recommendation-content">
              <h3>{book.title}</h3>
              <p className="recommendation-author">by {book.author}</p>
              <p className="recommendation-genre">
                <Book size={14} /> {book.genre}
              </p>
              <p className="recommendation-description">{book.description}</p>
              <button className="add-to-wishlist">
                <Heart size={14} /> Add to Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="recommendations-note">
        <p>Our recommendations are powered by Gemini AI and based on your reading preferences.</p>
        <p>The more books you read and add to your wishlist, the better our recommendations will be!</p>
      </div>
    </div>
  );
};

export default Recommendations;