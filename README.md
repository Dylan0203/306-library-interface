# Library Book Borrowing System

A simple, responsive web interface for browsing and borrowing books from a library system.

## Features

- **Browse Available Books**: View all books available for borrowing
- **Borrow Books**: Select a book and provide your name/ID to borrow it
- **View Borrowed Books**: See all currently borrowed books with borrower information
- **Return Books**: Return borrowed books with a simple click
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Real-time Updates**: UI updates instantly after transactions

## Technology Stack

- **Vue.js 3** (CDN-based, no build tools required)
- **Vanilla JavaScript ES6+**
- **CSS3** with mobile-first responsive design
- **GitHub Pages** for hosting

## Project Structure

```
├── index.html              # Available books page (entry point)
├── borrowed.html           # Borrowed books page
├── css/
│   └── styles.css          # All application styles
├── js/
│   ├── api.js              # API client for backend communication
│   ├── components/         # Reusable Vue components
│   │   ├── BookList.js     # Book list display component
│   │   ├── BorrowForm.js   # Borrow modal form
│   │   ├── Navigation.js   # Page navigation
│   │   └── Toast.js        # Toast notifications
│   └── pages/              # Page-specific logic
│       ├── available.js    # Available books page logic
│       └── borrowed.js     # Borrowed books page logic
└── tests/
    └── manual-test-plan.md # Manual testing checklist
```

## Setup Instructions

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge - last 2 versions)
- A simple HTTP server for local development (optional but recommended)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd 306-library-interface
   ```

2. **Configure API URL**:
   - Open `js/api.js`
   - Update the `API_BASE_URL` constant with your backend API URL:
     ```javascript
     const API_BASE_URL = "https://your-api-domain.com";
     ```

3. **Run a local server** (recommended):
   
   **Option 1: Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Option 2: Node.js (http-server)**
   ```bash
   npx http-server -p 8000
   ```
   
   **Option 3: VS Code Live Server**
   - Install the "Live Server" extension
   - Right-click `index.html` and select "Open with Live Server"

4. **Open in browser**:
   - Navigate to `http://localhost:8000`
   - The available books page will load automatically

### API Configuration

The application expects four backend API endpoints:

1. **GET `/books/available`** - Returns list of available books
   ```json
   {
     "books": [
       {
         "id": "string",
         "title": "string",
         "author": "string"
       }
     ]
   }
   ```

2. **POST `/books/borrow`** - Borrows a book
   ```json
   // Request
   {
     "bookId": "string",
     "borrowerName": "string"
   }
   
   // Response
   {
     "book": { "id": "string", "title": "string", "author": "string" }
   }
   ```

3. **GET `/books/borrowed`** - Returns list of borrowed books
   ```json
   {
     "books": [
       {
         "id": "string",
         "title": "string",
         "author": "string",
         "borrowerName": "string",
         "borrowedAt": "ISO 8601 date string"
       }
     ]
   }
   ```

4. **POST `/books/return`** - Returns a book
   ```json
   // Request
   {
     "bookId": "string"
   }
   
   // Response
   {
     "book": { "id": "string", "title": "string", "author": "string" }
   }
   ```

**Note**: The API must support CORS for the frontend to make requests.

## Deployment to GitHub Pages

1. **Prepare your repository**:
   - Ensure all paths are relative (no absolute paths)
   - Verify `API_BASE_URL` is configured correctly

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Source", select the branch (usually `main` or `master`)
   - Select root folder `/` as the source
   - Click "Save"

3. **Access your site**:
   - GitHub Pages will provide a URL like: `https://username.github.io/repository-name/`
   - The site will be live in a few minutes

4. **Custom Domain** (optional):
   - In repository settings > Pages, add your custom domain
   - Create a `CNAME` file in the root with your domain name
   - Configure DNS records with your domain provider

## Browser Compatibility

Tested and supported on:
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

Minimum viewport width: 320px (mobile devices)
Maximum tested viewport: 2560px (large displays)

## Performance

- Page load: < 2 seconds
- API response rendering: < 1 second
- Optimistic UI updates for instant feedback

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators for keyboard users
- Semantic HTML structure
- Skip-to-content link
- Responsive text sizing
- Color contrast compliance

## Manual Testing

See `tests/manual-test-plan.md` for a comprehensive testing checklist.

## Architecture Decisions

- **No build tools**: Uses Vue 3 global build from CDN for simplicity
- **ES6 Modules**: Browser-native module system
- **Component-based**: Reusable Vue components for maintainability
- **API abstraction**: Centralized API client with error handling
- **Mobile-first CSS**: Base styles for small screens, enhanced for larger
- **Optimistic updates**: UI updates immediately for better UX

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:
- Ensure your backend API has CORS enabled
- Check that the API URL is correct in `js/api.js`

### Blank Page
- Check browser console for errors
- Verify Vue CDN is loading (check Network tab)
- Ensure you're running a web server (not opening files directly)

### API Not Responding
- Verify the `API_BASE_URL` is correct
- Check that the backend is running and accessible
- Review network requests in browser DevTools

## License

[Your License Here]

## Contributing

[Contributing guidelines if applicable]
