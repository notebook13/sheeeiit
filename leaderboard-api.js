// Real Leaderboard API Handler
class LeaderboardAPI {
  constructor() {
    // API endpoint - update this to your deployed API URL
    this.apiURL = '/api/leaderboard'; // For Vercel deployment
    // this.apiURL = 'https://your-domain.vercel.app/api/leaderboard'; // For production
  }

  // Get leaderboard data
  async getLeaderboard(type = 'alltime') {
    try {
      // Use localStorage as primary method for now
      const scores = JSON.parse(localStorage.getItem(`${type}Scores`) || '[]');
      return scores.sort((a, b) => b.distance - a.distance).slice(0, 10);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }

  // Submit a new score
  async submitScore(scoreData) {
    try {
      const { distance, playerName, type = 'alltime' } = scoreData;
      
      // For now, use localStorage as the primary method since API isn't deployed yet
      const scores = JSON.parse(localStorage.getItem(`${type}Scores`) || '[]');
      const newScore = {
        distance: distance,
        playerName: playerName,
        date: new Date().toISOString(),
        timestamp: Date.now()
      };
      
      scores.push(newScore);
      scores.sort((a, b) => b.distance - a.distance);
      const topScores = scores.slice(0, 10);
      localStorage.setItem(`${type}Scores`, JSON.stringify(topScores));
      
      // Try to submit to API as well (but don't fail if it doesn't work)
      try {
        const response = await fetch(this.apiURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            distance: distance,
            playerName: playerName,
            type: type
          })
        });
        
        const data = await response.json();
        if (data.success) {
          return { success: true, message: 'Score submitted to global leaderboard!' };
        }
      } catch (apiError) {
        console.log('API not available, using local storage');
      }
      
      return { success: true, message: 'Score saved to leaderboard!' };
    } catch (error) {
      console.error('Error submitting score:', error);
      return { success: false, message: 'Failed to submit score' };
    }
  }

  // Get daily leaderboard
  async getDailyLeaderboard() {
    try {
      // Use localStorage as primary method for now
      const allScores = JSON.parse(localStorage.getItem('alltimeScores') || '[]');
      const today = new Date().toDateString();
      
      const todayScores = allScores.filter(score => {
        const scoreDate = new Date(score.date).toDateString();
        return scoreDate === today;
      });
      
      return todayScores.sort((a, b) => b.distance - a.distance).slice(0, 10);
    } catch (error) {
      console.error('Error fetching daily leaderboard:', error);
      return [];
    }
  }

  // Check if score qualifies for leaderboard
  async checkScoreQualification(distance, type = 'alltime') {
    try {
      const scores = await this.getLeaderboard(type);
      const minScore = scores.length > 0 ? scores[scores.length - 1].distance : 0;
      return distance > minScore || scores.length < 10;
    } catch (error) {
      console.error('Error checking score qualification:', error);
      return true; // Default to allowing the score
    }
  }
}

// Initialize the API
const leaderboardAPI = new LeaderboardAPI(); 