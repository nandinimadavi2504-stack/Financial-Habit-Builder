import api, { getAuthHeader } from "./api";

// Create Budget
export const createBudget = async (budgetData) => {
  const response = await api.post("/budget", budgetData, getAuthHeader());

  return response.data;
};

// Get Budget Status
export const getBudgetStatus = async (month, year) => {
  const response = await api.get(
    `/budget?month=${month}&year=${year}`,
    getAuthHeader(),
  );

  return response.data;
};
