/**
 * API Client for Book Borrowing System
 * Centralized API communication with error handling
 */

// TODO: Update this URL when backend is ready
const API_BASE_URL = "https://n8n.306.team/webhook/";

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
  getAvailableBooks: () => apiRequest("d1bbd9dc-8c55-474f-8488-97524e56d0e6"),

  /**
   * Borrow a book
   * @param {string} bookId - ID of book to borrow
   * @param {Object} borrowData - Borrower information
   * @param {string} borrowData.borrowerName - Name/ID of borrower
   * @param {string|null} borrowData.googleEmail - Google account email
   * @param {string|null} borrowData.googleId - Google account ID
   * @returns {Promise<{success: boolean, data?: {book: Object}, error?: string}>}
   */
  borrowBook: (bookId, borrowData) =>
    apiRequest("588b65d3-2a64-4cc4-9fb5-3c6a87aab16c", {
      method: "POST",
      body: JSON.stringify({
        bookId,
        email: borrowData.email,
        name: borrowData.name,
      }),
    }),

  /**
   * Get list of borrowed books
   * @returns {Promise<{success: boolean, data?: {books: Array}, error?: string}>}
   */
  getBorrowedBooks: () => apiRequest("32a5b78e-6712-4948-b5dc-4af5c092af18"),

  /**
   * Return a book
   * @param {string} recordId - ID of borrow record to return (book_borrow_records.id)
   * @returns {Promise<{success: boolean, data?: {book: Object}, error?: string}>}
   */
  returnBook: (recordId) =>
    apiRequest("be25902c-7f43-430a-b0de-1fd19dd4cfd7", {
      method: "PATCH",
      body: JSON.stringify({ recordId }),
    }),

  findUserName: (email) =>
    apiRequest(
      "9b072858-ff44-4ad5-bf32-2880de7d71ee?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkeWxhbkBvZGQudGVhbSIsInZlcnNpb24iOiIyMDI1MTAxNTE1MjQwNSIsImlhdCI6MTc2MDUxMzA2NX0.kKNRlXpFLqRJxlW1Hpv_YgLMQEP6hDzYMbgqKXOBOVw",
      {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
      },
    ),
};
