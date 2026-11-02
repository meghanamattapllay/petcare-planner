const CareRecord = require('../models/CareRecord');
const Pet = require('../models/Pet');

/**
 * Controller: Reminders & Timeline Status
 * Assigned Member: MATAPALLY MEGHANA (Reminders & Timeline)
 * Roll Number: 2303A52505 · Branch: CSE (AIML)
 * Integrated by: Godishala Kruthik Roshan
 */

/**
 * Helper: Calculate day difference and categorization status
 * @param {Date|string} nextDueDate
 * @returns {{ diffDays: number, status: 'Overdue'|'Due Today'|'Upcoming' }}
 */
const calculateDueStatus = (nextDueDate) => {
  const now = new Date();
  const due = new Date(nextDueDate);

  // Normalize to calendar day boundary for accurate day count
  const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDateOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  const diffMs = dueDateOnly.getTime() - nowDateOnly.getTime();
  let diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === -0) diffDays = 0;

  let status = 'Upcoming';
  if (diffDays < 0) {
    status = 'Overdue';
  } else if (diffDays === 0) {
    status = 'Due Today';
  }

  return { diffDays, status };
};

// Fallback mock records for testing or disconnected DB
const mockRemindersData = [
  {
    _id: 'rec_01',
    pet: { _id: 'pet_01', name: 'Milo', species: 'Dog', breed: 'Golden Retriever', photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400' },
    careType: 'Vaccination',
    title: 'Rabies Annual Booster',
    dateAdministered: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Administered 1ml subcutaneous.',
    veterinarian: 'Dr. Sarah Jenkins',
    cost: 45,
  },
  {
    _id: 'rec_02',
    pet: { _id: 'pet_01', name: 'Milo', species: 'Dog', breed: 'Golden Retriever', photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400' },
    careType: 'Grooming',
    title: 'Full Coat De-shedding & Bath',
    dateAdministered: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Bath & brush.',
    veterinarian: 'Happy Paws Salon',
    cost: 60,
  },
  {
    _id: 'rec_03',
    pet: { _id: 'pet_02', name: 'Luna', species: 'Cat', breed: 'Siamese', photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400' },
    careType: 'Medication',
    title: 'Flea & Tick Prevention Pipette',
    dateAdministered: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Overdue monthly application.',
    veterinarian: 'Dr. Patel',
    cost: 25,
  },
  {
    _id: 'rec_04',
    pet: { _id: 'pet_02', name: 'Luna', species: 'Cat', breed: 'Siamese', photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400' },
    careType: 'Vet Visit',
    title: 'Bi-annual Wellness Checkup',
    dateAdministered: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    nextDueDate: new Date().toISOString(),
    notes: 'Check dental health and weight.',
    veterinarian: 'Dr. Patel',
    cost: 50,
  },
];

// @desc    Get categorized reminders (Upcoming, Due Today, Overdue) with day calculations & filters
// @route   GET /api/reminders
// @access  Public / Authenticated
const getReminders = async (req, res, next) => {
  try {
    const { petId, careType, status: statusFilter, search } = req.query;

    let rawRecords = [];
    let petMap = new Map();

    try {
      const [records, pets] = await Promise.all([
        CareRecord.find().sort({ nextDueDate: 1 }).lean(),
        Pet.find().lean(),
      ]);

      pets.forEach((p) => petMap.set(String(p._id), p));
      rawRecords = records;
    } catch (dbErr) {
      // Graceful fallback for mock mode or disconnected database
      rawRecords = mockRemindersData;
      rawRecords.forEach((r) => {
        if (r.pet && r.pet._id) petMap.set(String(r.pet._id), r.pet);
      });
    }

    if (!rawRecords || rawRecords.length === 0) {
      rawRecords = mockRemindersData;
      rawRecords.forEach((r) => {
        if (r.pet && r.pet._id) petMap.set(String(r.pet._id), r.pet);
      });
    }

    // Process each record with date calculation engine
    let processed = rawRecords
      .filter((item) => item.nextDueDate) // must have a due date
      .map((item) => {
        const { diffDays, status: calculatedStatus } = calculateDueStatus(item.nextDueDate);

        const targetPetId = String(item.pet?._id || item.pet || item.petId || '');
        const petObj = (item.pet && typeof item.pet === 'object' && item.pet.name)
          ? item.pet
          : petMap.get(targetPetId);

        return {
          id: String(item._id || item.id),
          petId: targetPetId,
          petName: petObj ? petObj.name : 'Unknown Pet',
          species: petObj ? petObj.species : '',
          breed: petObj ? (petObj.breed || '') : '',
          photoUrl: petObj ? (petObj.photoUrl || '') : '',
          careType: item.careType,
          title: item.title,
          dateAdministered: item.dateAdministered || item.eventDate || null,
          nextDueDate: item.nextDueDate,
          daysDifference: diffDays,
          status: calculatedStatus,
          notes: item.notes || '',
          veterinarian: item.veterinarian || item.providerName || '',
          cost: Number(item.cost) || 0,
        };
      });

    // Apply optional server-side query filters if supplied
    if (petId) {
      processed = processed.filter(
        (r) => String(r.petId) === String(petId) || r.petName.toLowerCase() === petId.toLowerCase()
      );
    }

    if (careType) {
      processed = processed.filter(
        (r) => r.careType.toLowerCase() === careType.toLowerCase()
      );
    }

    if (statusFilter) {
      const sf = statusFilter.toUpperCase();
      if (sf === 'OVERDUE') {
        processed = processed.filter((r) => r.daysDifference < 0);
      } else if (sf === 'UPCOMING') {
        processed = processed.filter((r) => r.daysDifference >= 0);
      } else if (sf === 'TODAY' || sf === 'DUE TODAY') {
        processed = processed.filter((r) => r.daysDifference === 0);
      }
    }

    if (search) {
      const query = search.toLowerCase();
      processed = processed.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.petName.toLowerCase().includes(query) ||
          r.careType.toLowerCase().includes(query) ||
          r.notes.toLowerCase().includes(query) ||
          r.veterinarian.toLowerCase().includes(query)
      );
    }

    // Sort: overdue first (most pressing), then due today, then upcoming
    processed.sort((a, b) => a.daysDifference - b.daysDifference);

    const upcoming = processed.filter((r) => r.daysDifference >= 0);
    const overdue = processed.filter((r) => r.daysDifference < 0);
    const dueToday = processed.filter((r) => r.daysDifference === 0);

    res.status(200).json({
      success: true,
      summary: {
        total: processed.length,
        upcomingCount: upcoming.length,
        overdueCount: overdue.length,
        dueTodayCount: dueToday.length,
      },
      data: {
        all: processed,
        upcoming,
        overdue,
        dueToday,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get care history timeline and upcoming reminders for a specific pet
// @route   GET /api/reminders/pet/:petId
// @access  Public / Authenticated
const getPetTimeline = async (req, res, next) => {
  try {
    const { petId } = req.params;

    let pet = null;
    let records = [];

    try {
      pet = await Pet.findById(petId).lean();
      records = await CareRecord.find({
        $or: [{ pet: petId }, { petId: petId }],
      })
        .sort({ nextDueDate: 1 })
        .lean();
    } catch (err) {
      // Fallback to mock data matching petId or default pet
      records = mockRemindersData.filter(
        (r) => String(r.pet?._id) === String(petId) || r.pet?.name?.toLowerCase() === petId?.toLowerCase()
      );
      pet = records[0]?.pet || {
        _id: petId,
        name: 'Selected Pet',
        species: 'Dog',
        breed: 'Companion',
      };
    }

    if (!records || records.length === 0) {
      records = mockRemindersData.filter(
        (r) => String(r.pet?._id) === String(petId) || r.pet?.name?.toLowerCase() === petId?.toLowerCase()
      );
    }

    const processed = records.map((item) => {
      const { diffDays, status: calculatedStatus } = calculateDueStatus(item.nextDueDate);

      return {
        id: String(item._id || item.id),
        petId: String(petId),
        petName: pet ? pet.name : 'Pet',
        species: pet ? pet.species : '',
        careType: item.careType,
        title: item.title,
        dateAdministered: item.dateAdministered || item.eventDate || null,
        nextDueDate: item.nextDueDate,
        daysDifference: diffDays,
        status: calculatedStatus,
        notes: item.notes || '',
        veterinarian: item.veterinarian || item.providerName || '',
        cost: Number(item.cost) || 0,
      };
    });

    // Chronological timeline sorting
    processed.sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));

    const upcoming = processed.filter((r) => r.daysDifference >= 0);
    const overdue = processed.filter((r) => r.daysDifference < 0);
    const dueToday = processed.filter((r) => r.daysDifference === 0);

    res.status(200).json({
      success: true,
      pet: pet || { _id: petId, name: 'Pet' },
      summary: {
        total: processed.length,
        upcomingCount: upcoming.length,
        overdueCount: overdue.length,
        dueTodayCount: dueToday.length,
      },
      timeline: processed,
      upcoming,
      overdue,
      dueToday,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReminders,
  getPetTimeline,
  calculateDueStatus,
};
