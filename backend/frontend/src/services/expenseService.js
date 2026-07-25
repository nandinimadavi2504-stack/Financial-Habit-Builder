import api from "./api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get All Expenses
export const getAllExpenses = async () => {
  const response = await api.get("/expense", getAuthHeader());
  return response.data;
};

// Add Expense
export const addExpense = async (expenseData) => {
  const response = await api.post("/expense", expenseData, getAuthHeader());

  return response.data;
};

// Update Expense
export const updateExpense = async (id, expenseData) => {
  const response = await api.put(
    `/expense/${id}`,
    expenseData,
    getAuthHeader(),
  );

  return response.data;
};

// Delete Expense
export const deleteExpense = async (id) => {
  const response = await api.delete(`/expense/${id}`, getAuthHeader());

  return response.data;
};
