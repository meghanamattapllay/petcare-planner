const Pet = require('../models/Pet');
const CareRecord = require('../models/CareRecord');

/**
 * Controller: Pet Profiles CRUD & Pet Care Records
 * Assigned Member: BODASU NITHIN (Backend: Database & APIs)
 * Roll: 2303A51803 · Branch: CSE
 * Integrated by: Godishala Kruthik Roshan
 */

let mockPets = [
  {
    _id: 'pet_01',
    name: 'Milo',
    species: 'Dog',
    breed: 'Golden Retriever',
    birthDate: '2023-04-12',
    age: 3,
    gender: 'Male',
    weight: 28,
    allergies: ['Peanut Butter', 'Certain Grasses'],
    notes: 'Loves tennis balls and running in the park.',
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    ownerId: 'demo_owner',
    createdAt: new Date(),
  },
  {
    _id: 'pet_02',
    name: 'Luna',
    species: 'Cat',
    breed: 'Siamese',
    birthDate: '2024-02-18',
    age: 2,
    gender: 'Female',
    weight: 4.5,
    allergies: ['Lactose'],
    notes: 'Prefers quiet corners and feather wands.',
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    ownerId: 'demo_owner',
    createdAt: new Date(),
  },
];

// @desc    Get all pets
// @route   GET /api/pets
const getPets = async (req, res, next) => {
  try {
    const ownerId = req.user ? req.user.id : null;
    let pets = [];

    try {
      if (ownerId) {
        pets = await Pet.find({
          $or: [{ ownerId }, { owner: ownerId }],
        }).sort({ createdAt: -1 });
      } else {
        pets = await Pet.find().sort({ createdAt: -1 });
      }
    } catch (err) {
      pets = mockPets;
    }

    if (!pets || pets.length === 0) {
      pets = mockPets;
    }

    // Return array directly for modern React clients
    res.json(pets);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single pet by ID
// @route   GET /api/pets/:id
const getPetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let pet = null;

    try {
      pet = await Pet.findById(id);
    } catch (err) {
      pet = mockPets.find((p) => p._id === id);
    }

    if (!pet) {
      pet = mockPets.find((p) => p._id === id);
    }

    if (!pet) {
      return res.status(404).json({ message: `Pet not found with id: ${id}` });
    }

    res.json(pet);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new pet
// @route   POST /api/pets
const createPet = async (req, res, next) => {
  try {
    const { name, species, breed, birthDate, age, gender, weight, allergies, notes, photoUrl } = req.body;

    if (!name || !species) {
      return res.status(400).json({ message: 'Name and species are mandatory fields.' });
    }

    const ownerId = req.user ? req.user.id : 'demo_owner';
    let newPet;

    try {
      newPet = await Pet.create({
        name: String(name).trim(),
        species,
        breed: String(breed || '').trim(),
        birthDate: birthDate || undefined,
        age: Number(age) || 1,
        gender: gender || 'Unknown',
        weight: Number(weight) || 5,
        allergies: Array.isArray(allergies) ? allergies : (allergies ? [allergies] : []),
        notes: String(notes || '').trim(),
        photoUrl: photoUrl || '',
        ownerId,
        owner: ownerId,
      });
    } catch (err) {
      newPet = {
        _id: 'pet_' + Date.now(),
        name,
        species,
        breed: breed || 'Mixed',
        birthDate: birthDate || new Date().toISOString(),
        age: Number(age) || 1,
        gender: gender || 'Unknown',
        weight: Number(weight) || 5,
        allergies: allergies || [],
        notes: notes || '',
        photoUrl: photoUrl || '',
        ownerId,
        owner: ownerId,
        createdAt: new Date(),
      };
      mockPets.unshift(newPet);
    }

    res.status(201).json(newPet);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing pet
// @route   PUT /api/pets/:id or PATCH /api/pets/:id
const updatePet = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updated;

    try {
      updated = await Pet.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    } catch (err) {
      const idx = mockPets.findIndex((p) => p._id === id);
      if (idx !== -1) {
        mockPets[idx] = { ...mockPets[idx], ...req.body };
        updated = mockPets[idx];
      }
    }

    if (!updated) {
      return res.status(404).json({ message: 'Pet profile not found for updating.' });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a pet
// @route   DELETE /api/pets/:id
const deletePet = async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      await Pet.findByIdAndDelete(id);
      await CareRecord.deleteMany({ $or: [{ petId: id }, { pet: id }] });
    } catch (err) {
      mockPets = mockPets.filter((p) => p._id !== id);
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

// @desc    Get care records for a specific pet
// @route   GET /api/pets/:id/care-records
const getPetCareRecords = async (req, res, next) => {
  try {
    const { id } = req.params;
    let records = [];

    try {
      records = await CareRecord.find({
        $or: [{ petId: id }, { pet: id }],
      }).sort({ eventDate: -1, dateAdministered: -1 });
    } catch (err) {
      records = [];
    }

    res.json(records);
  } catch (error) {
    next(error);
  }
};

// @desc    Create care record for a specific pet
// @route   POST /api/pets/:id/care-records
const createPetCareRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { careType, title, eventDate, nextDueDate, notes, providerName, cost } = req.body;

    if (!careType || !title) {
      return res.status(400).json({ message: 'Care type and title are required.' });
    }

    const ownerId = req.user ? req.user.id : 'demo_owner';
    let record;

    try {
      record = await CareRecord.create({
        petId: id,
        pet: id,
        ownerId,
        owner: ownerId,
        careType,
        title,
        eventDate: eventDate || new Date(),
        dateAdministered: eventDate || new Date(),
        nextDueDate: nextDueDate || undefined,
        notes: notes || '',
        providerName: providerName || '',
        cost: Number(cost) || 0,
      });
    } catch (err) {
      record = {
        _id: 'rec_' + Date.now(),
        petId: id,
        pet: id,
        ownerId,
        careType,
        title,
        eventDate: eventDate || new Date(),
        nextDueDate,
        notes,
        providerName,
        createdAt: new Date(),
      };
    }

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getPetCareRecords,
  createPetCareRecord,
};
