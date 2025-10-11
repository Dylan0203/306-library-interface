# API Contract: Borrow Book

**Endpoint**: `POST /books/borrow`  
**Purpose**: Mark an available book as borrowed by a specific user  
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
  "bookId": "string",
  "borrowerName": "string"
}
```

**Field Descriptions**:
- `bookId` (string, required): Unique identifier of the book to borrow
- `borrowerName` (string, required): Free text name or ID of the borrower (no validation on format)

**Example**:
```json
{
  "bookId": "book-001",
  "borrowerName": "Alice Johnson"
}
```

**Validation Rules**:
- `bookId`: Must be non-empty string
- `borrowerName`: Must be non-empty string (no format restrictions per spec)
- Both fields are required

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
    "status": "borrowed",
    "borrowerName": "string",
    "borrowedAt": "string (ISO 8601)"
  }
}
```

**Field Descriptions**:
- `success` (boolean): Always `true` for successful response
- `book` (object): Updated book information
  - `id`: Same as requested bookId
  - `title`: Book title
  - `author`: Author name
  - `status`: Now `"borrowed"`
  - `borrowerName`: Name provided in request
  - `borrowedAt`: Timestamp when borrow operation completed

**Example**:
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
  "error": "borrowerName is required",
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

**Reason**: Book is already borrowed

**Body**:
```json
{
  "success": false,
  "error": "Book is already borrowed by [borrower name]",
  "code": "ALREADY_BORROWED"
}
```

**Example**:
```json
{
  "success": false,
  "error": "Book is already borrowed by Bob Smith",
  "code": "ALREADY_BORROWED"
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
- Borrow operation MUST be atomic
- If two users attempt to borrow the same book simultaneously, only one MUST succeed
- Second request MUST receive 409 Conflict

### State Transition
- Book status changes from `"available"` to `"borrowed"`
- `borrowerName` field populated with provided name
- `borrowedAt` timestamp set to current server time

### Idempotency
- Operation is NOT idempotent
- Same borrower requesting same book twice receives 409 Conflict
- No special handling for duplicate requests

### Data Validation
- Backend MUST validate bookId exists
- Backend MUST validate book is currently available
- Backend MAY sanitize borrowerName (e.g., trim whitespace) but MUST NOT reject based on format

---

## Frontend Integration

### Usage Example
```javascript
import { api } from './api.js';

async function borrowBook(bookId, borrowerName) {
  this.loading = true;
  this.error = null;
  
  const result = await api.borrowBook(bookId, borrowerName);
  
  if (result.success) {
    // Remove from available books list (optimistic update)
    this.books = this.books.filter(b => b.id !== bookId);
    this.borrowerName = ''; // Clear input
    this.showToast('Book borrowed successfully', 'success');
  } else {
    // Show error, keep book in list
    this.error = result.error || 'Failed to borrow book';
    this.showToast(this.error, 'error');
  }
  
  this.loading = false;
}
```

### Error Handling
- 400: Display "Invalid request, please check your information"
- 404: Display "Book not found" (should not happen in normal flow)
- 409: Display "This book is already borrowed by [name]"
- 500: Display "Server error occurred, please try again"
- Network error: Display "Unable to connect to server"

### Loading State
- Disable borrow button while request in progress
- Show loading indicator (spinner or disabled state)
- Prevent duplicate submissions

---

## Testing Scenarios

### Happy Path
1. User provides valid borrower name
2. Selects available book
3. API returns 200 with updated book
4. Frontend removes book from available list

### Validation Errors
1. Empty borrowerName → 400 error
2. Empty bookId → 400 error
3. Invalid bookId format → 404 error

### Conflict Scenarios
1. Book already borrowed → 409 error
2. Concurrent borrow attempts → one succeeds (200), one fails (409)

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

- No authentication means anyone can borrow any book
- No authorization checks on borrower identity
- Potential for abuse (spam borrow/return operations)
- Consider rate limiting on backend (out of scope for current spec)

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-10 | Initial contract definition |

---

## Notes

- This is a state-changing operation (POST)
- No authentication required (per spec requirements)
- borrowerName is free text - no email/phone validation
- Frontend should validate borrowerName is non-empty before sending request
- Backend is source of truth - frontend does optimistic update but should handle conflicts
