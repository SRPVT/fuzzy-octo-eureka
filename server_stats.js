const express = require('express');
const fetch = require('node-fetch');

// Add to main Express app for stats endpoint
function setupStatsEndpoint(app, botToken) {
  // API: Get bot stats
  app.get('/api/bot-stats', async (req, res) => {
    const token = botToken;
    
    if (!token) {
      return res.json({ 
        commands: 150, 
        servers: 8, 
        users: 122,
        uptime: 99 
      });
    }

    try {
      // Fetch bot info from Discord
      const botResponse = await fetch('https://discord.com/api/v10/users/@me', {
        headers: { Authorization: `Bot ${token}` },
      });

      if (!botResponse.ok) {
        throw new Error('Failed to fetch bot info');
      }

      // Simulate live updates - in production, store these in database
      const stats = {
        commands: 150 + Math.floor(Math.random() * 50),
        servers: 8 + Math.floor(Math.random() * 3),
        users: 122 + Math.floor(Math.random() * 100),
        uptime: 99,
        lastUpdated: new Date().toISOString()
      };

      res.json(stats);
    } catch (error) {
      console.error('Stats fetch error:', error.message);
      res.json({ 
        commands: 150, 
        servers: 8, 
        users: 122,
        uptime: 99 
      });
    }
  });
}

module.exports = { setupStatsEndpoint };
