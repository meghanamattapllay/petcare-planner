const CareRecord = require('../models/CareRecord');
const Pet = require('../models/Pet');

/**
 * Controller: Care Record CRUD & Timeline
 * Assigned Member: BODASU NITHIN (Backend: Database & APIs)
 * Timeline Integration: MATAPALLY MEGHANA (Reminders & Timeline)
 * Integrated by: Godishala Kruthik Roshan
 */

let mockRecords = [
  {
    _id: 'rec_01',
    petId: { _id: 'pet_01', name: 'Milo', species: 'Dog' },
    pet: { _id: 'pet_01', name: 'Milo', species: 'Dog' },
    careType: 'Vaccination',
    title: 'Rabies Annual Booster',
    eventDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    dateAdministered: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    notes: 'Administered 1ml subcutaneous. Healthy response.',
    cost: 45,
    providerName: 'Dr. Sarah Jenkins',
    veterinarian: 'Dr. Sarah Jenkins',
  },
  {
    _id: 'rec_02',
    petId: { _id: 'pet_01', name: 'Milo', species: 'Dog' },
    pet: { _id: 'pet_01', name: 'Milo', species: 'Dog' },
    careType: 'Grooming',
    title: 'Full Coat De-shedding & Bath',
    eventDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    dateAdministered: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    notes: 'Coat shampoo and nail trimming.',
    cost: 60,
    providerName: 'Happy Paws Salon',
    veterinarian: 'Happy Paws Salon',
  },
  {
    _id: 'rec_03',
    petId: { _id: 'pet_02', name: 'Luna', species: 'Cat' },
    pet: { _id: 'pet_02', name: 'Luna', species: 'Cat' },
    careType: 'Medication',
    title: 'Flea & Tick Prevention Pipette',
    eventDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    dateAdministered: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'overdue',
    notes: 'Monthly topical dose required.',
    cost: 25,
    providerName: 'Dr. Patel',
    veterinarian: 'Dr. Patel',
  },
];

// @desc    Get upcoming & overdue care records
// @route   GET /api/care-records/upcoming
const getUpcomingCareRecords = async (req, res, next) => {
  try {
    const ownerId = req.user ? req.user.id : null;
    let records = [];

    try {
      const query = { nextDueDate: { $exists: true, $ne: null } };
      if (ownerId) {
        query.$or = [{ ownerId }, { owner: ownerId }];
      }

      records = await CareRecord.find(query)
        .populate('petId', 'name species')
        .populate('pet', 'name species')
        .sort({ nextDueDate: 1 });

      records = records.map((r) => {
        const obj = r.toObject ? r.toObject() : r;
        const due = new Date(obj.nextDueDate);
        const isOverdue = due < new Date();
        return {
          ...obj,
          status: isOverdue ? 'overdue' : 'upcoming',
          petId: obj.petId || obj.pet,
        };
      });
    } catch (err) {
      records = mockRecords;
    }

    if (!records || records.length === 0) {
      records = mockRecords;
    }

    res.json(records);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all care records (with optional filter by petId, careType, status)
// @route   GET /api/records or /api/care-records
const getRecords = async (req, res, next) => {
  try {
    const { petId, careType, status } = req.query;
    let records = [];

    try {
      const query = {};
      if (petId) query.$or = [{ petId }, { pet: petId }];
      if (careType) query.careType = careType;
      if (status) query.status = status;
      records = await CareRecord.find(query)
        .populate('petId', 'name species')
        .populate('pet', 'name species');
    } catch (err) {
      records = mockRecords;
    }

    if (!records || records.length === 0) {
      records = mockRecords;
    }

    res.json(records);
  } catch (error) {
    next(error);
  }
};

// @desc    Create care record
// @route   POST /api/records or /api/care-records
const createRecord = async (req, res, next) => {
  try {
    const { pet, petId, careType, title, eventDate, dateAdministered, nextDueDate, status, notes, cost, veterinarian, providerName } = req.body;

    const targetPet = petId || pet;
    if (!targetPet || !careType || !title) {
      return res.status(400).json({
        message: 'Please provide required fields: petId/pet, careType, and title',
      });
    }

    const ownerId = req.user ? req.user.id : 'demo_owner';
    let newRecord;

    try {
      newRecord = await CareRecord.create({
        petId: targetPet,
        pet: targetPet,
        ownerId,
        owner: ownerId,
        careType,
        title,
        eventDate: eventDate || dateAdministered || new Date(),
        dateAdministered: dateAdministered || eventDate || new Date(),
        nextDueDate,
        status: status || (nextDueDate && new Date(nextDueDate) < new Date() ? 'overdue' : 'upcoming'),
        notes: notes || '',
        cost: Number(cost) || 0,
        providerName: providerName || veterinarian || '',
        veterinarian: veterinarian || providerName || '',
      });
    } catch (err) {
      newRecord = {
        _id: 'rec_' + Date.now(),
        petId: targetPet,
        pet: targetPet,
        ownerId,
        careType,
        title,
        eventDate: eventDate || new Date().toISOString(),
        nextDueDate: nextDueDate ? new Date(nextDueDate).toISOString() : null,
        status: status || 'upcoming',
        notes: notes || '',
        cost: Number(cost) || 0,
        providerName: providerName || veterinarian || '',
        createdAt: new Date(),
      };
      mockRecords.unshift(newRecord);
    }

    res.status(201).json(newRecord);
  } catch (error) {
    next(error);
  }
};

// @desc    Update care record
// @route   PATCH /api/care-records/:id or PUT /api/records/:id
const updateRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updated;

    try {
      updated = await CareRecord.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    } catch (err) {
      const idx = mockRecords.findIndex((r) => r._id === id);
      if (idx !== -1) {
        mockRecords[idx] = { ...mockRecords[idx], ...req.body };
        updated = mockRecords[idx];
      }
    }

    if (!updated) {
      return res.status(404).json({ message: 'Care record not found.' });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete care record
// @route   DELETE /api/records/:id or /api/care-records/:id
const deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await CareRecord.findByIdAndDelete(id);
    } catch (err) {
      mockRecords = mockRecords.filter((r) => r._id !== id);
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUpcomingCareRecords,
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
};
