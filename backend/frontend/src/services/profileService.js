import api, { getAuthHeader } from "./api";

// ==============================
// Get Profile
// ==============================
export const getProfile = async () => {
  const response = await api.get("/profile", getAuthHeader());

  return response.data;
};

// ==============================
// Update Profile
// ==============================
export const updateProfile = async (profileData) => {
  const response = await api.put("/profile", profileData, getAuthHeader());

  return response.data;
};
