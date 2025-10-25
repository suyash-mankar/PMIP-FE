/**
 * Error Handler Utility
 * Provides user-friendly error messages by converting backend errors and validation messages
 */

/**
 * Extract and convert backend error messages to user-friendly messages
 * @param {Error} err - The error object from API calls
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (err) => {
  let errorMsg = "";

  // Check if response data is an array (validation errors from backend)
  if (Array.isArray(err.response?.data)) {
    errorMsg = err.response.data[0];
  }
  // Check for error property in response data
  else if (err.response?.data?.error) {
    errorMsg = err.response.data.error;
  }
  // Check for message property in response data
  else if (err.response?.data?.message) {
    errorMsg = err.response.data.message;
  }
  // Fallback to error message
  else if (err.message) {
    // Don't show technical error messages to users
    if (
      err.message.includes("status code") ||
      err.message.includes("Network Error")
    ) {
      return "Something went wrong. Please try again.";
    }
    errorMsg = err.message;
  } else {
    return "Something went wrong. Please try again.";
  }

  // Convert common backend validation messages to user-friendly ones
  if (errorMsg.includes("length must be at least 10 characters")) {
    return "Answer length should be at least 10 characters long";
  }
  if (errorMsg.includes("Validation failed")) {
    return "Answer length should be at least 10 characters long";
  }
  if (errorMsg.includes("is required")) {
    return "Please fill in all required fields";
  }
  if (errorMsg.includes("invalid")) {
    return "Please check your input and try again";
  }
  if (errorMsg.includes("not found")) {
    return "The requested resource was not found";
  }
  if (errorMsg.includes("unauthorized") || errorMsg.includes("Unauthorized")) {
    return "Please log in to continue";
  }
  if (errorMsg.includes("forbidden") || errorMsg.includes("Forbidden")) {
    return "You do not have permission to perform this action";
  }
  if (errorMsg.includes("timeout") || errorMsg.includes("Timeout")) {
    return "Request timed out. Please try again.";
  }
  if (
    errorMsg.includes("limit reached") ||
    errorMsg.includes("Limit reached")
  ) {
    return "Usage limit reached. Please upgrade to continue.";
  }

  // Return the original error message if no conversion needed
  return errorMsg;
};

/**
 * Handle API errors and return formatted error message
 * @param {Error} err - The error object
 * @param {string} defaultMessage - Default message if no specific error found
 * @returns {string} - Formatted error message
 */
export const handleApiError = (
  err,
  defaultMessage = "Something went wrong. Please try again."
) => {
  const errorMessage = getErrorMessage(err);
  return errorMessage || defaultMessage;
};

export default {
  getErrorMessage,
  handleApiError,
};
