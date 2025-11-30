// src/api/quoteApi.jsx
import api from "./axiosConfig";

export const getQuotes = async () => {
  try {
    const response = await api.get("https://type.fit/api/quotes");
    return response.data;
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return [];
  }
};
