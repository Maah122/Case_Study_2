const express = require('express');
const router = express.Router();
const Distance = require('../models/distance');

// POST route to save distances
router.post('/distances', async (req, res) => {
  const { distance1, distance2 } = req.body;

  if (distance1 === undefined || distance2 === undefined) {
    return res.status(400).send('Both distances are required.');
  }

  try {
    const newDistance = new Distance({ distance1, distance2 });
    await newDistance.save();
    res.status(201).send(newDistance);
  } catch (error) {
    res.status(500).send('Error saving distances: ' + error.message);
  }
});

// GET route to retrieve all distances
router.get('/distances', async (req, res) => {
  try {
    const distances = await Distance.find().sort({ createdAt: -1 });
    res.status(200).send(distances);
  } catch (error) {
    res.status(500).send('Error retrieving distances: ' + error.message);
  }
});

module.exports = router;
