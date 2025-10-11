# Data Model: Book Borrowing System

**Feature**: 001-a-book-borrow  
**Date**: 2025-10-10  
**Source**: Derived from spec.md Key Entities section

## Overview

This document defines the data structures used in the book borrowing system frontend. Since this is a frontend-only application, these models represent the expected JSON structures from backend APIs and the internal state managed by Vue components.

**Note**: Backend persistence is handled server-side. This model documents the client-side view of data.

---

## Entities

### Book

Represents a book in the library catalog with availability information.

**Fields**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string | Yes | Unique identifier for the book | Non-empty string |
| `title` | string | Yes | Book title | Non-empty string, max length TBD |
| `author` | string | Yes | Author name | Non-empty string, max length TBD |
| `status` | string | Yes | Availability status | Enum: `"available"` or `"borrowed"` |
| `borrowerName` | string | Conditional | Name/ID of current borrower | Required when status is `"borrowed"`, null when `"available"` |
| `borrowedAt` | string (ISO 8601) | Optional | Timestamp when book was borrowed | ISO 8601 datetime string, present only when borrowed |

**Example (Available Book)**:
```json
{
  "id": "book-001",
  "title": "The Pragmatic Programmer",
  "author": "David Thomas, Andrew Hunt",
  "status": "available",
  "borrowerName": null,
  "borrowedAt": null
}
```

**Example (Borrowed Book)**:
```json
{
  "id": "book-042",
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "status": "borrowed",
  "borrowerName": "Alice Johnson",
  "borrowedAt": "2025-10-08T14:30:00Z"
}
```

**State Transitions**:
```
available → borrowed  (via borrow operation with borrowerName)
borrowed → available  (via return operation, clears borrowerName)
```

**Frontend Validation Rules**:
- `title` and `author` displayed with ellipsis if exceeding display width
- `borrowerName` must be provided before borrowing (form validation)
- Cannot borrow if `status` is already `"borrowed"`
- Cannot return if `status` is already `"available"`

---

### Borrow Transaction (Conceptual)

Represents the action of borrowing a book. **Not persisted in frontend state** - only used for API request/response.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bookId` | string | Yes | ID of book being borrowed |
| `borrowerName` | string | Yes | Name/ID of borrower (free text) |

**Request Payload** (POST `/books/borrow`):
```json
{
  "bookId": "book-001",
  "borrowerName": "Alice Johnson"
}
```

**Expected Response** (Success):
```json
{
  "success": true,
  "book": {
    "id": "book-001",
    "title": "The Pragmatic Programmer",
    "author": "David Thomas, Andrew Hunt",
    "status": "borrowed",
    "borrowerName": "Alice Johnson",
    "borrowedAt": "2025-10-10T16:45:23Z"
  }
}
```

**Expected Response** (Error - Already Borrowed):
```json
{
  "success": false,
  "error": "Book is already borrowed",
  "code": "ALREADY_BORROWED"
}
```

**Frontend Behavior**:
- After successful borrow, remove book from available list (optimistic update)
- On error, show error message and keep book in available list
- Clear borrower name input field after success

---

### Return Transaction (Conceptual)

Represents the action of returning a book. **Not persisted in frontend state** - only used for API request/response.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bookId` | string | Yes | ID of book being returned |

**Request Payload** (POST `/books/return`):
```json
{
  "bookId": "book-042"
}
```

**Expected Response** (Success):
```json
{
  "success": true,
  "book": {
    "id": "book-042",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "status": "available",
    "borrowerName": null,
    "borrowedAt": null
  }
}
```

**Expected Response** (Error - Not Borrowed):
```json
{
  "success": false,
  "error": "Book is not currently borrowed",
  "code": "NOT_BORROWED"
}
```

**Frontend Behavior**:
- After successful return, remove book from borrowed list (optimistic update)
- On error, show error message and keep book in borrowed list

---

## Component State Models

### Available Books Page State

```typescript
interface AvailableBooksState {
  books: Book[];           // List of available books from API
  loading: boolean;        // True while fetching books or performing borrow
  error: string | null;    // Error message to display, null if no error
  borrowerName: string;    // User input for borrower name/ID
  selectedBookId: string | null;  // ID of book selected for borrowing
}
```

**Initial State**:
```javascript
{
  books: [],
  loading: true,  // Start with loading=true, fetch on mount
  error: null,
  borrowerName: '',
  selectedBookId: null
}
```

---

### Borrowed Books Page State

