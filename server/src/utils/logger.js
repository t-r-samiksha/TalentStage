/**
 * Centralized Structured Logging Utility
 * Standardizes logs as structured JSON objects for easier observability and log analysis.
 */
export const logger = {
  info: (message, meta = {}) => {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "INFO",
        message,
        ...meta,
      })
    );
  },

  warn: (message, meta = {}) => {
    console.warn(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "WARN",
        message,
        ...meta,
      })
    );
  },

  error: (message, error, meta = {}) => {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "ERROR",
        message,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        ...meta,
      })
    );
  },
};

export default logger;
