import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get book recommendations based on user's reading history and preferences
 * @param {Array} readBooks - Books the user has read
 * @param {Array} wishlistBooks - Books in the user's wishlist
 * @returns {Promise<Array>} - Array of recommended book objects
 */
export async function getBookRecommendations(readBooks, wishlistBooks) {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Create a prompt with the user's reading history
    const readTitles = readBooks.map(book => book.title).join(', ');
    const wishlistTitles = wishlistBooks.map(book => book.title).join(', ');
    
    const prompt = `Based on the following books a user has read: ${readTitles}
    And these books in their wishlist: ${wishlistTitles}
    
    Please recommend 5 books that this user might enjoy. For each book, provide:
    1. Title
    2. Author
    3. Genre
    4. A brief description (2-3 sentences)
    
    Format the response as a JSON array of book objects with these fields.`;
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    // Find JSON in the response (it might be wrapped in markdown code blocks)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If no JSON found, try to parse the whole response
    return JSON.parse(text);
  } catch (error) {
    console.error('Error getting recommendations from Gemini:', error);
    // Return fallback recommendations if API fails
    return getFallbackRecommendations();
  }
}

/**
 * Provides fallback recommendations if the API call fails
 * @returns {Array} - Array of fallback book recommendations
 */
function getFallbackRecommendations() {
  return [
    {
      title: "The Midnight Library",
      author: "Matt Haig",
      genre: "Fiction",
      description: "A novel about the choices that go into a life well lived."
    },
    {
      title: "Project Hail Mary",
      author: "Andy Weir",
      genre: "Science Fiction",
      description: "A lone astronaut must save the earth from disaster."
    },
    {
      title: "The Silent Patient",
      author: "Alex Michaelides",
      genre: "Thriller",
      description: "A psychological thriller about a woman who shoots her husband."
    },
    {
      title: "Educated",
      author: "Tara Westover",
      genre: "Memoir",
      description: "A memoir about a woman who leaves her survivalist family."
    },
    {
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      genre: "Fiction",
      description: "A murder mystery about a girl who grew up in the marsh."
    }
  ];
}

export default { getBookRecommendations };