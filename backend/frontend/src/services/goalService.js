import api, { getAuthHeader } from "./api";

// Get all goals
export const getGoals = async () => {
  const response = await api.get("/goal", getAuthHeader());
  return response.data;
};

// Create goal
export const createGoal = async (goalData) => {
  const response = await api.post("/goal", goalData, getAuthHeader());

  return response.data;
};

// Update saved amount
export const updateGoal = async (id, savedAmount) => {
  const response = await api.put(
    `/goal/${id}`,
    { savedAmount },
    getAuthHeader(),
  );

  return response.data;
};

// Delete goal
export const deleteGoal = async (id) => {
  const response = await api.delete(`/goal/${id}`, getAuthHeader());

  return response.data;
};
