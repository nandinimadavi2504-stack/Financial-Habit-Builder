import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

// ==============================
// Get Auth Header
// ==============================
const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ==============================
// Dashboard Statistics
// ==============================
export const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/dashboard`, getAuthHeader());

  return response.data;
};

// ==============================
// Get All Users
// ==============================
export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`, getAuthHeader());

  return response.data;
};

// ==============================
// Delete User
// ==============================
export const deleteUser = async (id) => {
  const response = await axios.delete(
    `${API_URL}/users/${id}`,
    getAuthHeader(),
  );

  return response.data;
};

// ==============================
// Admin Login
// ==============================
export const adminLogin = async (adminData) => {
  const response = await axios.post(`${API_URL}/login`, adminData);

  return response.data;
};
