const express = require('express');
const router = express.Router();
const Team = require('../Schema/team'); // Import the Team model
const User = require('../Schema/register')
const fetchUser = require("../middleware/fetchUser");
const nodemailer = require("nodemailer");

// Route to create a new team
router.post('/create_team', fetchUser, async (req, res) => {
  try {
    const { name, description, team_members} = req.body;
    const creatorId = req.user._id; // Assuming req.user contains the user details
    const memberIds = req.body.memberIds; // Assuming memberIds are passed in the request body

    const newTeam = new Team({
      name,
      description,
      team_members
    });

       // Add the creator as an admin and member to the team
       newTeam.team_members.push({ userId: creatorId, role: 'admin', admin: true });

       // Add other members to the team (assuming memberIds are passed in the request body)
       if (memberIds && Array.isArray(memberIds)) {
         memberIds.forEach(memberId => {
           // Check if the memberId is the creatorId to avoid duplication
           if (memberId !== creatorId) {
             // Add other members as regular members to team_members
             newTeam.team_members.push({ userId: memberId, role: 'member', admin: false });
           }
         });
       }

    const createdTeam = await newTeam.save();
    const teamMemberIds = team_members.map(member => member.userId);
    const users = await User.find({ _id: { $in: teamMemberIds } }, 'email');

    console.log(users,'oe')
   
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'baby.dicki@ethereal.email',
          pass: '2KsfdMj8dkyYdVgV4p'
      }
  });
    // Send invitations to each member's email address
    users.forEach(user => {
      const emailOptions = {
        from: 'taskmanagement@gmail.com',
        to: user.email, // Member's email address
        subject: 'Invitation to join the team',
        html: `<p>Hello,<br/>You've been invited to join the team. Click <a href="invitation_link_here">here</a> to accept the invitation.</p>`,
      };

      transporter.sendMail(emailOptions, (error, info) => {
        if (error) {
          console.error('Error sending invitation:', error);
        } else {
          console.log('Invitation email sent:', info.response);
        }
      });
    });

    // Handle success or response after sending invitations
    
    res.status(201).json({ message: 'Team created and invitations sent successfully', createdTeam });
    console.log(teamMemberIds,'kl')
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Route to promote a member to admin within a team
router.put('/:teamId/promote/:userId', async (req, res) => {
  try {
    
        const { teamId, userId } = req.params;
    
        const team = await Team.findById(teamId);
        if (!team) {
          return res.status(404).json({ error: 'Team not found' });
        }
    
        // Check if the user performing the action is an admin (authorization check)
        const adminUser = team.team_members.find((m) => m.userId.toString() === req.user.id && m.admin);
        if (!adminUser) {
          return res.status(403).json({ error: 'Unauthorized: Only admins can promote team_members' });
        }
    
        // Promote the specified user to admin within the team
        team.promoteToAdmin(userId);
        await team.save();
    
        res.json({ message: 'User promoted to admin successfully' });
      
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
