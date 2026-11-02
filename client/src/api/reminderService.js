import apiClient from './apiClient';

/**
 * Reminders API Service
 * Reminders & Timeline: MATAPALLY MEGHANA (Roll: 2303A52505)
 * Integrated by: Godishala Kruthik Roshan
 */

export const reminderService = {
  // Get upcoming, overdue, and summary reminders with optional filters (petId, careType, status, search)
  getReminders: (params) => apiClient.get('/reminders', { params }),

  // Get care history timeline for a specific pet
  getPetTimeline: (petId) => apiClient.get(`/reminders/pet/${petId}`),
};

export default reminderService;
