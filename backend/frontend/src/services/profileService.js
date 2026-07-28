import api, { getAuthHeader } from "./api";

// ======================================
// Get User Profile
// ======================================
export const getProfile = async () => {
  const response = await api.get("/profile", getAuthHeader());

  return response.data;
};

// ======================================
// Update User Profile
// ======================================
export const updateProfile = async (profileData) => {
  const response = await api.put("/profile", profileData, getAuthHeader());

  return response.data;
};
