import axios from "axios";

const API = "http://localhost:5000/api/feedback";

const getToken = () => localStorage.getItem("token");

const config = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const submitFeedback = async (feedbackData) => {
  const { data } = await axios.post(API, feedbackData, config());
  return data;
};

export const getAllFeedback = async () => {
  const { data } = await axios.get(API, config());
  return data;
};

export const deleteFeedback = async (id) => {
  const { data } = await axios.delete(`${API}/${id}`, config());
  return data;
};
