import axios from "axios";



const api = axios.create({
  baseURL: "https://recruino-ai-powered-recruitment-tool-backend.vercel.app/",
});

// Add token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
