import axios from 'axios';
import authStorage from './authStorage';

// Base URL points to the backend server. Can be overridden in production via VITE_API_URL env variable.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Centrally configured Axios client instance
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000, // Increased to 25s to accommodate Render's free tier cold start times
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Configure Custom Retry Settings for handling cold-starts (e.g., Render free tier spinning up)
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1500,
  backoffFactor: 2,
  // Retry transient server errors (502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout)
  // or connection/timeout issues where no response is returned
  retryableStatuses: [502, 503, 504],
};

/**
 * Helper to determine if an error is eligible for a retry
 */
const isRetryableError = (error) => {
  // If we don't have config or the request was explicitly canceled, don't retry
  if (!error.config || error.config._retryCount >= RETRY_CONFIG.maxRetries) {
    return false;
  }

  // Network drops / offline / DNS errors
  if (!error.response) {
    return true; 
  }

  // Check if status is a transient server error
  return RETRY_CONFIG.retryableStatuses.includes(error.response.status);
};

/**
 * Request Interceptor
 * Dynamically injects stored JWT bearer tokens into the Authorization header of outbound requests.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Initialize retry counter for the request if not already present
    if (config._retryCount === undefined) {
      config._retryCount = 0;
    }
    
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
 * Intercepts incoming HTTP responses to handle global error codes (like 401 token expiry),
 * manage automatic retries, and normalize backend response exceptions.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return only the data payload from our standard response structure if successful
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const response = error.response;

    // Standard normalized error structure
    const parsedError = {
      message: 'An unexpected connection error occurred.',
      status: error.response?.status || 500,
      details: null,
      raw: error
    };

    // 1. Handle Automatic Retry for Transient Network & Cold Start Errors
    if (isRetryableError(error)) {
      originalRequest._retryCount += 1;
      
      // Calculate delay with exponential backoff: delay = initialDelay * (backoffFactor ^ retryCount)
      const delay = RETRY_CONFIG.initialDelayMs * Math.pow(RETRY_CONFIG.backoffFactor, originalRequest._retryCount - 1);
      
      console.warn(`[API Retry] Request to ${originalRequest.url} failed with ${response ? response.status : 'Network Error'}. Retrying attempt ${originalRequest._retryCount}/${RETRY_CONFIG.maxRetries} in ${delay}ms...`);
      
      // Wait for backoff duration
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Execute the request again with the updated retry count
      return apiClient(originalRequest);
    }

    // 2. Handle Token Expiration or Authentication Failure (401 Unauthorized)
    if (response) {
      // Prevent infinite redirect loops by ensuring we only clear and redirect once per request sequence
      if (response.status === 401 && !originalRequest._hasClearedAuth) {
        originalRequest._hasClearedAuth = true;
        console.warn('Session expired or unauthorized request. Clearing auth credentials...');
        authStorage.clearAuth();
        
        // Trigger a custom event to notify listeners (e.g. app components to redirect to login)
        window.dispatchEvent(new CustomEvent('talentstage-unauthorized'));
        
        parsedError.message = 'Your session has expired. Please sign in again.';
        parsedError.status = 401;
        return Promise.reject(parsedError);
      }

      // 3. Parse Custom Express Backend API Error Responses
      if (response.data) {
        // Express custom validation errors or errorMiddleware formats
        parsedError.message = response.data.message || response.data.error || parsedError.message;
        parsedError.details = response.data.details || response.data.errors || null;
      } else {
        parsedError.message = `Server responded with error status: ${response.status}`;
      }
    } else if (error.request) {
      // The request was made but no response was received (network timeout or offline)
      if (!window.navigator.onLine) {
        parsedError.message = 'No internet connection detected. Please check your network and try again.';
      } else {
        parsedError.message = 'The server is unreachable. Render backend may be waking up, please wait or retry.';
      }
      parsedError.status = 503; // Service Unavailable
    } else {
      // General Axios request configuration error
      parsedError.message = error.message;
    }

    return Promise.reject(parsedError);
  }
);

export default apiClient;
