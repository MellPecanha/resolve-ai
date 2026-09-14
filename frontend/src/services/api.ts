import axios from "axios";

const TOKEN_KEY = "resolve-ai-token";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ??
    "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
