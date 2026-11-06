const mongoose = require('mongoose');

const careRecordSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'Pet',
      required: [true, 'Care record must belong to a pet'],
    },
    petId: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'Pet',
    },
    owner: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'User',
    },
    ownerId: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'User',
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
        message: '{VALUE} is not a supported care type',
      },
      required: [true, 'Care type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required for the care record'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    dateAdministered: {
      type: Date,
      default: Date.now,
    },
    eventDate: {
      type: Date,
      default: Date.now,
    },
    nextDueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: {
        values: ['Completed', 'Upcoming', 'Overdue', 'upcoming', 'overdue', 'completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Upcoming',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: '',
    },
    cost: {
      type: Number,
      min: [0, 'Cost cannot be negative'],
      default: 0,
    },
    veterinarian: {
      type: String,
      trim: true,
      default: '',
    },
    providerName: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

careRecordSchema.pre('save', function (next) {
  if (this.petId && !this.pet) this.pet = this.petId;
  if (this.pet && !this.petId) this.petId = this.pet;
  if (this.ownerId && !this.owner) this.owner = this.ownerId;
  if (this.owner && !this.ownerId) this.ownerId = this.owner;
  if (this.eventDate && !this.dateAdministered) this.dateAdministered = this.eventDate;
  if (this.dateAdministered && !this.eventDate) this.eventDate = this.dateAdministered;
  if (this.providerName && !this.veterinarian) this.veterinarian = this.providerName;
  if (this.veterinarian && !this.providerName) this.providerName = this.veterinarian;
  next();
});

module.exports = mongoose.model('CareRecord', careRecordSchema);

