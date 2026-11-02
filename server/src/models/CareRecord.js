const mongoose = require('mongoose');

/**
 * Care Record MongoDB Model Schema
 * Assigned Member: BODASU NITHIN (Backend: Database & APIs)
 * Roll Number: 2303A51803 · Branch: CSE
 */
const careRecordSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'Care record must belong to a pet'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Care record must have an owner'],
    },
    careType: {
      type: String,
      enum: {
        values: [
          'Vaccination',
          'Medication',
          'Grooming',
          'Vet Visit',
          'Deworming',
          'Nutrition',
          'Other',
        ],
        message: '{VALUE} is not a valid care type',
      },
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
    nextDueDate: {
      type: Date,
      required: [true, 'Next scheduled or reminder due date is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['Completed', 'Upcoming', 'Overdue'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Upcoming',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    cost: {
      type: Number,
      default: 0,
      min: [0, 'Cost cannot be negative'],
    },
    veterinarian: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for backward-compatibility with code expecting petId or ownerId
careRecordSchema.virtual('petId').get(function () {
  return this.pet;
});

careRecordSchema.virtual('ownerId').get(function () {
  return this.owner;
});

// Pre-validate hook: auto-map petId/ownerId if pet/owner are missing
careRecordSchema.pre('validate', function (next) {
  if (!this.pet && this.get('petId')) {
    this.pet = this.get('petId');
  }
  if (!this.owner && this.get('ownerId')) {
    this.owner = this.get('ownerId');
  }
  next();
});

module.exports = mongoose.model('CareRecord', careRecordSchema);
