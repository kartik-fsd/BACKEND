const express = require('express');
const router = express.Router();
const Team = require('../Schema/team'); // Import the Team model
const fetchUser = require('../middleware/fetchUser'); // Import the fetchUser middleware

// Route to fetch all teams created by a user
router.get('/all-teams', fetchUser, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in req.user._id after using the fetchUser middleware
    // Find all teams created by the user
    const teams = await Team.find({ creator: userId });

    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
