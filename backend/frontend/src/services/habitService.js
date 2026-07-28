import api from "./api";

// Get All Habits
export const getHabits = async (params = {}) => {
  const response = await api.get("/habits", { params });
  return response.data;
};

// Get Habit By ID
export const getHabitById = async (id) => {
  const response = await api.get(`/habits/${id}`);
  return response.data;
};

// Create Habit
export const createHabit = async (habitData) => {
  const response = await api.post("/habits", habitData);
  return response.data;
};

// Update Habit
export const updateHabit = async (id, habitData) => {
  const response = await api.put(`/habits/${id}`, habitData);
  return response.data;
};

// Complete Habit
export const completeHabit = async (id) => {
  const response = await api.patch(`/habits/${id}/complete`);
  return response.data;
};

// Reset Habit
export const resetHabit = async (id) => {
  const response = await api.patch(`/habits/${id}/reset`);
  return response.data;
};

// Delete Habit
export const deleteHabit = async (id) => {
  const response = await api.delete(`/habits/${id}`);
  return response.data;
};
