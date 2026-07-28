import axios from "axios";

// ======================================
// Axios Instance
// ======================================
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

// ======================================
// Get Auth Header
// ======================================
export const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

// ======================================
// Request Interceptor
// ======================================
api.interceptors.request.use(
  (config) => {
    console.log("==================================");
    console.log("➡️ Request URL:", `${config.baseURL}${config.url}`);
    console.log("➡️ Method:", config.method?.toUpperCase());
    console.log("➡️ Data:", config.data);

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

// ======================================
// Response Interceptor
// ======================================
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.data);
    return response;
  },
  (error) => {
    console.error("❌ Axios Error:", error);

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Response:", error.response.data);
    } else {
      console.log("No response received from backend.");
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  },
);

export default api;
