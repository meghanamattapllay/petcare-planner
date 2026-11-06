const mongoose = require('mongoose');
const Pet = require('../models/Pet');
const CareRecord = require('../models/CareRecord');
const User = require('../models/User');

let mockPets = [
  {
    _id: 'pet_01',
    name: 'Milo',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'Male',
    weight: 28,
    allergies: ['Peanut Butter', 'Certain Grasses'],
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    owner: '6ae430b988ce6d453a371b77',
    createdAt: new Date(),
  },
  {
    _id: 'pet_02',
    name: 'Luna',
    species: 'Cat',
    breed: 'Siamese',
    age: 2,
    gender: 'Female',
    weight: 4.5,
    allergies: ['Lactose'],
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    owner: '6ae430b988ce6d453a371b77',
    createdAt: new Date(),
  },
];

const resolveOwnerId = async (req) => {
  if (req.user && (req.user.id || req.user._id)) {
    return req.user.id || req.user._id;
  }
  if (req.body && (req.body.owner || req.body.ownerId)) {
    return req.body.owner || req.body.ownerId;
  }
  try {
    const existingUser = await User.findOne();
    if (existingUser) {
      return existingUser._id;
    }
  } catch (err) {

  }
  return new mongoose.Types.ObjectId();
};

const getPets = async (req, res, next) => {
  try {
    const ownerId = req.user ? (req.user.id || req.user._id) : null;
    let filter = {};

    if (ownerId) {
      filter.$or = [{ owner: ownerId }, { ownerId: ownerId }];
    }

    try {
      const pets = await Pet.find(filter)
        .populate('owner', 'name email')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: pets.length,
        data: pets,
      });
    } catch (dbErr) {
      console.warn('[PetController] DB lookup error, falling back to mock data:', dbErr.message);
      let filteredMock = mockPets;
      if (ownerId) {
        filteredMock = mockPets.filter((p) => String(p.owner) === String(ownerId));
      }

      return res.status(200).json({
        success: true,
        count: filteredMock.length,
        data: filteredMock,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getPetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let pet = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      try {
        pet = await Pet.findById(id).populate('owner', 'name email');
      } catch (dbErr) {
        console.warn('[PetController] DB read error:', dbErr.message);
      }
    }

    if (!pet) {
      pet = mockPets.find((p) => String(p._id) === String(id));
    }

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: `Pet profile not found with id: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

const createPet = async (req, res, next) => {
  try {
    const { name, species, breed, age, gender, weight, allergies, photoUrl } = req.body;

    if (!name || !String(name).trim() || !species || !String(species).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error: Both name and species are mandatory fields',
      });
    }

    if (age !== undefined && age !== null && age !== '' && Number(age) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation error: Age cannot be a negative value',
      });
    }

    if (gender && !['Male', 'Female', 'Unknown'].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: 'Validation error: Gender must be Male, Female, or Unknown',
      });
    }

    const ownerId = await resolveOwnerId(req);

    const petPayload = {
      name: name.trim(),
      species: species.trim(),
      breed: breed ? breed.trim() : 'Unknown',
      age: age !== undefined && age !== '' && !isNaN(Number(age)) ? Number(age) : 1,
      gender: gender || 'Unknown',
      weight: weight !== undefined && weight !== '' && !isNaN(Number(weight)) ? Number(weight) : undefined,
      allergies: Array.isArray(allergies)
        ? allergies
        : typeof allergies === 'string' && allergies.length > 0
        ? allergies.split(',').map((s) => s.trim())
        : [],
      photoUrl: photoUrl ? String(photoUrl).trim() : '',
      owner: ownerId,
    };

    try {
      const newPet = await Pet.create(petPayload);
      const populated = await Pet.findById(newPet._id).populate('owner', 'name email');

      return res.status(201).json({
        success: true,
        message: 'Pet profile created successfully',
        data: populated || newPet,
      });
    } catch (dbErr) {
      console.warn('[PetController] DB create failed, saving to mockPets:', dbErr.message);
      const fallbackPet = {
        _id: 'pet_' + Date.now(),
        ...petPayload,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPets.unshift(fallbackPet);

      return res.status(201).json({
        success: true,
        message: 'Pet profile created successfully (Fallback Mode)',
        data: fallbackPet,
      });
    }
  } catch (error) {
    next(error);
  }
};

const updatePet = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updated = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      try {
        updated = await Pet.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        }).populate('owner', 'name email');
      } catch (dbErr) {
        console.warn('[PetController] DB update error:', dbErr.message);
      }
    }

    if (!updated) {
      const idx = mockPets.findIndex((p) => String(p._id) === String(id));
      if (idx !== -1) {
        mockPets[idx] = {
          ...mockPets[idx],
          ...req.body,
          updatedAt: new Date(),
        };
        updated = mockPets[idx];
      }
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Pet profile not found for updating with id: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Pet profile updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deletePet = async (req, res, next) => {
  try {
    const { id } = req.params;
    let foundAndDeleted = false;

    if (mongoose.Types.ObjectId.isValid(id)) {
      try {
        const deletedDoc = await Pet.findByIdAndDelete(id);
        if (deletedDoc) {
          foundAndDeleted = true;

          await CareRecord.deleteMany({
            $or: [{ pet: id }, { petId: id }],
          });
        }
      } catch (dbErr) {
        console.warn('[PetController] DB delete error:', dbErr.message);
      }
    }

    if (!foundAndDeleted) {
      const initialLength = mockPets.length;
      mockPets = mockPets.filter((p) => String(p._id) !== String(id));
      if (mockPets.length < initialLength) {
        foundAndDeleted = true;
      }
    }

    if (!foundAndDeleted) {
      return res.status(404).json({
        success: false,
        message: `Pet profile not found with id: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Pet profile and associated care records deleted successfully',
      deletedId: id,
    });
  } catch (error) {
    next(error);
  }
};

