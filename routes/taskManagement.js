


// const express = require('express');
// const router = express.Router();
// const Task = require('../Schema/task');
// const fetchUser = require('../middleware/fetchUser');
// const { body , validationResult } = require('express-validator');


// //Route 1 :Add new TASK using Using Post:task/AddTask - Login required
// router.post(
//     "/AddTask",
//     fetchUser,
//     [
//       //title must be minimum of 1 chars
//       body("title", "Enter a valid title").isLength({ min: 1 }),
//       // description must be minimum of 5 chars
//       body("description", "Enter a minimum 5 characater").isLength({ min: 5 }),],
//     async (req, res) => {
//       try {
      
//         const { title, description, priority, assignedTo, status, dueDate } = req.body;
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//           return res.status(400).json({ errors: errors.array() });
//         }

//         const newTask = new Task({
//             title,
//             description,
//             priority,
//             assignedTo,
//             status,
//             dueDate,
//           });
//         const savedTask = await newTask.save();
//         res.json(savedTask);
//       } catch (error) {
//         console.error(err.message);
//         res.status(500).send("Internal Server Error");
//       }
//     }
//   );
