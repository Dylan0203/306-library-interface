# Research: Book Borrowing System

**Feature**: 001-a-book-borrow  
**Date**: 2025-10-10  
**Purpose**: Resolve technical unknowns and establish implementation patterns

## Research Questions

### 1. Testing Approach for Vue without Build Tools

**Decision**: Manual testing with documented test plan

**Rationale**:
- No build tools means no bundler-based test runners (Vitest, Jest)
- Browser-based testing (Playwright, Selenium) adds complexity for simple SPA
- Manual testing appropriate for small-scale project (2 pages, 4 APIs)
- Focus on comprehensive test scenarios rather than automated coverage

**Alternatives Considered**:
- **Playwright/Cypress E2E tests**: Rejected due to setup complexity for simple static site
- **QUnit/Mocha in browser**: Possible but adds testing framework dependencies; overkill for scope
- **Native ES modules + manual import in test HTML**: Viable but still requires test framework

**Implementation Approach**:
- Create `tests/manual-test-plan.md` with step-by-step scenarios
- Map each acceptance scenario from spec to test steps
- Include edge cases and error conditions
- Document expected vs actual results format
- Future: Can add automated tests if project scales

---

### 2. Vue 3 CDN Usage Patterns

**Decision**: Use Vue 3 Global Build via CDN with application-level component definitions

**Rationale**:
- Vue 3 provides `createApp()` API suitable for CDN usage
- No SFC (Single File Components) without build tools
- Component definitions using plain JavaScript objects
- Composition API available in global build
- Official Vue 3 CDN: `https://unpkg.com/vue@3/dist/vue.global.js`

**Alternatives Considered**:
- **Vue 2**: Rejected - older API, Vue 3 is current and better suited for composition
- **Petite-Vue**: Considered but less feature-complete; standard Vue 3 global build is fine for this scope
- **Alpine.js**: Different paradigm (directives-first); team specified Vue

**Implementation Approach**:
```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script type="module">
  const { createApp } = Vue;
  
  // Component definitions
  const BookList = {
    props: ['books', 'type'],
    template: `...`,
    // ... component logic
  };
  
  // App instance
  const app = createApp({
    components: { BookList },
    data() { return { ... } },
    methods: { ... }
  });
  
  app.mount('#app');
</script>
```

**Component Strategy**:
- Inline templates using template literals
- Composition API for complex state logic
- Options API for simple components
- Props for component communication
- Custom events for child-to-parent communication

---

### 3. API Client Pattern without Framework

**Decision**: Centralized API module with fetch wrapper and error handling

**Rationale**:
- Native `fetch()` API supported in all modern browsers
- Centralize error handling, headers, base URL configuration
- Return consistent response format (data/error)
- Easy to mock for future testing
- No need for axios or other HTTP libraries

**Alternatives Considered**:
- **Axios**: Rejected - adds 14KB dependency; fetch() is sufficient
- **Direct fetch() in components**: Rejected - violates DRY, inconsistent error handling
- **XMLHttpRequest**: Rejected - outdated, fetch() is modern standard

**Implementation Approach**:
```javascript
// js/api.js
const API_BASE_URL = 'https://api.example.com'; // Replace with actual URL

async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: error.message };
  }
}

export const api = {
  getAvailableBooks: () => apiRequest('/books/available'),
  getBorrowedBooks: () => apiRequest('/books/borrowed'),
  borrowBook: (bookId, borrowerName) => 
    apiRequest('/books/borrow', {
      method: 'POST',
      body: JSON.stringify({ bookId, borrowerName })
    }),
  returnBook: (bookId) =>
    apiRequest('/books/return', {
      method: 'POST',
      body: JSON.stringify({ bookId })
    })
};
```

**Error Handling Strategy**:
- Network errors: Show "Unable to connect" message
- HTTP errors: Show "Server error" with status code
- Malformed JSON: Show "Invalid response" message
- Timeout: Consider adding timeout wrapper (default 30s)

---

### 4. State Management Pattern

**Decision**: Vue reactive data in root component, props/events for child components

**Rationale**:
- Simple two-page app doesn't need Vuex/Pinia
- Vue's reactivity system sufficient for local state
- Each page manages its own book list state
- No shared state between pages (separate API calls)

**Alternatives Considered**:
- **Vuex/Pinia**: Rejected - overkill for 2 independent pages, adds complexity
- **Local storage**: Not needed - backend is source of truth
- **URL query params**: Not needed - no filtering/search requirements

**Implementation Approach**:
```javascript
// Page-level state
data() {
  return {
    books: [],
    loading: false,
    error: null,
    borrowerName: ''
  }
}

// Update after operations
async borrowBook(bookId) {
  this.loading = true;
  this.error = null;
  
  const result = await api.borrowBook(bookId, this.borrowerName);
  
  if (result.success) {
    // Remove from local list (optimistic update)
    this.books = this.books.filter(b => b.id !== bookId);
    this.borrowerName = ''; // Clear form
  } else {
    this.error = result.error;
  }
  
  this.loading = false;
}
```

---

### 5. Routing Strategy for Two Pages

**Decision**: Separate HTML files with shared JavaScript modules

