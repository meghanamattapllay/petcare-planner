const mongoose = require('mongoose');
const CareRecord = require('../models/CareRecord');
const Pet = require('../models/Pet');
const User = require('../models/User');

/**
 * Controller: Care Record CRUD & Timeline Integration
 * Assigned Member: BODASU NITHIN (Backend: Database & APIs)
 * Roll Number: 2303A51803 · Branch: CSE
 * Timeline Integration: MATAPALLY MEGHANA (Reminders & Timeline)
 * Integrated by: Godishala Kruthik Roshan
 */

const VALID_CARE_TYPES = [
  'Vaccination',
  'Medication',
  'Grooming',
  'Vet Visit',
  'Deworming',
  'Nutrition',
  'Other',
];

const VALID_STATUSES = ['Completed', 'Upcoming', 'Overdue'];

// Fallback in-memory store for integration when DB is unavailable
let mockRecords = [
  {
    _id: 'rec_01',
    pet: 'pet_01',
    owner: '6ae430b988ce6d453a371b77',
    careType: 'Vaccination',
    title: 'Rabies Annual Booster',
    dateAdministered: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Completed',
    notes: 'Administered 1ml subcutaneous. No immediate reaction observed.',
    cost: 45,
    veterinarian: 'Dr. Sarah Jenkins',
    createdAt: new Date(),
  },
  {
    _id: 'rec_02',
    pet: 'pet_01',
    owner: '6ae430b988ce6d453a371b77',
    careType: 'Grooming',
    title: 'Full Coat De-shedding & Bath',
    dateAdministered: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Upcoming',
    notes: 'Coat shampoo and nail trimming.',
    cost: 60,
    veterinarian: 'Happy Paws Salon',
    createdAt: new Date(),
  },
  {
    _id: 'rec_03',
    pet: 'pet_02',
    owner: '6ae430b988ce6d453a371b77',
    careType: 'Medication',
    title: 'Flea & Tick Prevention Pipette',
    dateAdministered: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Overdue',
    notes: 'Monthly topical dose required.',
    cost: 25,
    veterinarian: 'Dr. Patel',
    createdAt: new Date(),
  },
];

// Helper to resolve an owner ObjectId for care records
const resolveOwnerForRecord = async (req, petId) => {
  if (req.user && (req.user.id || req.user._id)) {
    return req.user.id || req.user._id;
  }
  if (req.body && (req.body.owner || req.body.ownerId)) {
    return req.body.owner || req.body.ownerId;
  }
  // Try inheriting from the associated pet
  if (petId && mongoose.Types.ObjectId.isValid(petId)) {
    try {
      const associatedPet = await Pet.findById(petId);
      if (associatedPet && associatedPet.owner) {
        return associatedPet.owner;
      }
    } catch (err) {
      // Pet lookup skipped
    }
  }
  // Fallback to any registered user in the database
  try {
    const existingUser = await User.findOne();
    if (existingUser) {
      return existingUser._id;
    }
  } catch (err) {
    // Database lookup not available
  }
  return new mongoose.Types.ObjectId();
};

