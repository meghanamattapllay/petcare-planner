const mongoose = require('mongoose');

/**
 * Pet MongoDB Model Schema
 * Assigned Member: BODASU NITHIN (Backend: Database & APIs)
 * Roll Number: 2303A51803 · Branch: CSE
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
      enum: {
        values: ['Male', 'Female', 'Unknown'],
        message: '{VALUE} is not a valid gender',
      },
      default: 'Unknown',
    },
    weight: {
      type: Number, // weight in kilograms
      min: [0, 'Weight cannot be negative'],
    },
    allergies: {
      type: [String],
      default: [],
    },
    photoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'User',
      required: [true, 'Pet owner is required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for care records linked to this pet
petSchema.virtual('careRecords', {
  ref: 'CareRecord',
  localField: '_id',
  foreignField: 'pet',
  justOne: false,
});

module.exports = mongoose.model('Pet', petSchema);
