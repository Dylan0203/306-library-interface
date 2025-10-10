# API Contract: Get Borrowed Books

**Endpoint**: `GET /books/borrowed`  
**Purpose**: Retrieve list of all books currently borrowed with borrower information  
**Authentication**: None required

---

## Request

### HTTP Method
`GET`

### Headers
```
Accept: application/json
```

### Query Parameters
None

### Request Body
None

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
  "books": [
    {
      "id": "string",
      "title": "string",
      "author": "string",
      "status": "borrowed",
      "borrowerName": "string",
      "borrowedAt": "string (ISO 8601)"
    }
  ]
}
```

**Field Descriptions**:
- `books` (array): List of borrowed books
  - `id` (string, required): Unique book identifier
  - `title` (string, required): Book title
  - `author` (string, required): Author name
  - `status` (string, required): Always `"borrowed"` for this endpoint
  - `borrowerName` (string, required): Name/ID of person who borrowed the book
  - `borrowedAt` (string, optional): ISO 8601 timestamp when book was borrowed

**Example**:
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

**Empty Result**:
```json
{
  "books": []
}
```

---

### Error Responses

**Status Code**: `500 Internal Server Error`

**Body**:
```json
{
  "error": "string",
  "code": "string"
}
```

**Example**:
```json
{
  "error": "Database connection failed",
  "code": "DB_ERROR"
}
```

---

**Status Code**: `503 Service Unavailable`

**Body**:
```json
{
  "error": "Service temporarily unavailable",
  "code": "SERVICE_UNAVAILABLE"
}
```

---

## Behavior Specifications

### Filtering Logic
- Backend MUST filter to return only books with `status = "borrowed"`
- Books currently available MUST NOT appear in this response
- Empty array returned if no books are borrowed

### Response Time
- Target: < 1 second for typical catalog size (< 1000 books)
- Same performance characteristics as available books endpoint

### Data Freshness
- Response reflects current database state
- No caching on server side (or very short TTL < 5 seconds)

### Sort Order
- Books returned in consistent order (recommendation: by borrowedAt descending - most recently borrowed first)
- Frontend may apply additional sorting

---

## Frontend Integration

### Usage Example
```javascript
import { api } from './api.js';

async function loadBorrowedBooks() {
  const result = await api.getBorrowedBooks();
  
  if (result.success) {
    this.books = result.data.books;
    this.error = null;
  } else {
    this.error = result.error || 'Failed to load borrowed books';
    this.books = [];
  }
}
```

### Error Handling
- Network errors: Display "Unable to connect to server"
- 500 errors: Display "Server error occurred, please try again"
- 503 errors: Display "Service temporarily unavailable"
- Empty result: Display "No books currently borrowed"

### Display Requirements
- Show borrower name prominently with each book
- Optionally show how long book has been borrowed (calculate from borrowedAt)
- Truncate long borrower names with ellipsis

---

## Testing Scenarios

### Happy Path
1. API returns array with 1+ borrowed books
2. Each book has all required fields including borrowerName
3. Frontend displays books with borrower info

### Edge Cases
1. Empty array (no borrowed books)
2. Single book in array
3. Large array (100+ books)
4. Books with very long borrower names (test truncation)
5. Books without borrowedAt field (optional field)

### Error Cases
1. Network failure (offline mode)
2. Server returns 500
3. Server returns malformed JSON
4. Server returns 200 with missing required fields

---

## CORS Requirements

Backend MUST include CORS headers to allow GitHub Pages domain:

```
Access-Control-Allow-Origin: https://<username>.github.io
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

Or allow all origins for public API:
```
Access-Control-Allow-Origin: *
```

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-10 | Initial contract definition |

---

## Notes

- This endpoint is read-only (GET)
- No authentication required (public access)
- Anyone can see who borrowed which book (no privacy filtering)
- Backend handles concurrency - if book returned after fetch, frontend shows stale data until next fetch
- Frontend refreshes after successful return operation on same page
- `borrowedAt` field is optional - frontend should handle its absence gracefully
