import api, { getAuthHeader } from "./api";

// ==============================
// Get All Investments
// ==============================
export const getInvestments = async () => {
  const response = await api.get("/investments", getAuthHeader());

  return response.data;
};

// ==============================
// Add Investment
// ==============================
export const addInvestment = async (investmentData) => {
  const response = await api.post(
    "/investments",
    investmentData,
    getAuthHeader(),
  );

  return response.data;
};

// ==============================
// Update Investment
// ==============================
export const updateInvestment = async (id, investmentData) => {
  const response = await api.put(
    `/investments/${id}`,
    investmentData,
    getAuthHeader(),
  );

  return response.data;
};

// ==============================
// Delete Investment
// ==============================
export const deleteInvestment = async (id) => {
  const response = await api.delete(`/investments/${id}`, getAuthHeader());

  return response.data;
};
