const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

/**
 * @swagger
 * /api/activity/update:
 *   post:
 *     summary: Add trainee's activity
 *     tags: [Activity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - traineeId
 *               - date
 *               - activityType
 *               - duration
 *               - city
 *               - country
 *             properties:
 *               traineeId:
 *                 type: string
 *                 example: "662ab1f7e4387b8c58c3c99a"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-01"
 *               activityType:
 *                 type: string
 *                 example: "Running"
 *               duration:
 *                 type: number
 *                 example: 30
 *               city:
 *                 type: string
 *                 example: "New York"
 *               country:
 *                 type: string
 *                 example: "USA"
 *     responses:
 *       201:
 *         description: Activity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Activity updated successfully
 *                 activity:
 *                   type: object
 *       400:
 *         description: Missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: All fields are required
 *       500:
 *         description: Server error while saving activity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to update activity
 */

// POST: Update activity
router.post('/update', async (req, res) => {
  const { traineeId, date, activityType, duration, city, country } = req.body;

  if (!traineeId || !date || !activityType || !duration || !city || !country) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const activity = new Activity({
      traineeId,
      date,
      activityType,
      duration,
      city,
      country,
    });

    await activity.save();
    res.status(201).json({ message: 'Activity updated successfully', activity });
  } catch (error) {
    console.error('Error saving activity:', error);
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

module.exports = router;
