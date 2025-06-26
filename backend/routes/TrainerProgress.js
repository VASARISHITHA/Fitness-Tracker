// routes/Trainerprogress.js
const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity'); // Adjust path if needed

/**
 * @swagger
 * /api/progress/trainer/filter:
 *   get:
 *     summary: Filter trainee activity progress based on date, location, or trainee ID
 *     tags: [Trainer Progress]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Specific date to filter activities (e.g., 2025-05-01)
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         required: false
 *         description: Month (MM) to filter activities (requires `year`)
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         required: false
 *         description: Year (YYYY) to filter activities
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         required: false
 *         description: City name (case-insensitive partial match)
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         required: false
 *         description: Country name (case-insensitive partial match)
 *       - in: query
 *         name: traineeId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter activities for a specific trainee
 *     responses:
 *       200:
 *         description: Filtered list of activity records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   traineeId:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   activityType:
 *                     type: string
 *                   duration:
 *                     type: number
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */

router.get('/trainer/filter', async (req, res) => {
  try {
    const { date, month, year, city, country, traineeId } = req.query;
    const filter = {};

    // Filter by exact date
    if (date) {
      const selectedDate = new Date(date);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);
      filter.date = { $gte: selectedDate, $lt: nextDay };
    } 
    // Filter by month & year
    else if (month && year) {
      const start = new Date(`${year}-${month}-01`);
      const end = new Date(start);
      end.setMonth(start.getMonth() + 1);
      filter.date = { $gte: start, $lt: end };
    } 
    // Filter by year only
    else if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${+year + 1}-01-01`);
      filter.date = { $gte: start, $lt: end };
    }

    if (city) filter.city = new RegExp(city, 'i');
    if (country) filter.country = new RegExp(country, 'i');
    if (traineeId) filter.traineeId = traineeId;

    const activities = await Activity.find(filter).sort({ date: 1 });
    res.json(activities);
  } catch (err) {
    console.error('Error filtering trainer progress:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
