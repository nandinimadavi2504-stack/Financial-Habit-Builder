import api from "./api";

// ==============================
// Get All Investments
// ==============================
export const getInvestments = async (params = {}) => {
  const response = await api.get("/investments", {
    params,
  });

  return response.data;
};

// ==============================
// Get Investment By ID
// ==============================
export const getInvestmentById = async (id) => {
  const response = await api.get(`/investments/${id}`);

  return response.data;
};

// ==============================
// Add Investment
// ==============================
export const addInvestment = async (investmentData) => {
  const response = await api.post("/investments", investmentData);

  return response.data;
};

// ==============================
// Update Investment
// ==============================
export const updateInvestment = async (id, investmentData) => {
  const response = await api.put(`/investments/${id}`, investmentData);

  return response.data;
};

// ==============================
// Delete Investment
// ==============================
export const deleteInvestment = async (id) => {
  const response = await api.delete(`/investments/${id}`);

  return response.data;
};
