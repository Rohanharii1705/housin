import { create } from 'zustand';
import apiRequest from './apiRequest';

export const useNotificationStore = create((set) => ({
  number: 0,

  // Fetch notifications with error handling
  fetch: async () => {
    try {
      const res = await apiRequest.get("/users/notification"); // Use GET explicitly for clarity
      set({ number: res.data });
    } catch (error) {
      console.error("Failed to fetch notifications:", error.response?.data || error.message);
      // Optional: Reset the number to 0 if unauthorized or server error
      if (error.response?.status === 401) {
        set({ number: 0 }); // Reset on unauthorized access
        // Optionally, redirect to login or notify the user
      }
    }
  },

  // Decrease the notification count
  decrease: () => {
    set((prev) => ({
      number: Math.max(0, prev.number - 1), // Prevent negative numbers
    }));
  },

  // Reset the notification count to 0
  reset: () => {
    set({ number: 0 });
  },
}));
