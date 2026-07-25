import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

// Function to attach JWT token
export const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log("Request URL:", config.baseURL + config.url);
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Axios Error:", error);
    console.log("Response:", error.response);
    console.log("Request:", error.request);

    return Promise.reject(error);
  },
);

export default api;
