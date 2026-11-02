const mongoose = require('mongoose');

/**
 * Pet MongoDB Model Schema
 * Assigned Member: BODASU NITHIN (Backend: Database & APIs)
 * Roll Number: 2303A51803
 */
const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
    },
    species: {
      type: String,
      required: [true, 'Species is required (e.g. Dog, Cat, Bird)'],
      trim: true,
    },
    breed: {
      type: String,
      trim: true,
      default: 'Unknown',
    },
    age: {
      type: Number,
      min: [0, 'Age cannot be negative'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unknown'],
      default: 'Unknown',
    },
    weight: {
      type: Number, // in kg
    },
    allergies: {
      type: [String],
      default: [],
    },
    photoUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pet', petSchema);