const getPetCareRecords = async (req, res, next) => {
  try {
    const { id } = req.params;
    let records = [];

    if (mongoose.connection.readyState === 1) {
      try {
        const query = { $or: [{ petId: id }, { pet: id }] };
        if (mongoose.Types.ObjectId.isValid(id)) {
          const objId = new mongoose.Types.ObjectId(id);
          query.$or.push({ petId: objId }, { pet: objId });
        }
        records = await CareRecord.find(query).sort({ eventDate: -1, dateAdministered: -1 });
      } catch (err) {
        console.warn('[getPetCareRecords] DB error:', err.message);
      }
    }

    const { mockRecords } = require('./recordController');
    const combined = [...records.map((r) => (r.toObject ? r.toObject() : r))];
    if (Array.isArray(mockRecords)) {
      mockRecords.forEach((m) => {
        const targetId = m.petId?._id || m.petId || m.pet?._id || m.pet;
        if (String(targetId) === String(id)) {
          if (!combined.some((c) => String(c._id) === String(m._id))) {
            combined.push(m);
          }
        }
      });
    }

    combined.sort((a, b) => new Date(b.eventDate || b.dateAdministered || b.createdAt) - new Date(a.eventDate || a.dateAdministered || a.createdAt));

    return res.status(200).json(combined);
  } catch (error) {
    next(error);
  }
};

const createPetCareRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { careType, title, eventDate, dateAdministered, nextDueDate, notes, providerName, cost } = req.body;

    if (!careType || !title) {
      return res.status(400).json({ message: 'Care type and title are required.' });
    }

    const ownerId = req.user ? (req.user.id || req.user._id) : 'demo_owner';
    const petObj = (mockPets || []).find((p) => String(p._id) === String(id));
    const petMeta = petObj ? { _id: petObj._id, name: petObj.name, species: petObj.species } : { _id: id, name: 'Pet' };

    let record;
    if (mongoose.connection.readyState === 1) {
      try {
        record = await CareRecord.create({
          petId: id,
          pet: id,
          ownerId,
          owner: ownerId,
          careType,
          title,
          eventDate: eventDate || dateAdministered || new Date(),
          dateAdministered: dateAdministered || eventDate || new Date(),
          nextDueDate: nextDueDate ? new Date(nextDueDate) : undefined,
          status: nextDueDate && new Date(nextDueDate) < new Date() ? 'overdue' : 'upcoming',
          notes: notes || '',
          providerName: providerName || '',
          cost: Number(cost) || 0,
        });
      } catch (err) {
        console.warn('[createPetCareRecord] DB create failed:', err.message);
      }
    }

    if (!record) {
      record = {
        _id: 'rec_' + Date.now(),
        petId: petMeta,
        pet: petMeta,
        ownerId,
        careType,
        title,
        eventDate: eventDate || new Date().toISOString(),
        dateAdministered: dateAdministered || eventDate || new Date().toISOString(),
        nextDueDate: nextDueDate ? new Date(nextDueDate).toISOString() : null,
        status: nextDueDate && new Date(nextDueDate) < new Date() ? 'overdue' : 'upcoming',
        notes: notes || '',
        providerName: providerName || '',
        cost: Number(cost) || 0,
        createdAt: new Date().toISOString(),
      };
    } else {
      if (record.toObject) record = record.toObject();
      record.petId = petMeta;
      record.pet = petMeta;
    }

    const { addMockRecord } = require('./recordController');
    if (typeof addMockRecord === 'function') {
      addMockRecord(record);
    }

    return res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  mockPets,
  getPetCareRecords,
  createPetCareRecord,
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
};

