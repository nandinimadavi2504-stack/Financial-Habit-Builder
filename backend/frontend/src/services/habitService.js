import api, { getAuthHeader } from "./api";

// ==============================
// Get All Habits
// ==============================
export const getHabits = async () => {
  const response = await api.get("/habits", getAuthHeader());

  return response.data;
};

// ==============================
// Create Habit
// ==============================
export const createHabit = async (habitData) => {
  const response = await api.post("/habits", habitData, getAuthHeader());

  return response.data;
};

// ==============================
// Complete Habit
// ==============================
export const completeHabit = async (id) => {
  const response = await api.put(`/habits/complete/${id}`, {}, getAuthHeader());

  return response.data;
};

// ==============================
// Reset Habit
// ==============================
export const resetHabit = async (id) => {
  const response = await api.put(`/habits/reset/${id}`, {}, getAuthHeader());

  return response.data;
};

// ==============================
// Delete Habit
// ==============================
export const deleteHabit = async (id) => {
  const response = await api.delete(`/habits/${id}`, getAuthHeader());

  return response.data;
};
