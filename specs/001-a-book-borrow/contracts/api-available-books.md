# API Contract: Get Available Books

**Endpoint**: `GET /books/available`  
**Purpose**: Retrieve list of all books currently available for borrowing  
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
      "status": "available",
      "borrowerName": null
    }
  ]
}
```

**Field Descriptions**:
- `books` (array): List of available books
  - `id` (string, required): Unique book identifier
  - `title` (string, required): Book title
  - `author` (string, required): Author name
  - `status` (string, required): Always `"available"` for this endpoint
  - `borrowerName` (null, required): Always `null` for available books

**Example**:
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
- Backend MUST filter to return only books with `status = "available"`
- Books currently borrowed MUST NOT appear in this response
- Empty array returned if no books are available

### Response Time
- Target: < 1 second for typical catalog size (< 1000 books)
- Consider pagination if catalog exceeds 1000 books (out of scope for current spec)

### Data Freshness
- Response reflects current database state
- No caching on server side (or very short TTL < 5 seconds)

### Sort Order
- Books returned in consistent order (recommendation: by title ascending)
- Frontend may apply additional sorting

---

## Frontend Integration

### Usage Example
```javascript
import { api } from './api.js';

async function loadAvailableBooks() {
  const result = await api.getAvailableBooks();
  
  if (result.success) {
    this.books = result.data.books;
    this.error = null;
  } else {
    this.error = result.error || 'Failed to load books';
    this.books = [];
  }
}
```

### Error Handling
- Network errors: Display "Unable to connect to server"
- 500 errors: Display "Server error occurred, please try again"
- 503 errors: Display "Service temporarily unavailable"
- Empty result: Display "No books currently available"

### Retry Logic
- On network error: Allow manual retry via "Reload" button
- On 503: Consider auto-retry after 5 seconds (max 3 attempts)
- On 500: Do not auto-retry, require manual action

---

## Testing Scenarios

### Happy Path
1. API returns array with 1+ books
2. Each book has all required fields
3. Frontend displays books in UI

### Edge Cases
1. Empty array (no available books)
2. Single book in array
3. Large array (100+ books)
4. Books with very long titles/authors (test truncation)

### Error Cases
1. Network failure (offline mode)
2. Server returns 500
3. Server returns malformed JSON
4. Server returns 200 with missing fields

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
- Backend handles concurrency - if book borrowed after fetch, frontend shows stale data until next fetch
- Frontend refreshes after successful borrow operation on same page
