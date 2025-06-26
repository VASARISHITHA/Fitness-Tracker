const express = require('express');
const Plan = require('../models/Plan');  // Ensure that path is correct
const router = express.Router();
/**
 * @swagger
 * /api/plans:
 *   post:
 *     summary: Create a new exercise plan
 *     tags: [Plan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planName
 *               - exerciseType
 *               - duration
 *               - workoutType
 *             properties:
 *               planName:
 *                 type: string
 *                 example: Full Body Workout
 *               exerciseType:
 *                 type: string
 *                 example: Cardio
 *               duration:
 *                 type: number
 *                 example: 45
 *               workoutType:
 *                 type: string
 *                 example: High Intensity
 *               assignedTo:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: 66134f2d1e78a9f537a9c445
 *     responses:
 *       201:
 *         description: Plan created successfully
 *       500:
 *         description: Failed to create plan
 */

// Route for creating a new plan
router.post('/plans', async (req, res) => {
  const { planName, exerciseType, duration, workoutType,assignedTo } = req.body;

  try {
    const newPlan = new Plan({
      planName,
      exerciseType,
      duration,
      workoutType,
      assignedTo
    });

    // Save the plan in the database
    const savedPlan = await newPlan.save();
    res.status(201).json({ message: 'Plan created successfully', plan: savedPlan });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create plan', details: error.message });
  }
});
/**
 * @swagger
 * /api/plans:
 *   get:
 *     summary: Get all plans
 *     tags: [Plan]
 *     responses:
 *       200:
 *         description: A list of plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Failed to fetch plans
 */

// Get all plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});


/**
 * @swagger
 * /api/trainee-plans/assign/{planId}:
 *   put:
 *     summary: Assign a plan to a trainee
 *     tags: [Plan]
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the plan to assign
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - traineeId
 *             properties:
 *               traineeId:
 *                 type: string
 *                 example: 66134f2d1e78a9f537a9c445
 *     responses:
 *       200:
 *         description: Plan assigned successfully
 *       400:
 *         description: Plan already assigned to trainee
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Failed to assign plan
 */

router.put('/trainee-plans/assign/:planId', async (req, res) => {
  const { traineeId } = req.body;
  const { planId } = req.params;  // Get planId from the URL params

  try {
    // Find the plan by its ID
    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Check if the plan is already assigned
    if (plan.assignedTo.includes(traineeId)) {
      return res.status(400).json({ error: 'This plan is already assigned to another trainee' });
    }

    // Assign the plan to the trainee
    plan.assignedTo.push(traineeId);

    // Save the updated plan
    const updatedPlan = await plan.save();

    res.status(200).json({ message: 'Plan assigned successfully', plan: updatedPlan });
  } catch (error) {
    console.error('Error assigning plan:', error);
    res.status(500).json({ error: 'Failed to assign plan', details: error.message });
  }
});
module.exports = router;