```typescript
interface BorrowedBooksState {
  books: Book[];           // List of borrowed books from API
  loading: boolean;        // True while fetching books or performing return
  error: string | null;    // Error message to display, null if no error
}
```

**Initial State**:
```javascript
{
  books: [],
  loading: true,  // Start with loading=true, fetch on mount
  error: null
}
```

---

## API Response Formats

### GET /books/available

**Response** (Success):
```json
{
  "books": [
    {
      "id": "book-001",
      "title": "The Pragmatic Programmer",
      "author": "David Thomas, Andrew Hunt",
      "status": "available",
      "borrowerName": null
    },
    {
      "id": "book-003",
      "title": "Refactoring",
      "author": "Martin Fowler",
      "status": "available",
      "borrowerName": null
    }
  ]
}
```

**Response** (Empty):
```json
{
  "books": []
}
```

**Response** (Error):
```json
{
  "error": "Internal server error",
  "code": "SERVER_ERROR"
}
```

---

### GET /books/borrowed

**Response** (Success):
```json
{
  "books": [
    {
      "id": "book-042",
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "status": "borrowed",
      "borrowerName": "Alice Johnson",
      "borrowedAt": "2025-10-08T14:30:00Z"
    },
    {
      "id": "book-007",
      "title": "Domain-Driven Design",
      "author": "Eric Evans",
      "status": "borrowed",
      "borrowerName": "Bob Smith",
      "borrowedAt": "2025-10-09T10:15:00Z"
    }
  ]
}
```

**Response** (Empty):
```json
{
  "books": []
}
```

---

## Validation Rules

### Client-Side Validation

1. **Borrower Name** (before borrow operation):
   - Must not be empty or whitespace-only
   - Min length: 1 character
   - Max length: 100 characters (recommended, prevents UI overflow)
   - No format restrictions (spec says "no validation constraints" for API, but basic UX validation)

2. **Book Selection**:
   - Must select a book from available list before borrowing
   - Cannot interact with book if operation in progress (disable buttons while loading)

3. **Display Truncation**:
   - Book titles longer than container width: show ellipsis
   - Author names longer than container width: show ellipsis
   - Borrower names longer than container width: show ellipsis
   - Consider tooltip on hover for full text

### Server-Side Validation (Expected)

The backend APIs are expected to enforce:
- Book ID must exist
- Book must be available when borrowing
- Book must be borrowed when returning
- Concurrent borrow attempts handled (only one succeeds)

Frontend should handle these error responses gracefully.

---

## Data Flow Diagrams

### Borrow Book Flow

```
User Action: Click "Borrow" on available book
     ↓
Frontend: Show borrow form modal
     ↓
User Action: Enter name, click "Confirm"
     ↓
Frontend: Validate borrower name (non-empty)
     ↓
Frontend: Set loading=true, disable form
     ↓
API Call: POST /books/borrow {bookId, borrowerName}
     ↓
API Response: Success or Error
     ↓
If Success:
  - Remove book from available books array
  - Clear borrower name input
  - Show success toast
  - Set loading=false
     ↓
If Error:
  - Show error message
  - Keep book in available books array
  - Keep borrower name input (user can retry)
  - Set loading=false
```

### Return Book Flow

```
User Action: Click "Return" on borrowed book
     ↓
Frontend: Show confirmation prompt
     ↓
User Action: Confirm return
     ↓
Frontend: Set loading=true, disable button
     ↓
API Call: POST /books/return {bookId}
     ↓
API Response: Success or Error
     ↓
If Success:
  - Remove book from borrowed books array
  - Show success toast
  - Set loading=false
     ↓
If Error:
  - Show error message
  - Keep book in borrowed books array
  - Set loading=false
```

---

## Notes for Implementation

1. **Optimistic Updates**: UI immediately updates after API success, assumes backend is source of truth
2. **Error Recovery**: On error, revert optimistic updates or refetch from API
3. **No Local Caching**: Each page load fetches fresh data from API
4. **No Pagination**: Spec assumes entire catalog fits in memory and displays reasonably
5. **Type Safety**: Consider using JSDoc comments for type hints in JavaScript (no TypeScript in this setup)

**Example JSDoc**:
```javascript
/**
 * @typedef {Object} Book
 * @property {string} id
 * @property {string} title
 * @property {string} author
 * @property {'available'|'borrowed'} status
 * @property {string|null} borrowerName
 * @property {string|null} borrowedAt
 */

/**
 * Fetch available books from API
 * @returns {Promise<{success: boolean, data?: Book[], error?: string}>}
 */
async function getAvailableBooks() { ... }
```
