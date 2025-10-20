# 306 Library Interface

A modern book borrowing system interface built with Nuxt 4 and Bun.

## Tech Stack

- **Nuxt 4.1.3** - Full-stack Vue framework with SSG/SSR support
- **Vue 3.5** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Bun 1.0+** - Fast JavaScript runtime and package manager
- **Vanilla CSS** - Mobile-first responsive design
- **n8n Webhooks** - Backend API integration

## Features

- 📚 Browse available books
- 🔖 Borrow books with Google account integration
- 📋 View borrowed books with due date tracking
- 🔄 Return books (Keeper mode)
- 📱 QR code generation for books
- 🖨️ Print borrowed books list
- ♿ Fully accessible (ARIA labels, keyboard navigation)
- 📱 Responsive design (320px - 2560px)

## Setup

### Prerequisites

- **Bun 1.0+** (包含 Node.js 相容層)

Install Bun if not already installed:
```bash
curl -fsSL https://bun.sh/install | bash
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd 306-library-interface

# Install dependencies
bun install
```

### Environment Variables

Create a `.env` file in the project root:

```env
NUXT_PUBLIC_API_BASE_URL=https://n8n.306.team/webhook/
```

## Development

```bash
# Start development server
bun run dev

# Open http://localhost:1234
```

### Available Commands

```bash
bun run dev      # Start development server with HMR
bun run build    # Build for production (SSG mode)
bun run preview  # Preview production build locally
bun run generate # Generate static site (alias for build)
bun run postinstall # Prepare Nuxt types (runs automatically)
```

## Project Structure

```
/
├── pages/              # File-based routing
│   ├── index.vue       # Available books page (/)
│   ├── borrowed.vue    # Borrowed books page (/borrowed)
│   └── print.vue       # Print view (/print)
├── components/         # Vue components (auto-imported)
│   ├── Navigation.vue
│   ├── BookList.vue
│   ├── BorrowForm.vue
│   ├── Toast.vue
│   └── QRCodeModal.vue
├── composables/        # Composables (auto-imported)
│   ├── useApi.ts       # API client
│   └── useAuth.ts      # Google authentication
├── assets/css/         # Global styles
│   ├── main.css
│   └── checkbox.css
├── public/             # Static assets
├── nuxt.config.ts      # Nuxt configuration
├── tsconfig.json       # TypeScript configuration
└── .env                # Environment variables
```

## Build & Deployment

### Build for Production

```bash
# Generate static site
bun run build

# Output will be in .output/public/
```

### Deploy to GitHub Pages

1. Build the project:
   ```bash
   bun run build
   ```

2. Deploy the `.output/public/` directory to your hosting service

3. Ensure CORS is configured for the n8n webhook API

### Deploy to Other Platforms

The `.output/public/` directory contains a fully static site that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Any static hosting service

## API Integration

### Endpoints

The application uses n8n webhook endpoints:

- `getAvailableBooks` - GET available books list
- `borrowBook` - POST borrow a book
- `getBorrowedBooks` - GET borrowed books list
- `returnBook` - PATCH return a book
- `findUserName` - POST find user by email

### Data Format

Books use the following schema:
```typescript
interface Book {
  id: string
  name: string        // Note: Uses 'name', not 'title'
  number: string      // Call number (e.g., "A01-1")
  author?: string     // Optional
  borrowerName?: string
  borrowedAt?: string
}
```

## Features

### Keeper Mode

Add `?mode=keeper` to URL for additional features:
- View QR codes for books
- Return borrowed books
- Print mode with book selection

Examples:
- Available books (keeper): `http://localhost:1234/?mode=keeper`
- Borrowed books (keeper): `http://localhost:1234/borrowed?mode=keeper`

### Google Authentication

Books can only be borrowed by users logged in with 306 employee Google accounts.
The Google Identity Services SDK is loaded automatically.

## Testing

Manual testing checklist available in `tests/manual-test-plan.md`

### Test on Multiple Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Test Responsive Design
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus indicators
- Skip-to-content link
- Semantic HTML structure

## TypeScript

Type checking:
```bash
# Run type check
npx nuxt typecheck
```

TypeScript is configured with strict mode for better type safety.

## License

Proprietary - 306 Team

## Support

For issues or questions, please contact the 306 development team.
