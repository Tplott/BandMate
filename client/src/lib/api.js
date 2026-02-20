import axios from "axios";

// Create an axios instance pointed at our backend
const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

// Interceptor — runs before every request
// Automatically grabs the token from localStorage and adds it to the header
// This means we never have to manually add Authorization: Bearer <token> ourselves
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
