/**
 * API Client for Book Borrowing System
 * Centralized API communication with error handling
 */

// TODO: Update this URL when backend is ready
const API_BASE_URL = "https://api.example.com";

/**
 * Generic API request wrapper with error handling
 * @param {string} endpoint - API endpoint (e.g., '/books/available')
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      // Try to parse error message from server
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error;
      } catch (e) {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText;
      }

      // Provide user-friendly error messages based on status code
      if (response.status === 400) {
        return {
          success: false,
          error:
            errorMessage ||
            "Invalid request. Please check your input and try again.",
        };
      } else if (response.status === 404) {
        return {
          success: false,
          error:
            "The requested resource was not found. Please try again later.",
        };
      } else if (response.status === 500) {
        return {
          success: false,
          error: "Server error occurred. Please try again later.",
        };
      } else if (response.status >= 500) {
        return {
          success: false,
          error: "Server is temporarily unavailable. Please try again later.",
        };
      } else {
        return {
          success: false,
          error:
            errorMessage ||
            `Request failed (${response.status}). Please try again.`,
        };
      }
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    // Handle network errors, JSON parse errors, etc.
    console.error("API Error:", error);

    // Provide user-friendly error messages for common network errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return {
        success: false,
        error:
          "Unable to connect to server. Please check your internet connection and try again.",
      };
    } else if (error.name === "AbortError") {
      return {
        success: false,
        error: "Request timed out. Please try again.",
      };
    } else if (error.name === "SyntaxError") {
      return {
        success: false,
        error: "Unable to process server response. Please try again later.",
      };
    } else {
      return {
        success: false,
        error:
          error.message || "An unexpected error occurred. Please try again.",
      };
    }
  }
}

/**
 * API object with endpoint functions
 * Export this to use in Vue components
 */
export const api = {
  /**
   * Get list of available books
   * @returns {Promise<{success: boolean, data?: {books: Array}, error?: string}>}
   */
  getAvailableBooks: () => apiRequest("/books/available"),

  /**
   * Borrow a book
   * @param {string} bookId - ID of book to borrow
   * @param {string} borrowerName - Name/ID of borrower
   * @returns {Promise<{success: boolean, data?: {book: Object}, error?: string}>}
   */
  borrowBook: (bookId, borrowerName) =>
    apiRequest("/books/borrow", {
      method: "POST",
      body: JSON.stringify({ bookId, borrowerName }),
    }),

  /**
   * Get list of borrowed books
   * @returns {Promise<{success: boolean, data?: {books: Array}, error?: string}>}
   */
  getBorrowedBooks: () => apiRequest("/books/borrowed"),

  /**
   * Return a book
   * @param {string} bookId - ID of book to return
   * @returns {Promise<{success: boolean, data?: {book: Object}, error?: string}>}
   */
  returnBook: (bookId) =>
    apiRequest("/books/return", {
      method: "POST",
      body: JSON.stringify({ bookId }),
    }),
};
