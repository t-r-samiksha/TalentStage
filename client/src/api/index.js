/**
 * Centralized API Infrastructure Entrypoint
 * Re-exports storage managers, HTTP clients, request wrappers, and services
 * for clean, single-import syntax inside React UI components.
 * 
 * Example usage:
 * import { authService, projectService } from './api';
 */

export { default as authStorage } from './authStorage';
export { default as apiClient } from './apiClient';
export { default as request } from './requestWrapper';

// Services
export { default as authService } from './services/authService';
export { default as projectService } from './services/projectService';
export { default as dashboardService } from './services/dashboardService';
export { default as aiService } from './services/aiService';
export { default as skillTestService } from './services/skillTestService';
export { default as notificationService } from './services/notificationService';
export { followService } from './services/followService';
export { savedService } from './services/savedService';
export { contractService } from './services/messageService';

