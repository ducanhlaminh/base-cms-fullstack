import axios from "axios";
import store from "../store";
import config from "../config";

// Create axios instance with default config
const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: config.timeout,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const { auth } = store.getState();

    if (auth && auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      store.dispatch({ type: "LOGOUT" });
      // Redirect to login page can be handled here or by a component
    }

    return Promise.reject(error);
  }
);

export default api;
