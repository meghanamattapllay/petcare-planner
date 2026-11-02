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
      required: [true, 'Species is required (e.g. Dog, Cat, Bird, Rabbit, Other)'],
      trim: true,
    },
    breed: {
      type: String,
      trim: true,
      default: '',
    },
    birthDate: {
      type: Date,
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
      type: Number,
    },
    allergies: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    photoUrl: {
      type: String,
      default: '',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to keep ownerId and owner synced
petSchema.pre('save', function (next) {
  if (this.ownerId && !this.owner) this.owner = this.ownerId;
  if (this.owner && !this.ownerId) this.ownerId = this.owner;
  next();
});

module.exports = mongoose.model('Pet', petSchema);
