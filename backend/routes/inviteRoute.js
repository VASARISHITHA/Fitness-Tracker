const express = require('express');
const router = express.Router();
const Invite = require('../models/Invite');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mongoose=require('mongoose')
const User = require('../models/userModel'); 
const Group=require('../models/Group')
require('dotenv').config();  // Load environment variables
/**
 * @swagger
 * tags:
 *   - name: Invite
 *     description: API for inviting trainees to join group
 */

/**
 * @swagger
 * /api/invite:
 *   post:
 *     summary: Send a group invitation to a trainee
 *     tags: [Invite]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - trainer
 *               - group
 *             properties:
 *               email:
 *                 type: string
 *                 example: trainee@example.com
 *               trainer:
 *                 type: string
 *                 example: 662ab1a8e4387b8c58c3c999
 *               group:
 *                 type: string
 *                 example: 662ab202e4387b8c58c3c99b
 *     responses:
 *       201:
 *         description: Invite sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invite sent successfully!
 *       400:
 *         description: Missing or invalid input
 *       500:
 *         description: Server Error
 */

// Mail transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Invite trainee API
router.post('/', async (req, res) => {
  const { email, trainer, group } = req.body;
  if (!mongoose.Types.ObjectId.isValid(group)) {
    return res.status(400).json({ message: 'Invalid group ID' });
  }
  if (!email || !trainer || !group) {
    return res.status(400).json({ message: 'Email, trainer ID, and group ID are required.' });
  }

  try {
    const existingInvite = await Invite.findOne({ email, group });
    if (existingInvite) {
      return res.status(400).json({ message: 'This trainee has already been invited to the group.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours()+24)

    const newInvite = new Invite({ email, trainer, group, token, expiresAt });
    await newInvite.save();

    const inviteLink = `http://localhost:3000/register/${token}`;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Fitness Tracker Group Invitation',
      html: `
        <h3>You are invited to join a fitness group!</h3>
        <p>Your trainer has invited you to join their fitness group.</p>
        <p>Click <a href="${inviteLink}">here</a> to accept the invitation.</p>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Invite sent successfully!' });

  } catch (error) {
    console.error('Error sending invite:', error.message);
    res.status(500).json({ message: 'Server Error' ,error:error.message});
  }
});

/**
 * @swagger
 * /api/invite/verify/{token}:
 *   get:
 *     summary: Verify invitation token
 *     tags: [Invite]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique invite token
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 group:
 *                   type: string
 *                 status:
 *                   type: string
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Server Error
 */

// Verify invite token API
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const invite = await Invite.findOne({ token });
    if (!invite) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    if (invite.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Token expired' });
    }

    res.status(200).json(invite);
  } catch (error) {
    console.error('Error verifying invite:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

/**
 * @swagger
 * /api/invite/accept/{token}:
 *   post:
 *     summary: Accept invitation and join a group
 *     tags: [Invite]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The invitation token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 6638e7560a9d8d7c982cd77f
 *     responses:
 *       200:
 *         description: Invite accepted and user added to group
 *       400:
 *         description: Invalid token, expired token, or group not found
 *       500:
 *         description: Server Error
 */

// Accept invite API
router.post('/accept/:token', async (req, res) => {
  const { token } = req.params;
  const { userId } = req.body; // Assuming userId is sent in the request body

  try {
    const invite = await Invite.findOne({ token });
    if (!invite) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    if (invite.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Token expired' });
    }

    // Add user to the group (assuming you have a Group model and a method to add users)
    const group = await Group.findById(invite.group);
    if (!group) {
      return res.status(400).json({ message: 'Group not found' });
    }

    invite.status = 'Accepted';
    await invite.save();

    group.trainees.push(userId);
    await group.save();

    res.status(200).json({ message: 'Invite accepted and user added to group' });
  } catch (error) {
    console.error('Error accepting invite:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});
module.exports = router;
