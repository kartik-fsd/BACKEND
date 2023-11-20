const express = require('express');
const router = express.Router();
const Task = require('../Schema/task');
const fetchUser = require('../middleware/fetchUser');
const Team = require('../Schema/team');

// Create a task within a team (only admins can create tasks)
// router.post('/create_task', fetchUser, async (req, res) => {
//   try {
//     const { title, description, priority, status, dueDate } = req.body;
//     const teamId = req.body.teamId || req.headers['team-id'];
//     const userId = req.user._id;

//     const team = await Team.findById(teamId);
//     if (!team) {
//       return res.status(404).json({ error: 'Team not found' });
//     }

//     const isAdmin = team.team_members.find(member => {
//       return member.userId.toString() === userId && member.admin;
//     });

//     if (!isAdmin) {
//       return res.status(403).json({ error: 'Unauthorized: Only admins can create tasks' });
//     }

//     const newTask = new Task({
//       title,
//       description,
//       priority,
//       assignedTo: teamId,
//       status,
//       dueDate
//     });

//     const createdTask = await newTask.save();
//     res.status(201).json(createdTask);
//   } catch (error) {
//     console.error('Error creating task:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
router.post('/create_task', fetchUser, async (req, res) => {
    try {
      const { title, description, priority, status, dueDate } = req.body;
      const teamId = req.body.teamId || req.headers['team-id'];
      const userId = req.user._id;
  
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
  
      const isAdmin = team.team_members.find(member => {
        return member?.userId?.toString() === userId && member.admin;
      });
  
      if (!isAdmin) {
        return res.status(403).json({ error: 'Unauthorized: Only admins can create tasks' });
      }
  
      const newTask = new Task({
        title,
        description,
        priority,
        assignedTo: team?._id, // Assign the Task to the Team using its ObjectId
        status,
        dueDate
      });
  
      const createdTask = await newTask.save();
      res.status(201).json(createdTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
// Update a task within a team
// router.put('/update_task/:taskId', fetchUser, async (req, res) => {
//   try {
//     const taskId = req.params.taskId;
//     const { title, description, priority, status, dueDate } = req.body;
//     const userId = req?.user?._id;

//     const task = await Task?.findById(taskId);
//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' });
//     }

//     // Check if the user is assigned to the team of the task (by team ID)
//     if (task?.assignedTo?.toString() !== userId) {
//       return res.status(403).json({ error: 'Unauthorized: You are not assigned to this task\'s team' });
//     }

//     // Update the task properties
//     task.title = title;
//     task.description = description;
//     task.priority = priority;
//     task.status = status;
//     task.dueDate = dueDate;

//     const updatedTask = await task.save();
//     res.json(updatedTask);
//   } catch (error) {
//     console.error('Error updating task:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.put('/update_task/:taskId', fetchUser, async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const { title, description, priority, status, dueDate } = req.body;
      const userId = req?.user?._id;
  
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
          $set: {
            title,
            description,
            priority,
            status,
            dueDate
          }
        },
        { new: true, runValidators: true }
      );
  
      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      // Check if the user is assigned to the team of the task (by team ID)
      if (updatedTask?.assignedTo?.toString() !== userId) {
        return res.status(403).json({ error: 'Unauthorized: You are not assigned to this task\'s team' });
      }
  
      res.json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
// Get tasks visible to the user (assigned to the team or where the user is an admin)
router.get('/tasks', fetchUser, async (req, res) => {
  try {
    const userId = req?.user?._id;

    const tasks = await Task?.find({ assignedTo: userId }); // Fetch tasks assigned to the user's team

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
