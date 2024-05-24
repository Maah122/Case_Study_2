const mongoose = require('mongoose');

const DistanceSchema = new mongoose.Schema({
  distance1: {
    type: Number,
    required: true,
  },
  distance2: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Distance', DistanceSchema);
