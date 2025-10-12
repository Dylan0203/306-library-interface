# 306 Library Interface Project

## Language Preference
**IMPORTANT: Always reply in Traditional Chinese (zh-TW) for this user.**

## Project Overview
A book borrowing system interface built as a static single-page application. Users can browse available books, borrow books, view borrowed books, and return books through a responsive web interface.

## Active Technologies
- **JavaScript ES6+** - Modern browser support (Chrome, Firefox, Safari, Edge - last 2 versions)
- **Vue 3.x** - CDN-based (no build tools required)
- **Vanilla CSS** - Mobile-first responsive design
- **Backend API** - n8n webhook integration at `https://n8n.306.team/webhook`

## Project Structure
```
/
├── index.html              # Available books page (entry point)
├── borrowed.html           # Borrowed books page
├── css/
│   └── styles.css          # All application styles
├── js/
│   ├── api.js              # API client (n8n webhook integration)
│   ├── components/         # Vue components
│   │   ├── BookList.js     # Book list display
│   │   ├── BorrowForm.js   # Borrow modal form
│   │   ├── Navigation.js   # Page navigation
│   │   └── Toast.js        # Toast notifications
│   └── pages/              # Page logic
│       ├── available.js    # Available books page
│       └── borrowed.js     # Borrowed books page
├── tests/
│   └── manual-test-plan.md # Manual testing checklist
└── README.md               # Full documentation
```

## API Data Format

### Available Books Response
```json
[
  {
    "id": "22",
    "name": "最後吃才是真領導",
    "number": "A01-1",
    "author": ""
  }
]
```

### Key Fields
- `name` - Book name (not `title`)
- `number` - Call number (e.g., "A01-1")
- `author` - Author name (can be empty)
- `id` - Unique book identifier

## Local Development

### Start Local Server
```bash
# Python 3
python3 -m http.server 8000

# Or Node.js
npx http-server -p 8000 -c-1
```

Then open: http://localhost:8000

## Code Style

### JavaScript ES6+
- Use ES6 modules (import/export)
- Async/await for API calls
- Arrow functions preferred
- Const/let (no var)
- Template literals for strings

### Vue Components
- Export as plain objects (no build tools)
- Use composition API patterns where possible
- Props with validation
- Emit events for parent communication

### CSS
- Mobile-first responsive design
- CSS custom properties for theming
- BEM-like naming for clarity
- Flexbox and Grid for layouts

## API Integration

Current endpoint: `https://n8n.306.team/webhook/d1bbd9dc-8c55-474f-8488-97524e56d0e6`

### Expected Endpoints
1. **GET** `/getAvailableBooks` - Returns array of available books
2. **POST** `/borrowBook` - Borrow a book
3. **GET** `/getBorrowedBooks` - Returns array of borrowed books  
4. **POST** `/returnBook` - Return a book

## Features Implemented

### User Stories
✅ **US1: Browse Available Books** - Display all available books with name, number, author
✅ **US2: Borrow a Book** - Modal form with borrower name input
✅ **US3: Return Borrowed Books** - View and return borrowed books

### UI/UX Features
- Responsive design (320px - 2560px)
- Skeleton loading screens
- Toast notifications
- Error handling with retry
- Optimistic UI updates
- Text truncation with tooltips

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus indicators
- Skip-to-content link
- Semantic HTML (nav, main, article)

## Commands

### Development
```bash
# Start local server
python3 -m http.server 8000
# or
npx http-server -p 8000

# No build process needed - direct file serving
```

### Testing
- Follow `tests/manual-test-plan.md` for comprehensive testing
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Test responsive design at different viewports

### Deployment
- Deploy to GitHub Pages (static file hosting)
- Ensure API CORS is configured correctly
- All paths are relative (ready for deployment)

## Recent Changes
- 2025-10-12: Updated to use `name` field instead of `title`
- 2025-10-12: Added `number` (call number) display
- 2025-10-12: Made `author` field optional
- 2025-10-12: Configured for n8n webhook API
- 2025-10-10: Initial implementation complete (40 tasks)

## Notes
- No automated tests (manual testing only per user request)
- Vue 3 loaded from CDN (unpkg.com)
- Browser-native ES6 modules (no bundler)
- Optimistic UI updates for better UX
- All API errors handled gracefully

<!-- MANUAL ADDITIONS START -->

## Custom Instructions
- **Language**: Always respond in Traditional Chinese (zh-TW) to this user
- **Framework**: Vue 3 CDN build (no npm, no build tools)
- **API**: n8n webhook backend at 306.team domain
- **Data Format**: Direct array responses, use `name` not `title`

<!-- MANUAL ADDITIONS END -->
