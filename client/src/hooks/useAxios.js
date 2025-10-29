import { useState, useCallback, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 🔐 Automatically attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default function useAxios({ url = null, method = "GET", body = null, auto = true } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendRequest = useCallback(
    async (customUrl = url, customMethod = method, customBody = body, customConfig = {}) => {
      if (!customUrl) return;
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance({
          url: customUrl,
          method: customMethod,
          data: customBody,
          ...customConfig,
        });
        setData(response.data);
        return response.data;
      } catch (err) {
        console.error("❌ API Error:", err.response?.data || err.message);
        setError(err.response?.data || err.message);
        throw err.response?.data || err;
      } finally {
        setLoading(false);
      }
    },
    [url, method, body]
  );

  // 🚀 Auto-fetch when hook mounts and auto=true
  useEffect(() => {
    if (url && auto) sendRequest();
  }, [url, auto, sendRequest]);

  return { data, error, loading, refetch: sendRequest };
}
