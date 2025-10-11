# API Contract: Return Book

**Endpoint**: `POST /books/return`  
**Purpose**: Mark a borrowed book as available, clearing borrower information  
**Authentication**: None required

---

## Request

### HTTP Method
`POST`

### Headers
```
Content-Type: application/json
Accept: application/json
```

### Query Parameters
None

### Request Body

**Required Fields**:
```json
{
  "bookId": "string"
}
```

**Field Descriptions**:
- `bookId` (string, required): Unique identifier of the book to return

**Example**:
```json
{
  "bookId": "book-042"
}
```

**Validation Rules**:
- `bookId`: Must be non-empty string
- No borrower identity verification required (per spec - anyone can return any book)

---

## Response

### Success Response

**Status Code**: `200 OK`

**Headers**:
```
Content-Type: application/json
Access-Control-Allow-Origin: * (or specific GitHub Pages domain)
```

**Body**:
```json
{
  "success": true,
  "book": {
    "id": "string",
    "title": "string",
    "author": "string",
    "status": "available",
    "borrowerName": null,
    "borrowedAt": null
  }
}
```

**Field Descriptions**:
- `success` (boolean): Always `true` for successful response
- `book` (object): Updated book information
  - `id`: Same as requested bookId
  - `title`: Book title
  - `author`: Author name
  - `status`: Now `"available"`
  - `borrowerName`: Cleared to `null`
  - `borrowedAt`: Cleared to `null`

**Example**:
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

---

### Error Responses

**Status Code**: `400 Bad Request`

**Reason**: Missing or invalid request fields

**Body**:
```json
{
  "success": false,
  "error": "string",
  "code": "INVALID_REQUEST"
}
```

**Example**:
```json
{
  "success": false,
  "error": "bookId is required",
  "code": "INVALID_REQUEST"
}
```

---

**Status Code**: `404 Not Found`

**Reason**: Book with specified ID does not exist

**Body**:
```json
{
  "success": false,
  "error": "Book not found",
  "code": "BOOK_NOT_FOUND"
}
```

---

**Status Code**: `409 Conflict`

**Reason**: Book is already available (not currently borrowed)

**Body**:
```json
{
  "success": false,
  "error": "Book is not currently borrowed",
  "code": "NOT_BORROWED"
}
```

---

**Status Code**: `500 Internal Server Error`

**Reason**: Server-side error during processing

**Body**:
```json
{
  "success": false,
  "error": "string",
  "code": "SERVER_ERROR"
}
```

**Example**:
```json
{
  "success": false,
  "error": "Database update failed",
  "code": "SERVER_ERROR"
}
```

---

## Behavior Specifications

### Atomicity
- Return operation MUST be atomic
- If two users attempt to return the same book simultaneously, only one MUST succeed
- Second request MUST receive 409 Conflict

### State Transition
- Book status changes from `"borrowed"` to `"available"`
- `borrowerName` field cleared to `null`
- `borrowedAt` timestamp cleared to `null`

### Authorization
- No identity verification required (per spec)
- Anyone can return any borrowed book
- No check that the requester is the original borrower

### Idempotency
- Operation is NOT idempotent
- Attempting to return an already-available book receives 409 Conflict
- No special handling for duplicate requests

### Data Validation
- Backend MUST validate bookId exists
- Backend MUST validate book is currently borrowed

---

## Frontend Integration

### Usage Example
```javascript
import { api } from './api.js';

async function returnBook(bookId) {
  // Optional: Show confirmation prompt
  if (!confirm('Return this book?')) return;
  
  this.loading = true;
  this.error = null;
  
  const result = await api.returnBook(bookId);
  
  if (result.success) {
    // Remove from borrowed books list (optimistic update)
    this.books = this.books.filter(b => b.id !== bookId);
    this.showToast('Book returned successfully', 'success');
  } else {
    // Show error, keep book in list
    this.error = result.error || 'Failed to return book';
    this.showToast(this.error, 'error');
  }
  
  this.loading = false;
}
```

### Error Handling
- 400: Display "Invalid request"
- 404: Display "Book not found" (should not happen in normal flow)
- 409: Display "This book is not currently borrowed"
- 500: Display "Server error occurred, please try again"
- Network error: Display "Unable to connect to server"

### Loading State
- Disable return button while request in progress
- Show loading indicator (spinner or disabled state)
- Prevent duplicate submissions

### User Confirmation
- Consider showing confirmation prompt before returning
- Optional: show borrower name in confirmation ("Return book borrowed by Alice?")

---

## Testing Scenarios

### Happy Path
1. User clicks return on borrowed book
2. API returns 200 with updated book
3. Frontend removes book from borrowed list

### Validation Errors
1. Empty bookId → 400 error
2. Invalid bookId format → 404 error

### Conflict Scenarios
1. Book already available → 409 error
2. Concurrent return attempts → one succeeds (200), one fails (409)

### Error Scenarios
1. Network failure
2. Server error (500)
3. Malformed response JSON

---

## CORS Requirements

Backend MUST include CORS headers to allow GitHub Pages domain:

```
Access-Control-Allow-Origin: https://<username>.github.io
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

Or allow all origins for public API:
```
Access-Control-Allow-Origin: *
```

**Preflight Request**: Browser may send OPTIONS request before POST. Server MUST respond:
```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

---

## Security Considerations

- No authentication means anyone can return any book
- No verification that requester is the original borrower
- Potential for abuse (unauthorized returns)
- Consider adding optional confirmation or audit logging on backend (out of scope for current spec)

---

## Comparison with Borrow Operation

| Aspect | Borrow | Return |
|--------|--------|--------|
| Authentication | None | None |
| Identity Check | Borrower name required | No identity required |
| Request Fields | bookId + borrowerName | bookId only |
| State Transition | available → borrowed | borrowed → available |
| Data Cleared | N/A | borrowerName, borrowedAt |

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-10 | Initial contract definition |

---

## Notes

- This is a state-changing operation (POST)
- No authentication required (per spec requirements)
- Simpler than borrow operation (no borrower information needed)
- Frontend should handle 409 gracefully - may indicate stale data, suggest refresh
- Backend is source of truth - frontend does optimistic update but should handle conflicts
