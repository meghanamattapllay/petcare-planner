import apiClient from './apiClient';

/**
 * Reminders API Service
 * Reminders & Timeline: MATAPALLY MEGHANA (Roll: 2303A52505)
 * Integrated by Lead: Godishala Kruthik Roshan
 */

export const reminderService = {
  // Get upcoming, overdue, and summary reminders
  getReminders: () => apiClient.get('/reminders'),
};

export default reminderService;
