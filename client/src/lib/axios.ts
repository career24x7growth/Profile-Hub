// src/lib/axios.ts
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
});

// Register request interceptor only in the browser (safe for Next.js SSR)
if (typeof window !== "undefined") {
  api.interceptors.request.use(
    (config) => {
      try {
        const token = localStorage.getItem("token");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        // ignore
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

export default api;
