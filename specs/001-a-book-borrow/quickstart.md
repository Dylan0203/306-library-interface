# Quickstart Guide: Book Borrowing System

**Feature**: 001-a-book-borrow  
**Date**: 2025-10-10  
**For**: Developers implementing the book borrowing interface

---

## Overview

This guide helps you quickly set up and understand the book borrowing system. The system is a static single-page application using Vue 3 via CDN, deployable to GitHub Pages.

**Tech Stack**:
- Vue 3 (CDN - no build tools)
- Vanilla JavaScript (ES6+)
- CSS3 (Grid/Flexbox)
- 4 Backend APIs (provided separately)

**Time to Complete**: ~30 minutes to understand structure and get started

---

## Prerequisites

### Required
- Text editor (VS Code, Sublime, etc.)
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Basic knowledge of HTML, CSS, JavaScript
- Basic knowledge of Vue 3 (helpful but not required)

### Optional
- Local web server for testing (e.g., `python -m http.server`)
- Git for version control
- GitHub account for deployment

### Backend APIs
You'll need the base URL for the backend APIs. The system expects 4 endpoints:
1. `GET /books/available` - List available books
2. `GET /books/borrowed` - List borrowed books
3. `POST /books/borrow` - Borrow a book
4. `POST /books/return` - Return a book

**Action**: Get the API base URL from your backend team and update `js/api.js` (see Setup section).

---

## Quick Setup (5 minutes)

### 1. Clone or Create Project Structure

Create the following directory structure:

```
project-root/
├── index.html              # Available books page
├── borrowed.html           # Borrowed books page
├── css/
│   └── styles.css
├── js/
│   ├── api.js              # API client
│   ├── components/
│   │   ├── BookList.js
│   │   ├── BorrowForm.js
│   │   └── Navigation.js
│   └── pages/
│       ├── available.js
│       └── borrowed.js
└── tests/
    └── manual-test-plan.md
```

### 2. Configure API Base URL

Edit `js/api.js` and update the base URL:

```javascript
const API_BASE_URL = 'https://your-api-domain.com'; // Replace with actual URL
```

### 3. Test Locally

**Option A: Using Python**
```bash
cd project-root
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option B: Using Node.js**
```bash
npx http-server -p 8000
```

**Option C: Using VS Code**
Install "Live Server" extension and right-click `index.html` → "Open with Live Server"

### 4. Verify Setup

- Navigate to `http://localhost:8000`
- You should see the Available Books page (may be empty if API not configured)
- Check browser console for any errors
- Try clicking navigation to Borrowed Books page

---

## Key Files Explained

### `index.html` - Available Books Page

The main entry point. Loads Vue 3 from CDN and initializes the available books page.

**Structure**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Available Books - Library System</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <div id="app"></div>
  
  <!-- Vue 3 from CDN -->
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  
  <!-- Your app code -->
  <script type="module" src="js/pages/available.js"></script>
</body>
</html>
```

### `borrowed.html` - Borrowed Books Page

Similar structure to `index.html` but loads borrowed books logic.

### `js/api.js` - API Client

Centralized API communication layer. All API calls go through here.

**Key Functions**:
```javascript
export const api = {
  getAvailableBooks: () => apiRequest('/books/available'),
  getBorrowedBooks: () => apiRequest('/books/borrowed'),
  borrowBook: (bookId, borrowerName) => apiRequest('/books/borrow', {...}),
  returnBook: (bookId) => apiRequest('/books/return', {...})
};
```

**Usage in components**:
```javascript
import { api } from '../api.js';

const result = await api.getAvailableBooks();
if (result.success) {
  this.books = result.data.books;
}
```

### `js/components/` - Reusable Vue Components

Small, focused components used across pages:
- **BookList.js**: Displays list of books (used on both pages)
- **BorrowForm.js**: Modal for borrowing a book
- **Navigation.js**: Page navigation header

### `js/pages/` - Page-Level Logic

Each page has its own file with Vue app definition:
- **available.js**: Available books page logic
- **borrowed.js**: Borrowed books page logic

### `css/styles.css` - Shared Styles

Single CSS file with mobile-first responsive design.

---

## Development Workflow

### Making Changes

1. **Edit files** in your text editor
2. **Refresh browser** to see changes (no build step!)
3. **Check console** for errors
4. **Test on different screen sizes** (use browser DevTools)

### Adding a New Component

1. Create file in `js/components/`
2. Export component definition:
   ```javascript
   export const MyComponent = {
     props: ['data'],
     template: `<div>{{ data }}</div>`,
     methods: { ... }
   };
   ```
3. Import in page file:
   ```javascript
   import { MyComponent } from '../components/MyComponent.js';
   ```
4. Register in app:
   ```javascript
   const app = createApp({
     components: { MyComponent },
     ...
   });
   ```

### Testing Changes

1. **Manual testing**: Follow `tests/manual-test-plan.md`
2. **Browser DevTools**: Network tab for API calls, Console for errors
3. **Responsive testing**: DevTools device toolbar (Ctrl+Shift+M / Cmd+Shift+M)

---

## Common Tasks

### Task: Fetch and Display Books

```javascript
// In page component
data() {
  return {
    books: [],
    loading: true,
    error: null
  }
},
async mounted() {
  await this.loadBooks();
},
methods: {
  async loadBooks() {
    this.loading = true;
    this.error = null;
    
    const result = await api.getAvailableBooks();
    
    if (result.success) {
      this.books = result.data.books;
    } else {
      this.error = result.error;
    }
    
    this.loading = false;
  }
}
```

### Task: Borrow a Book

```javascript
async borrowBook(bookId) {
  if (!this.borrowerName.trim()) {
    this.error = 'Please enter your name';
    return;
  }
  
  this.loading = true;
  const result = await api.borrowBook(bookId, this.borrowerName);
  
  if (result.success) {
    // Optimistic update: remove from list
    this.books = this.books.filter(b => b.id !== bookId);
    this.borrowerName = '';
    this.showSuccessToast('Book borrowed!');
  } else {
    this.error = result.error;
  }
  
  this.loading = false;
}
```

### Task: Handle Errors Gracefully

```javascript
// In API client
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      return { 
        success: false, 
        error: `Server error: ${response.status}`
      };
    }
    
    const data = await response.json();
    return { success: true, data };
    
  } catch (error) {
    console.error('API Error:', error);
    return { 
      success: false, 
      error: 'Unable to connect to server'
    };
  }
}
```

---

## Deployment to GitHub Pages

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Book borrowing system"
git branch -M main
git remote add origin https://github.com/username/repo-name.git
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to repository Settings
2. Navigate to "Pages" section
3. Source: Deploy from branch
4. Branch: `main`, folder: `/ (root)`
5. Click "Save"

### Step 3: Update API CORS

Ensure backend API allows requests from:
```
https://username.github.io
```

### Step 4: Access Your Site

Visit: `https://username.github.io/repo-name/`

