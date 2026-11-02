const mongoose = require('mongoose');

/**
 * Care Record MongoDB Model Schema
 * Assigned Member: BODASU NITHIN (Backend: Database & APIs)
 * Roll Number: 2303A51803
 */
const careRecordSchema = new mongoose.Schema(
  {
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    careType: {
      type: String,
      required: [true, 'Care type is required'],
    },
    title: {
      type: String,
      required: [true, 'Care record title is required'],
      trim: true,
    },
    eventDate: {
      type: Date,
      default: Date.now,
    },
    dateAdministered: {
      type: Date,
      default: Date.now,
    },
    nextDueDate: {
      type: Date,
    },
    status: {
      type: String,
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
    },
    providerName: {
      type: String,
      trim: true,
      default: '',
    },
    veterinarian: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to keep aliases synchronized
careRecordSchema.pre('save', function (next) {
  if (this.petId && !this.pet) this.pet = this.petId;
  if (this.pet && !this.petId) this.petId = this.pet;
  if (this.ownerId && !this.owner) this.owner = this.ownerId;
  if (this.owner && !this.ownerId) this.ownerId = this.owner;
  if (this.eventDate && !this.dateAdministered) this.dateAdministered = this.eventDate;
  if (this.dateAdministered && !this.eventDate) this.eventDate = this.dateAdministered;
  next();
});

module.exports = mongoose.model('CareRecord', careRecordSchema);
