const mongoose = require('mongoose');

/**
 * Care Record MongoDB Model Schema
 * Assigned Member: BODASU NITHIN (Backend: Database & APIs)
 * Roll Number: 2303A51803
 * Timeline & Reminders: MATAPALLY MEGHANA (2303A52505)
 */
const careRecordSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
    },
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    careType: {
      type: String,
      enum: ['Vaccination', 'Medication', 'Grooming', 'Vet Visit', 'Deworming', 'Nutrition', 'Other'],
      required: [true, 'Care type is required'],
    },
    title: {
      type: String,
      required: [true, 'Care record title is required'],
      trim: true,
    },
    dateAdministered: {
      type: Date,
      default: Date.now,
    },
    eventDate: {
      type: Date,
    },
    nextDueDate: {
      type: Date,
      required: [true, 'Next scheduled or reminder due date is required'],
    },
    status: {
      type: String,
      enum: ['Completed', 'Upcoming', 'Overdue', 'Due Today'],
      default: 'Upcoming',
    },
    notes: {
      type: String,
      trim: true,
    },
    cost: {
      type: Number,
      default: 0,
    },
    veterinarian: {
      type: String,
      trim: true,
    },
    providerName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = mongoose.model('CareRecord', careRecordSchema);
