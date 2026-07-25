import api from "./api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get All Income
export const getAllIncome = async () => {
  const response = await api.get("/income", getAuthHeader());
  return response.data;
};

// Add Income
export const addIncome = async (incomeData) => {
  const response = await api.post("/income", incomeData, getAuthHeader());

  return response.data;
};

// Update Income
export const updateIncome = async (id, incomeData) => {
  const response = await api.put(`/income/${id}`, incomeData, getAuthHeader());

  return response.data;
};

// Delete Income
export const deleteIncome = async (id) => {
  const response = await api.delete(`/income/${id}`, getAuthHeader());

  return response.data;
};
