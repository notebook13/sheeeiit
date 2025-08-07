// Vercel serverless function for leaderboard API
// This file should be placed in /api/leaderboard.js for Vercel deployment

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get leaderboard data
      const { type = 'alltime' } = req.query;
      
      // In a real implementation, you'd fetch from a database
      // For now, we'll use a simple in-memory store (not persistent)
      const scores = getScores(type);
      
      res.status(200).json({
        success: true,
        data: scores
      });
    } else if (req.method === 'POST') {
      // Submit a new score
      const { distance, playerName, type = 'alltime' } = req.body;
      
      if (!distance || !playerName) {
        return res.status(400).json({
          success: false,
          message: 'Distance and playerName are required'
        });
      }
      
      // Add the score
      const newScore = {
        distance: parseInt(distance),
        playerName: playerName,
        date: new Date().toISOString(),
        timestamp: Date.now()
      };
      
      addScore(newScore, type);
      
      res.status(200).json({
        success: true,
        message: 'Score submitted successfully!'
      });
    } else {
      res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
    }
  } catch (error) {
    console.error('Leaderboard API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Simple in-memory storage (in production, use a real database)
let allTimeScores = [];
let dailyScores = [];

function getScores(type) {
  if (type === 'daily') {
    const today = new Date().toDateString();
    return dailyScores
      .filter(score => new Date(score.date).toDateString() === today)
      .sort((a, b) => b.distance - a.distance)
      .slice(0, 10);
  } else {
    return allTimeScores
      .sort((a, b) => b.distance - a.distance)
      .slice(0, 10);
  }
}

function addScore(score, type) {
  if (type === 'daily') {
    dailyScores.push(score);
    dailyScores.sort((a, b) => b.distance - a.distance);
    dailyScores = dailyScores.slice(0, 10);
  } else {
    allTimeScores.push(score);
    allTimeScores.sort((a, b) => b.distance - a.distance);
    allTimeScores = allTimeScores.slice(0, 10);
  }
} 