// @desc    Get all care records (supports filters: petId, careType, status)
// @route   GET /api/records
// @access  Public / Private
const getRecords = async (req, res, next) => {
  try {
    const { petId, careType, status } = req.query;
    const query = {};

    if (petId) {
      query.$or = [{ pet: petId }, { petId: petId }];
    }
    if (careType) {
      query.careType = new RegExp(`^${careType}$`, 'i');
    }
    if (status) {
      query.status = new RegExp(`^${status}$`, 'i');
    }

    try {
      const records = await CareRecord.find(query)
        .populate('pet', 'name species photoUrl')
        .populate('owner', 'name email')
        .sort({ nextDueDate: 1 });

      return res.status(200).json({
        success: true,
        count: records.length,
        data: records,
      });
    } catch (dbErr) {
      console.warn('[RecordController] DB find error, using mock data:', dbErr.message);
      let filtered = [...mockRecords];

      if (petId) {
        filtered = filtered.filter(
          (r) => String(r.pet) === String(petId) || (r.pet && String(r.pet._id) === String(petId))
        );
      }
      if (careType) {
        filtered = filtered.filter(
          (r) => r.careType && r.careType.toLowerCase() === careType.toLowerCase()
        );
      }
      if (status) {
        filtered = filtered.filter(
          (r) => r.status && r.status.toLowerCase() === status.toLowerCase()
        );
      }

      return res.status(200).json({
        success: true,
        count: filtered.length,
        data: filtered,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single care record by ID
// @route   GET /api/records/:id
// @access  Public / Private
const getRecordById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let record = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      try {
        record = await CareRecord.findById(id)
          .populate('pet', 'name species photoUrl')
          .populate('owner', 'name email');
      } catch (dbErr) {
        console.warn('[RecordController] DB fetch error:', dbErr.message);
      }
    }

    if (!record) {
      record = mockRecords.find((r) => String(r._id) === String(id));
    }

    if (!record) {
      return res.status(404).json({
        success: false,
        message: `Care record not found with id: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new care record
// @route   POST /api/records
// @access  Public / Private
const createRecord = async (req, res, next) => {
  try {
    const {
      pet,
      petId,
      careType,
      title,
      dateAdministered,
      nextDueDate,
      status,
      notes,
      cost,
      veterinarian,
    } = req.body;

    const targetPetId = pet || petId;

    // Enforce required fields
    if (!targetPetId || !careType || !title || !nextDueDate) {
      return res.status(400).json({
        success: false,
        message:
          'Validation error: pet, careType, title, and nextDueDate are mandatory fields',
      });
    }

    // Validate careType enum
    const matchedType = VALID_CARE_TYPES.find(
      (t) => t.toLowerCase() === String(careType).trim().toLowerCase()
    );
    if (!matchedType) {
      return res.status(400).json({
        success: false,
        message: `Validation error: Invalid careType. Must be one of: ${VALID_CARE_TYPES.join(', ')}`,
      });
    }

    // Validate status enum if provided
    let normalizedStatus = 'Upcoming';
    if (status) {
      const matchedStatus = VALID_STATUSES.find(
        (s) => s.toLowerCase() === String(status).trim().toLowerCase()
      );
      if (!matchedStatus) {
        return res.status(400).json({
          success: false,
          message: `Validation error: Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        });
      }
      normalizedStatus = matchedStatus;
    }

    // Validate cost if provided
    if (cost !== undefined && cost !== null && cost !== '' && Number(cost) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation error: Cost cannot be a negative value',
      });
    }

    const ownerId = await resolveOwnerForRecord(req, targetPetId);

    const recordPayload = {
      pet: targetPetId,
      owner: ownerId,
      careType: matchedType,
      title: String(title).trim(),
      dateAdministered: dateAdministered ? new Date(dateAdministered) : new Date(),
      nextDueDate: new Date(nextDueDate),
      status: normalizedStatus,
      notes: notes ? String(notes).trim() : '',
      cost: cost !== undefined && cost !== '' && !isNaN(Number(cost)) ? Number(cost) : 0,
      veterinarian: veterinarian ? String(veterinarian).trim() : '',
    };

    try {
      const newRecord = await CareRecord.create(recordPayload);
      const populated = await CareRecord.findById(newRecord._id)
        .populate('pet', 'name species photoUrl')
        .populate('owner', 'name email');

      return res.status(201).json({
        success: true,
        message: 'Care record created successfully',
        data: populated || newRecord,
      });
    } catch (dbErr) {
      console.warn('[RecordController] DB create error, saving to mockRecords:', dbErr.message);
      const fallbackRecord = {
        _id: 'rec_' + Date.now(),
        ...recordPayload,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRecords.unshift(fallbackRecord);

      return res.status(201).json({
        success: true,
        message: 'Care record created successfully (Fallback Mode)',
        data: fallbackRecord,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing care record
// @route   PUT /api/records/:id
// @access  Public / Private
const updateRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updated = null;

    if (req.body.careType) {
      const matchedType = VALID_CARE_TYPES.find(
        (t) => t.toLowerCase() === String(req.body.careType).trim().toLowerCase()
      );
      if (!matchedType) {
        return res.status(400).json({
          success: false,
          message: `Validation error: Invalid careType. Must be one of: ${VALID_CARE_TYPES.join(', ')}`,
        });
      }
      req.body.careType = matchedType;
    }

    if (req.body.status) {
      const matchedStatus = VALID_STATUSES.find(
        (s) => s.toLowerCase() === String(req.body.status).trim().toLowerCase()
      );
      if (!matchedStatus) {
        return res.status(400).json({
          success: false,
          message: `Validation error: Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        });
      }
      req.body.status = matchedStatus;
    }

    if (req.body.cost !== undefined && req.body.cost !== null && Number(req.body.cost) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation error: Cost cannot be a negative value',
      });
    }

    if (mongoose.Types.ObjectId.isValid(id)) {
      try {
        updated = await CareRecord.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        })
          .populate('pet', 'name species photoUrl')
          .populate('owner', 'name email');
      } catch (dbErr) {
        console.warn('[RecordController] DB update error:', dbErr.message);
      }
    }

    if (!updated) {
      const idx = mockRecords.findIndex((r) => String(r._id) === String(id));
      if (idx !== -1) {
        mockRecords[idx] = {
          ...mockRecords[idx],
          ...req.body,
          updatedAt: new Date(),
        };
        updated = mockRecords[idx];
      }
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Care record not found for updating with id: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Care record updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a care record by ID
// @route   DELETE /api/records/:id
// @access  Public / Private
const deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    let foundAndDeleted = false;

    if (mongoose.Types.ObjectId.isValid(id)) {
      try {
        const deletedDoc = await CareRecord.findByIdAndDelete(id);
        if (deletedDoc) {
          foundAndDeleted = true;
        }
      } catch (dbErr) {
        console.warn('[RecordController] DB delete error:', dbErr.message);
      }
    }

    if (!foundAndDeleted) {
      const initialLength = mockRecords.length;
      mockRecords = mockRecords.filter((r) => String(r._id) !== String(id));
      if (mockRecords.length < initialLength) {
        foundAndDeleted = true;
      }
    }

    if (!foundAndDeleted) {
      return res.status(404).json({
        success: false,
        message: `Care record not found with id: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Care record deleted successfully',
      deletedId: id,
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get upcoming care records
// @route   GET /api/care-records/upcoming or /api/records/upcoming
const getUpcomingCareRecords = async (req, res, next) => {
  try {
    const user = req.user;
    let records = [];

    if (mongoose.connection.readyState === 1) {
      try {
        const query = { nextDueDate: { $exists: true, $ne: null } };
        // If not admin, only fetch records belonging to this user or their pets
        if (user && user.role !== 'admin') {
          const ownerId = user.id || user._id;
          const userPets = await Pet.find({ $or: [{ owner: ownerId }, { ownerId: ownerId }] }).select('_id');
          const petIds = userPets.map((p) => p._id);
          query.$or = [
            { owner: ownerId },
            { ownerId: ownerId },
            { pet: { $in: petIds } },
            { petId: { $in: petIds } },
          ];
        }

        records = await CareRecord.find(query)
          .populate('pet', 'name species photoUrl')
          .populate('petId', 'name species photoUrl')
          .sort({ nextDueDate: 1 });
      } catch (dbErr) {
        console.warn('[getUpcomingCareRecords] DB error:', dbErr.message);
      }
    }

    // Only inject mock records if in local fallback / offline demo mode and user is admin or no DB
    const isDBConnected = mongoose.connection.readyState === 1;
    const combined = [...records.map((r) => (r.toObject ? r.toObject() : r))];
    
    if (!isDBConnected && Array.isArray(mockRecords)) {
      mockRecords.forEach((m) => {
        if (!combined.some((c) => String(c._id) === String(m._id))) {
          combined.push(m);
        }
      });
    }

    const formatted = combined
      .filter((r) => r.nextDueDate)
      .map((r) => {
        const due = new Date(r.nextDueDate);
        const isOverdue = due < new Date();
        return {
          ...r,
          status: isOverdue ? 'overdue' : 'upcoming',
          petId: r.petId || r.pet,
        };
      })
      .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));

    return res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};

const addMockRecord = (record) => {
  if (!record || !record._id) return;
  const existingIdx = mockRecords.findIndex((r) => String(r._id) === String(record._id));
  if (existingIdx !== -1) {
    mockRecords[existingIdx] = { ...mockRecords[existingIdx], ...record };
  } else {
    mockRecords.unshift(record);
  }
};

module.exports = {
  mockRecords,
  addMockRecord,
  getUpcomingCareRecords,
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
};
