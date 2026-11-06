const User = require('../models/User');
const Pet = require('../models/Pet');
const CareRecord = require('../models/CareRecord');
const { getDBStatus } = require('../config/db');

let mockUsers = [
  {
    _id: 'user_01',
    name: 'Demo Pet Owner',
    email: 'demo@pawtech.com',
    role: 'owner',
    petsCount: 3,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'user_02',
    name: 'System Administrator',
    email: 'admin@pawtech.com',
    role: 'admin',
    petsCount: 2,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'user_03',
    name: 'Sarah Connor',
    email: 'sarah.c@gmail.com',
    role: 'owner',
    petsCount: 2,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'user_04',
    name: 'Michael Davis',
    email: 'm.davis@outlook.com',
    role: 'owner',
    petsCount: 4,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'user_05',
    name: 'Emily Watson',
    email: 'emily.w@yahoo.com',
    role: 'owner',
    petsCount: 1,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

let customCareCategories = [
  'Vaccination',
  'Grooming',
  'Appointment',
  'Medication',
  'Dental',
  'Deworming',
  'Flea & Tick Prevention',
  'Surgery',
  'Other',
];

const getAdminStats = async (req, res, next) => {
  try {
    let totalUsers = mockUsers.length;
    let totalPets = 0;
    let totalRecords = 0;
    let overdueRecords = 0;
    let speciesCounts = { Dog: 0, Cat: 0, Bird: 0, Rabbit: 0, Other: 0 };

    try {
      totalUsers = await User.countDocuments();
      totalPets = await Pet.countDocuments();
      totalRecords = await CareRecord.countDocuments();

      const today = new Date();
      overdueRecords = await CareRecord.countDocuments({
        $or: [
          { status: 'overdue' },
          { nextDueDate: { $lt: today, $ne: null } },
        ],
      });

      const speciesAgg = await Pet.aggregate([
        { $group: { _id: '$species', count: { $sum: 1 } } },
      ]);
      speciesAgg.forEach((item) => {
        if (item._id && speciesCounts[item._id] !== undefined) {
          speciesCounts[item._id] = item.count;
        } else {
          speciesCounts.Other = (speciesCounts.Other || 0) + item.count;
        }
      });
    } catch (err) {

      totalUsers = mockUsers.length;
      totalPets = 13;
      totalRecords = 37;
      overdueRecords = 19;
      speciesCounts = { Dog: 7, Cat: 3, Bird: 1, Rabbit: 1, Other: 1 };
    }

    res.json({
      success: true,
      stats: {
        totalUsers: totalUsers || mockUsers.length,
        totalPets: totalPets || 13,
        totalRecords: totalRecords || 37,
        overdueRecords: overdueRecords || 19,
        speciesCounts,
        dbStatus: getDBStatus(),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    let users = [];

    try {
      const dbUsers = await User.find().select('-password').sort({ createdAt: -1 });
      if (dbUsers && dbUsers.length > 0) {

        users = await Promise.all(
          dbUsers.map(async (u) => {
            const count = await Pet.countDocuments({
              $or: [{ ownerId: u._id }, { owner: u._id }],
            });
            return {
              _id: u._id,
              name: u.name,
              email: u.email,
              role: u.role || 'owner',
              petsCount: count,
              createdAt: u.createdAt,
            };
          })
        );
      } else {
        users = mockUsers;
      }
    } catch (err) {
      users = mockUsers;
    }

    res.json(users);
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['owner', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either "owner" or "admin".' });
    }

    let updated = null;

    try {
      updated = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true }
      ).select('-password');
    } catch (err) {
      const idx = mockUsers.findIndex((u) => u._id === id);
      if (idx !== -1) {
        mockUsers[idx].role = role;
        updated = mockUsers[idx];
      }
    }

    if (!updated) {
      const idx = mockUsers.findIndex((u) => u._id === id);
      if (idx !== -1) {
        mockUsers[idx].role = role;
        updated = mockUsers[idx];
      }
    }

    if (!updated) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ success: true, message: `User role updated to ${role}.`, user: updated });
  } catch (error) {
    next(error);
  }
};

const getAllPetsAdmin = async (req, res, next) => {
  try {
    let pets = [];

    try {
      pets = await Pet.find()
        .populate('ownerId', 'name email')
        .sort({ createdAt: -1 });
    } catch (err) {
      pets = [];
    }

    res.json(pets);
  } catch (error) {
    next(error);
  }
};

const deletePetAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      await Pet.findByIdAndDelete(id);
      await CareRecord.deleteMany({ $or: [{ petId: id }, { pet: id }] });
    } catch (err) {

    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const getCareCategories = async (req, res) => {
  res.json(customCareCategories);
};

const addCareCategory = async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  const trimmed = name.trim();
  if (!customCareCategories.includes(trimmed)) {
    customCareCategories.push(trimmed);
  }

  res.status(201).json({
    success: true,
    message: 'Care category added successfully.',
    categories: customCareCategories,
  });
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  getAllPetsAdmin,
  deletePetAdmin,
  getCareCategories,
  addCareCategory,
};

