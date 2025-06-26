const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

/**
 * @swagger
 * /api/progress/{traineeId}/progress:
 *   get:
 *     summary: Get trainee's progress categorized by activity type
 *     tags: [Progress]
 *     parameters:
 *       - in: path
 *         name: traineeId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the trainee
 *     responses:
 *       200:
 *         description: Categorized progress data by activity type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activitiesByType:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         date:
 *                           type: string
 *                           example: "5/1/2025"
 *                         duration:
 *                           type: number
 *                           example: 45
 *       500:
 *         description: Server error while fetching progress
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch progress data
 */


router.get('/:traineeId/progress', async (req, res) => {
  const { traineeId } = req.params;

  try {
    const activities = await Activity.find({ traineeId });
    console.log('Fetched activities:', activities);

    const categorized = {};

    activities.forEach((act) => {
      const type = act.activityType.trim().toLowerCase();
      const date = new Date(act.date).toLocaleDateString();

      if (!categorized[type]) {
        categorized[type]=[];
      }
        categorized[type].push({
          date,
          duration: act.duration
        });
    });

    res.json({activitiesByType:categorized});
  } catch (err) {
    console.error('Error fetching progress:', err);
    res.status(500).json({ error: 'Failed to fetch progress data' });
  }
});

module.exports = router;
