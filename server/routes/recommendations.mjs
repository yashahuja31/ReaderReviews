import express from 'express';
import axios from 'axios';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/recommendations - Generate book recommendations using Gemini API
router.post('/', protect, async (req, res) => {
  try {
    const { prompt, apiKey } = req.body;

    if (!prompt || !apiKey) {
      return res.status(400).json({ message: 'Prompt and API key are required' });
    }

    // Call Gemini API
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
      }
    );

    // Extract the response text
    const responseText = response.data.candidates[0].content.parts[0].text;
    
    // Parse JSON from the response
    let jsonStr = responseText;
    
    // If the response contains a JSON array, extract it
    const jsonMatch = responseText.match(/\[\s*\{.*\}\s*\]/s);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    
    // Parse the JSON
    let recommendations;
    try {
      recommendations = JSON.parse(jsonStr);
      
      // Validate that recommendations is an array of objects with required fields
      if (!Array.isArray(recommendations) || !recommendations.every(rec => 
        rec.title && rec.author && rec.reason)) {
        throw new Error('Invalid recommendation format');
      }
    } catch (error) {
      console.error('Error parsing recommendations:', error);
      
      // Fallback: If we can't parse JSON, create a simple recommendation object
      try {
        // Try to extract meaningful information from the text
        const lines = responseText.split('\n').filter(line => line.trim());
        recommendations = [];
        
        let currentRec = {};
        for (const line of lines) {
          if (line.includes('Title:') || line.includes('Book:')) {
            if (currentRec.title) {
              recommendations.push(currentRec);
              currentRec = {};
            }
            currentRec.title = line.split(':')[1]?.trim() || 'Unknown Title';
          } else if (line.includes('Author:')) {
            currentRec.author = line.split(':')[1]?.trim() || 'Unknown Author';
          } else if (line.includes('Reason:') || line.includes('Why:')) {
            currentRec.reason = line.split(':')[1]?.trim() || 'Based on your reading history';
          } else if (currentRec.title && !currentRec.reason) {
            currentRec.reason = line.trim();
          }
        }
        
        if (currentRec.title) {
          recommendations.push(currentRec);
        }
        
        if (recommendations.length === 0) {
          throw new Error('Could not extract recommendations');
        }
      } catch (fallbackError) {
        console.error('Fallback parsing failed:', fallbackError);
        return res.status(500).json({
          message: 'Failed to parse recommendations from Gemini API response',
          rawResponse: responseText
        });
      }
    }

    return res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error.response?.data || error.message);
    return res.status(500).json({ 
      message: 'Failed to generate recommendations',
      error: error.response?.data || error.message
    });
  }
});

export default router;