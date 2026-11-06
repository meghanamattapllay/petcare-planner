import apiClient from './apiClient';

export const reminderService = {

  getReminders: () => apiClient.get('/reminders'),
};

export default reminderService;

