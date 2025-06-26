const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const router = express.Router();
/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with hashed password
 *     tags: [Sign Up]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: mysecurepassword
 *               role:
 *                 type: string
 *                 enum: [Trainer, Trainee]
 *                 example: Trainee
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 name:
 *                   type: string
 *       400:
 *         description: User already exists or missing fields
 *       500:
 *         description: Server error
 */

router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully!',userId: newUser._id, name:newUser.name });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

module.exports = router;
