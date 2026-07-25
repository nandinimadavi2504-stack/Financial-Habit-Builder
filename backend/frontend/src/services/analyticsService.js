import api, { getAuthHeader } from "./api";

// Financial Summary
export const getFinancialSummary = async () => {
  const response = await api.get("/analytics/summary", getAuthHeader());

  return response.data;
};

// Expense Categories
export const getExpenseCategories = async () => {
  const response = await api.get("/analytics/categories", getAuthHeader());

  return response.data;
};

// Monthly Report
export const getMonthlyReport = async () => {
  const response = await api.get("/analytics/monthly", getAuthHeader());

  return response.data;
};
