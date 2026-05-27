import axios from 'axios';
import authStorage from './authStorage';

// Base URL points to the backend server. Can be overridden in production via VITE_API_URL env variable.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Centrally configured Axios client instance
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds request timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Request Interceptor
 * Dynamically injects stored JWT bearer tokens into the Authorization header of outbound requests.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Intercepts incoming HTTP responses to handle global error codes (like 401 token expiry)
 * and normalize backend response exceptions.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return only the data payload from our standard response structure if successful
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    const response = error.response;

    // Standard normalized error structure
    const parsedError = {
      message: 'An unexpected connection error occurred.',
      status: error.response?.status || 500,
      details: null,
      raw: error
    };

    if (response) {
      // 1. Handle Token Expiration or Authentication Failure (401 Unauthorized)
      if (response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        console.warn('Session expired or unauthorized request. Clearing auth credentials...');
        authStorage.clearAuth();
        
        // Trigger a custom event to notify listeners (e.g. app components to redirect to login)
        window.dispatchEvent(new CustomEvent('talentstage-unauthorized'));
        
        parsedError.message = 'Your session has expired. Please sign in again.';
        return Promise.reject(parsedError);
      }

      // 2. Parse Custom Express Backend API Error Responses
      if (response.data) {
        // Express custom validation errors or errorMiddleware formats
        parsedError.message = response.data.message || response.data.error || parsedError.message;
        parsedError.details = response.data.details || response.data.errors || null;
      } else {
        parsedError.message = `Server responded with error status: ${response.status}`;
      }
    } else if (error.request) {
      // The request was made but no response was received (network timeout or offline)
      parsedError.message = 'The server is unreachable. Please verify your connection or backend status.';
      parsedError.status = 503; // Service Unavailable
    } else {
      // General Axios request configuration error
      parsedError.message = error.message;
    }

    return Promise.reject(parsedError);
  }
);

export default apiClient;
