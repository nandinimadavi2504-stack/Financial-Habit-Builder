import api, { getAuthHeader } from "./api";

export const getDashboardData = async () => {
  const response = await api.get("/dashboard", getAuthHeader());
  return response.data;
};
