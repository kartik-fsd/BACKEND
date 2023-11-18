const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  team_members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
      },
      role: {
        type: String,
        default: 'member', // Default role (member by default)
      },
      admin: {
        type: Boolean,
        default: false, // By default, a member is not an admin
      },
      
    },
  ],

}, { strict: false }); // Enable dynamic properties

// Add a method to the TeamSchema to promote a member to admin
TeamSchema.methods.promoteToAdmin = function (userId) {
  const member = this.team_members.find((m) => m.userId.equals(userId));
  if (member) {
    member.admin = true;
  }
};

const Team = mongoose.model('Team', TeamSchema);
module.exports = Team;