**Note**: Changes may take 1-2 minutes to appear after pushing.

---

## Troubleshooting

### Issue: Vue is not defined

**Symptom**: Console error: `Uncaught ReferenceError: Vue is not defined`

**Solution**: Check that Vue CDN script loads before your app scripts:
```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script type="module" src="js/pages/available.js"></script>
```

---

### Issue: CORS Error

**Symptom**: Console error: `Access to fetch at '...' has been blocked by CORS policy`

**Solution**: Backend must include CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

Contact backend team to add these headers.

---

### Issue: Module Not Found

**Symptom**: Console error: `Failed to load module script: ...`

**Solution**: 
1. Check file path is correct (case-sensitive!)
2. Ensure `type="module"` in script tag
3. Serve via HTTP (not `file://`) - modules require a web server

---

### Issue: Empty Book List

**Symptom**: Page loads but shows "No books available"

**Possible Causes**:
1. API returning empty array (check backend)
2. API endpoint incorrect (check `js/api.js` base URL)
3. Network error (check browser Network tab)

**Debug Steps**:
1. Open browser DevTools → Network tab
2. Refresh page
3. Look for API request - did it succeed (200)?
4. Click request → Response tab - what data returned?

---

### Issue: Changes Not Appearing

**Symptom**: Made code changes but page looks the same

**Solutions**:
1. Hard refresh: Ctrl+F5 (Windows) / Cmd+Shift+R (Mac)
2. Clear browser cache
3. Check you saved the file
4. Check you're editing the right file (not a copy)

---

## Next Steps

After setup:

1. **Read the Spec**: Review `spec.md` for requirements
2. **Review Contracts**: Check `contracts/` for API details
3. **Study Data Model**: See `data-model.md` for data structures
4. **Review Research**: Read `research.md` for technical decisions
5. **Start Implementing**: Follow `tasks.md` for implementation order (generated by `/speckit.tasks`)

---

## Useful Resources

### Vue 3 Documentation
- Official Guide: https://vuejs.org/guide/
- API Reference: https://vuejs.org/api/
- Examples: https://vuejs.org/examples/

### JavaScript Modules
- MDN ES Modules: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

### CSS Grid & Flexbox
- CSS Grid Guide: https://css-tricks.com/snippets/css/complete-guide-grid/
- Flexbox Guide: https://css-tricks.com/snippets/css/a-guide-to-flexbox/

### Fetch API
- MDN Fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

### GitHub Pages
- Documentation: https://docs.github.com/en/pages

---

## Getting Help

### Check First
1. Browser console for errors
2. Network tab for failed API calls
3. This quickstart guide
4. `research.md` for technical decisions
5. API contracts in `contracts/` folder

### Common Gotchas
- Forgot to update API base URL in `js/api.js`
- Not serving via HTTP (file:// won't work with modules)
- CORS not configured on backend
- Vue CDN script not loaded before app code
- Case-sensitive file paths (especially on Linux/Mac)

---

## Development Tips

1. **Use Browser DevTools**: Your best friend for debugging
2. **Console.log Everything**: When in doubt, log it out
3. **Test in Multiple Browsers**: Edge cases differ
4. **Mobile First**: Start with mobile layout, enhance for desktop
5. **Keep It Simple**: No build tools means fast iteration - enjoy it!
6. **Read Error Messages**: They usually tell you exactly what's wrong
7. **Git Commit Often**: Small, frequent commits make reverting easier

---

## Project Structure Recap

```
/
├── index.html           # Entry point - Available Books
├── borrowed.html        # Borrowed Books page
├── css/
│   └── styles.css       # All styles (mobile-first)
├── js/
│   ├── api.js           # API client (configure URL here)
│   ├── components/      # Reusable Vue components
│   └── pages/           # Page-specific Vue apps
└── tests/
    └── manual-test-plan.md  # Testing checklist
```

**Total Files**: ~10 files (very manageable!)

---

## Success Criteria

You've successfully set up the project when:

- ✅ Local server running and pages load
- ✅ Navigation works between pages
- ✅ API calls visible in Network tab (even if they fail)
- ✅ No console errors (except maybe API errors if backend not ready)
- ✅ Responsive design works on mobile and desktop

**You're ready to start implementing!**

Next command: `/speckit.tasks` to generate implementation tasks.