**Rationale**:
- Only 2 pages - client-side routing (Vue Router) adds unnecessary complexity
- GitHub Pages serves static HTML files naturally
- Simpler mental model: traditional multi-page approach
- Shared navigation component provides consistency
- Page refresh acceptable (no SPA requirement beyond "no reload on actions")

**Alternatives Considered**:
- **Vue Router (CDN)**: Adds 15KB + complexity; overkill for 2 pages
- **Hash-based routing**: Possible but more complex than separate files
- **Single page with v-if toggle**: Rejected - loads both page logic unnecessarily

**Implementation Approach**:
```html
<!-- index.html (Available Books) -->
<!DOCTYPE html>
<html>
<head>
  <title>Available Books - Library System</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <div id="app">
    <navigation current="available"></navigation>
    <available-books-page></available-books-page>
  </div>
  
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script type="module" src="js/pages/available.js"></script>
</body>
</html>

<!-- borrowed.html (Borrowed Books) -->
<!-- Similar structure, different page component -->
```

Navigation component:
```javascript
const Navigation = {
  props: ['current'],
  template: `
    <nav>
      <a href="index.html" :class="{active: current === 'available'}">
        Available Books
      </a>
      <a href="borrowed.html" :class="{active: current === 'borrowed'}">
        Borrowed Books
      </a>
    </nav>
  `
};
```

---

### 6. CSS Strategy and Responsive Design

**Decision**: Single CSS file with mobile-first responsive design using CSS Grid/Flexbox

**Rationale**:
- Small project scope supports single stylesheet
- Modern CSS Grid/Flexbox for layouts (no Bootstrap needed)
- Mobile-first approach: base styles for 320px+, enhance for larger screens
- CSS custom properties for theming/consistency
- No preprocessor (Sass/Less) needed without build tools

**Alternatives Considered**:
- **Tailwind CSS**: Rejected - requires build process for purging
- **Bootstrap**: Rejected - 150KB+ overhead for simple layouts
- **Scoped styles per component**: Not possible without SFC build process

**Implementation Approach**:
```css
/* Mobile-first base styles */
:root {
  --primary-color: #2563eb;
  --success-color: #10b981;
  --error-color: #ef4444;
  --border-radius: 8px;
  --spacing-unit: 1rem;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: var(--spacing-unit);
  min-width: 320px;
}

/* Book list: stack on mobile, grid on tablet+ */
.book-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-unit);
}

@media (min-width: 768px) {
  .book-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .book-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Handle long text */
.book-title, .book-author, .borrower-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

### 7. Error Message Display Pattern

**Decision**: Toast-style notifications for operations, inline errors for forms

**Rationale**:
- Non-intrusive feedback for borrow/return operations
- Form validation errors displayed inline near input
- API errors shown as dismissible messages
- Visual consistency across pages

**Implementation Approach**:
```javascript
// Simple toast component
const Toast = {
  props: ['message', 'type'], // type: 'success' | 'error'
  emits: ['close'],
  template: `
    <div v-if="message" :class="['toast', type]">
      {{ message }}
      <button @click="$emit('close')" class="toast-close">×</button>
    </div>
  `
};

// Auto-dismiss after 5s
watch(() => props.message, (newMsg) => {
  if (newMsg) {
    setTimeout(() => emit('close'), 5000);
  }
});
```

---

## Technology Stack Summary

| Layer | Technology | Source |
|-------|------------|--------|
| Framework | Vue 3 | CDN (unpkg.com) |
| Language | JavaScript ES6+ | Browser native |
| HTTP Client | Fetch API | Browser native |
| Styling | CSS3 (Grid/Flexbox) | Browser native |
| Module System | ES Modules | Browser native |
| Hosting | GitHub Pages | GitHub |
| Testing | Manual test plan | Documentation-based |

**Total External Dependencies**: 1 (Vue 3 CDN)

**Browser Compatibility**: Modern browsers with ES6+ support (matches spec requirement)

---

## Implementation Best Practices

1. **Component Organization**
   - One component per file in `js/components/`
   - Export as named export for clarity
   - Import using ES module syntax

2. **API Integration**
   - Always use centralized `api.js` module
   - Handle loading states explicitly
   - Provide user feedback for all operations
   - Implement retry logic if needed

3. **Error Handling**
   - Never fail silently
   - Log errors to console for debugging
   - Show user-friendly messages
   - Distinguish network vs API errors

4. **Performance**
   - Minimize API calls (cache when appropriate)
   - Use Vue's reactivity efficiently
   - Avoid unnecessary re-renders
   - Optimize images/assets (if any added later)

5. **Accessibility**
   - Semantic HTML elements
   - ARIA labels where needed
   - Keyboard navigation support
   - Focus management in modals/forms

6. **Code Style**
   - Consistent naming (camelCase JS, kebab-case CSS)
   - Comments for non-obvious logic
   - Keep functions small and focused
   - Use async/await over promises

---

## Open Questions for Implementation Phase

1. **API Base URL**: Need actual backend URL to configure in `api.js`
2. **API Response Formats**: Need to confirm exact JSON structure from backend
3. **Book ID Format**: String, number, UUID? Affects type checking
4. **CORS Configuration**: Backend must allow GitHub Pages domain
5. **Error Code Mapping**: Specific error codes from backend for better UX?

These will be addressed in Phase 2 (tasks.md) or documented as implementation notes.
