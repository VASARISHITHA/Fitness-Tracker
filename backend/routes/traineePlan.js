// Get all plans assigned to a specific trainee
const Plan=require('../models/Plan')
const mongoose=require('mongoose')
const express=require('express');
const router = express.Router();
/**
 * @swagger
 * /api/trainee-plans/assigned/{traineeId}:
 *   get:
 *     summary: Get all plans assigned to a specific trainee
 *     tags: [Trainee Plans]
 *     parameters:
 *       - in: path
 *         name: traineeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the trainee
 *     responses:
 *       200:
 *         description: List of assigned plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   planName:
 *                     type: string
 *                     example: "Full Body Workout"
 *                   exerciseType:
 *                     type: string
 *                     example: "Cardio"
 *                   duration:
 *                     type: number
 *                     example: 45
 *                   workoutType:
 *                     type: string
 *                     example: "Endurance"
 *                   assignedTo:
 *                     type: array
 *                     items:
 *                       type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Invalid trainee ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid trainee ID
 *       500:
 *         description: Server error while fetching plans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch assigned plans
 */

router.get('/trainee-plans/assigned/:traineeId', async (req, res) => {
    const{traineeId}=req.params;
    try {
    if (!mongoose.Types.ObjectId.isValid(traineeId)) {
            return res.status(400).json({ error: 'Invalid trainee ID' });
          }
      console.log("Searching plans for trainee:", traineeId);
      const plans = await Plan.find({ assignedTo:{$in:[new mongoose.Types.ObjectId(traineeId)]}});
      res.json(plans);
    } catch (error) {
      console.error('Error fetching assigned plans:', error);
      res.status(500).json({ error: 'Failed to fetch assigned plans' });
    }
  });
module.exports = router;