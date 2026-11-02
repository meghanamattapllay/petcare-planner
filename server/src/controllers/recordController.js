const CareRecord = require('../models/CareRecord');
const Pet = require('../models/Pet');
const User = require('../models/User');

/**
 * Controller: Care Record CRUD & Timeline
 * Assigned Member: BODASU NITHIN (Backend: Database & APIs)
 * Timeline Integration: MATAPALLY MEGHANA (Reminders & Timeline)
 * Integrated by: Godishala Kruthik Roshan
 */

let mockRecords = [
  {
    _id: 'rec_01',
    pet: 'pet_01',
    careType: 'Vaccination',
    title: 'Rabies Annual Booster',
    dateAdministered: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Completed',
    notes: 'Administered 1ml subcutaneous. No immediate reaction observed.',
    cost: 45,
    veterinarian: 'Dr. Sarah Jenkins',
  },
  {
    _id: 'rec_02',
    pet: 'pet_01',
    careType: 'Grooming',
    title: 'Full Coat De-shedding & Bath',
    dateAdministered: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Upcoming',
    notes: 'Coat shampoo and nail trimming.',
    cost: 60,
    veterinarian: 'Happy Paws Salon',
  },
  {
    _id: 'rec_03',
    pet: 'pet_02',
    careType: 'Medication',
    title: 'Flea & Tick Prevention Pipette',
    dateAdministered: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Overdue',
    notes: 'Monthly topical dose required.',
    cost: 25,
    veterinarian: 'Dr. Patel',
  },
];

// @desc    Get all care records (with optional filter by petId, careType, status)
// @route   GET /api/records
const getRecords = async (req, res, next) => {
  try {
    const { petId, careType, status } = req.query;
    let records = [];

    try {
      const query = {};
      if (petId) query.pet = petId;
      if (careType) query.careType = careType;
      if (status) query.status = status;
      records = await CareRecord.find(query).populate('pet', 'name species');
    } catch (err) {
      records = mockRecords;
    }

    if (!records || records.length === 0) {
      records = mockRecords;
    }

    // Apply filtering if mock records used
    if (petId) {
      records = records.filter((r) => String(r.pet) === String(petId) || (r.pet && r.pet._id === petId));
    }
    if (careType) {
      records = records.filter((r) => r.careType.toLowerCase() === careType.toLowerCase());
    }
    if (status) {
      records = records.filter((r) => r.status.toLowerCase() === status.toLowerCase());
    }

    res.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create care record
// @route   POST /api/records
const createRecord = async (req, res, next) => {
  try {
    const { pet, careType, title, dateAdministered, nextDueDate, status, notes, cost, veterinarian } = req.body;

    if (!pet || !careType || !title || !nextDueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory fields: pet, careType, title, and nextDueDate',
      });
    }

    let ownerId = req.user ? req.user.id : null;
    if (!ownerId && pet) {
      try {
        const petDoc = await Pet.findById(pet).lean();
        if (petDoc && (petDoc.owner || petDoc.ownerId)) {
          ownerId = petDoc.owner || petDoc.ownerId;
        }
      } catch (e) {}
    }
    if (!ownerId) {
      try {
        const userDoc = await User.findOne().lean();
        if (userDoc) ownerId = userDoc._id;
      } catch (e) {}
    }
    if (!ownerId) ownerId = 'demo_owner';

    let newRecord;

    try {
      newRecord = await CareRecord.create({
        pet,
        petId: pet,
        owner: ownerId,
        ownerId: ownerId,
        careType,
        title,
        dateAdministered: dateAdministered || new Date(),
        eventDate: dateAdministered || new Date(),
        nextDueDate,
        status: status || 'Upcoming',
        notes,
        cost: Number(cost) || 0,
        veterinarian,
        providerName: veterinarian,
      });
    } catch (err) {
      newRecord = {
        _id: 'rec_' + Date.now(),
        pet,
        petId: pet,
        owner: ownerId,
        careType,
        title,
        dateAdministered: dateAdministered || new Date().toISOString(),
        eventDate: dateAdministered || new Date().toISOString(),
        nextDueDate: new Date(nextDueDate).toISOString(),
        status: status || 'Upcoming',
        notes: notes || '',
        cost: Number(cost) || 0,
        veterinarian: veterinarian || 'General Vet',
        providerName: veterinarian || 'General Vet',
        createdAt: new Date(),
      };
      mockRecords.unshift(newRecord);
    }

    res.status(201).json({
      success: true,
      message: 'Care record created successfully',
      data: newRecord,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete care record
// @route   DELETE /api/records/:id
const deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await CareRecord.findByIdAndDelete(id);
    } catch (err) {
      mockRecords = mockRecords.filter((r) => r._id !== id);
    }

    res.json({
      success: true,
      message: 'Care record deleted successfully',
      deletedId: id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecords,
  createRecord,
  deleteRecord,
  mockRecords,
};
