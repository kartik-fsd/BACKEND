const express = require('express');
const router = express.Router();
const Team = require('../Schema/team'); // Import the Team model
const fetchUser = require('../middleware/fetchUser'); // Import the fetchUser middleware

// Route to fetch all members of a team
router.get('/:teamId/members', fetchUser, async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const userId = req.user._id; // Assuming user ID is available in req.user._id after using the fetchUser middleware

    // Find the team by ID and ensure the user is part of that team
    const team = await Team.findOne({ _id: teamId, 'team_members.userId': userId });
    if (!team) {
      return res.status(404).json({ error: 'Team not found or user is not a member' });
    }

    // Return the team members
    const members = team.team_members;
    res.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
