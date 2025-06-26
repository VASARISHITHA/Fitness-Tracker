const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const mongoose=require('mongoose')

/**
 * @swagger
 * /api/group/create:
 *   post:
 *     summary: Create a new group
 *     tags: [Group]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - trainer
 *               - trainees
 *             properties:
 *               name:
 *                 type: string
 *                 example: Beginner Group
 *               trainer:
 *                 type: string
 *                 example: 662ab1a8e4387b8c58c3c999
 *               trainees:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [ "662ab1f7e4387b8c58c3c99a", "662ab202e4387b8c58c3c99b" ]
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Missing or invalid input
 *       500:
 *         description: Failed to create group
 */

// Create new group
router.post('/group/create', async (req, res) => {
  const { name, trainer,trainees } = req.body;
  console.log(req.body);
  if (!mongoose.Types.ObjectId.isValid(trainer)) {
    return res.status(400).json({ message: 'Invalid trainer ID' });
  }

  if (!name || !trainer ||!trainees ||!Array.isArray(trainees)) {
    return res.status(400).json({ message: 'Group name and trainer ID are required.' });
  }

  try {
    const newGroup = new Group({
      name,
      trainer,
      trainees,
      groupid: Math.floor(Math.random() * 1000), // Generate a random group id (you may change it as needed)
    });

    await newGroup.save();
    res.status(201).json({ message: 'Group created successfully!', data: newGroup });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Failed to create group', error: error.message });
  }
});


/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Get all group names and IDs
 *     tags: [Group]
 *     responses:
 *       200:
 *         description: List of group IDs and names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *       500:
 *         description: Server error fetching groups
 */

// GET all groups
router.get('/groups', async (req, res) => {
  try {
    const groups= await Group.find({},'_id name');
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching groups' });
  }
});

 /**
 * @swagger
 * /api/group/{groupId}:
 *   get:
 *     summary: Get group details with members
 *     tags:
 *       - Group
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group to retrieve
 *     responses:
 *       200:
 *         description: Group details with member information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6637e72f0a9d8d7c982cd763"
 *                 name:
 *                   type: string
 *                   example: "Beginner Bootcamp"
 *                 trainees:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6637e7460a9d8d7c982cd76f"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                       role:
 *                         type: string
 *                         example: "trainee"
 *       404:
 *         description: Group not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Group not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server Error
 *                 error:
 *                   type: string
 *                   example: Error details
 */
//get group details along with members
router.get('/group/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate('trainees', 'name email role'); 
    // populate 'members' field with selected user fields

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error('Error fetching group details:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});
module.exports = router;
