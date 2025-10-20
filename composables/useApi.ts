/**
 * API composable for centralized API communication
 */

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

interface Book {
  id: string
  name: string
  number: string
  author?: string
  borrowerName?: string
  borrowedAt?: string
}

interface BorrowData {
  email: string
  name: string
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl as string

  /**
   * Generic API request wrapper with error handling
   */
  const apiRequest = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        // Try to parse error message from server
        let errorMessage: string | undefined
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error
        } catch (e) {
          errorMessage = response.statusText
        }

        // Provide user-friendly error messages based on status code
        if (response.status === 400) {
          return {
            success: false,
            error: errorMessage || 'Invalid request. Please check your input and try again.',
          }
        } else if (response.status === 404) {
          return {
            success: false,
            error: 'The requested resource was not found. Please try again later.',
          }
        } else if (response.status === 500) {
          return {
            success: false,
            error: 'Server error occurred. Please try again later.',
          }
        } else if (response.status >= 500) {
          return {
            success: false,
            error: 'Server is temporarily unavailable. Please try again later.',
          }
        } else {
          return {
            success: false,
            error: errorMessage || `Request failed (${response.status}). Please try again.`,
          }
        }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error: any) {
      console.error('API Error:', error)

      // Provide user-friendly error messages for common network errors
      if (error.name === 'TypeError' && error.message?.includes('fetch')) {
        return {
          success: false,
          error: 'Unable to connect to server. Please check your internet connection and try again.',
        }
      } else if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timed out. Please try again.',
        }
      } else if (error.name === 'SyntaxError') {
        return {
          success: false,
          error: 'Unable to process server response. Please try again later.',
        }
      } else {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred. Please try again.',
        }
      }
    }
  }

  return {
    /**
     * Get list of available books
     */
    getAvailableBooks: (): Promise<ApiResponse<Book[]>> =>
      apiRequest('d1bbd9dc-8c55-474f-8488-97524e56d0e6'),

    /**
     * Borrow a book
     */
    borrowBook: (bookId: string, borrowData: BorrowData): Promise<ApiResponse> =>
      apiRequest('588b65d3-2a64-4cc4-9fb5-3c6a87aab16c', {
        method: 'POST',
        body: JSON.stringify({
          bookId,
          email: borrowData.email,
          name: borrowData.name,
        }),
      }),

    /**
     * Get list of borrowed books
     */
    getBorrowedBooks: (): Promise<ApiResponse<Book[]>> =>
      apiRequest('32a5b78e-6712-4948-b5dc-4af5c092af18'),

    /**
     * Return a book
     */
    returnBook: (recordId: string): Promise<ApiResponse> =>
      apiRequest('be25902c-7f43-430a-b0de-1fd19dd4cfd7', {
        method: 'PATCH',
        body: JSON.stringify({ recordId }),
      }),

    /**
     * Find user name by email
     */
    findUserName: (email: string): Promise<ApiResponse> =>
      apiRequest(
        '9b072858-ff44-4ad5-bf32-2880de7d71ee?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkeWxhbkBvZGQudGVhbSIsInZlcnNpb24iOiIyMDI1MTAxNTE1MjQwNSIsImlhdCI6MTc2MDUxMzA2NX0.kKNRlXpFLqRJxlW1Hpv_YgLMQEP6hDzYMbgqKXOBOVw',
        {
          method: 'POST',
          body: JSON.stringify({ email }),
        }
      ),
  }
}
