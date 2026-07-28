import api from "./api";

// ==============================
// Get All Goals
// ==============================
export const getGoals = async (params = {}) => {
  const response = await api.get("/goals", {
    params,
  });

  return response.data;
};

// ==============================
// Get Goal By ID
// ==============================
export const getGoalById = async (id) => {
  const response = await api.get(`/goals/${id}`);

  return response.data;
};

// ==============================
// Create Goal
// ==============================
export const createGoal = async (goalData) => {
  const response = await api.post("/goals", goalData);

  return response.data;
};

// ==============================
// Update Goal Details
// ==============================
export const updateGoal = async (id, goalData) => {
  const response = await api.put(`/goals/${id}`, goalData);

  return response.data;
};

// ==============================
// Update Saved Amount
// ==============================
export const updateSavings = async (id, savedAmount) => {
  const response = await api.patch(`/goals/${id}/savings`, {
    savedAmount,
  });

  return response.data;
};

// ==============================
// Delete Goal
// ==============================
export const deleteGoal = async (id) => {
  const response = await api.delete(`/goals/${id}`);

  return response.data;
};
