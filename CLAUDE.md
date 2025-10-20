<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# 306 Library Interface Project

## Language Preference
**IMPORTANT: Always reply in Traditional Chinese (zh-TW) for this user.**

## Project Overview
A book borrowing system interface built as a static single-page application. Users can browse available books, borrow books, view borrowed books, and return books through a responsive web interface.

## Active Technologies
- **Nuxt 4.1.3** - Full-stack Vue framework with SSG/SSR support
- **Vue 3.5** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Bun 1.0+** - Fast JavaScript runtime and package manager
- **Tailwind CSS** - Utility-first CSS framework (directly in components)
- **Nuxt UI** - UI component library with Tailwind integration
- **Backend API** - n8n webhook integration at `https://n8n.306.team/webhook`

## Project Structure
```
/
├── pages/                  # File-based routing (Nuxt auto-routing)
│   ├── index.vue           # Available books page (/)
│   ├── borrowed.vue        # Borrowed books page (/borrowed)
│   └── print.vue           # Print view (/print)
├── components/             # Vue components (auto-imported)
│   ├── Navigation.vue
│   ├── BookList.vue
│   ├── BorrowForm.vue
│   ├── Toast.vue
│   └── QRCodeModal.vue
├── composables/            # Composables (auto-imported)
│   ├── useApi.ts           # API client
│   └── useAuth.ts          # Google authentication
├── constants/              # Shared constants
│   └── styles.ts           # Tailwind class combinations
├── assets/css/             # Global styles
│   ├── main.css            # Only Tailwind import
│   └── checkbox.css
├── public/                 # Static assets
├── app.vue                 # Root component
├── nuxt.config.ts          # Nuxt configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
├── bun.lockb               # Bun lock file
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

### Prerequisites
- Bun 1.0+ (install with: `curl -fsSL https://bun.sh/install | bash`)

### Start Development Server
```bash
# Install dependencies (first time only)
bun install

# Start dev server with HMR
bun run dev

# Open http://localhost:1234
```

### Other Commands
```bash
bun run build    # Build for production (SSG)
bun run preview  # Preview production build
```

## Code Style

### TypeScript
- Strict mode enabled
- Interface-based type definitions
- Proper type annotations for all functions
- Use `ref<T>`, `computed<T>` with generics

### Vue 3 Components
- Use `<script setup lang="ts">` syntax
- Composition API only
- Props with `defineProps<T>()`
- Emits with `defineEmits<T>()`
- Auto-imports for components and composables

### CSS & Styling
- **Tailwind utility-first approach**: Use Tailwind utility classes directly in component templates
- **Shared style constants**: Reusable class combinations stored in `constants/styles.ts`
- **Component-specific constants**: Extract repeated styles as TypeScript constants within components
- **Mobile-first responsive design**: Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:)
- **Dark mode**: Use Tailwind's `dark:` variant for dark mode styles
- **Animations**: Use Tailwind's animate utilities or Vue `<Transition>` components
- **No custom CSS classes**: All styling done via utility classes or constants

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
bun run dev      # Start dev server (http://localhost:1234)
bun run build    # Build for production
bun run preview  # Preview production build
bun install      # Install/update dependencies
bun add <pkg>    # Add new dependency
```

### TypeScript
```bash
npx nuxt typecheck  # Run type checking
```

### Testing
- Follow `tests/manual-test-plan.md` for comprehensive testing
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Test responsive design at different viewports

### Deployment
- Run `bun run build` to generate static site
- Deploy `.output/public/` directory to hosting service
- Compatible with: GitHub Pages, Netlify, Vercel, Cloudflare Pages
- Ensure API CORS is configured correctly

## Recent Changes
- 2025-10-20: **Migrated to Tailwind utility classes** - Removed all custom CSS
  - Removed all custom CSS classes from `main.css` (now only contains `@import "tailwindcss"`)
  - Created `constants/styles.ts` with shared Tailwind class combinations
  - Migrated all components to use Tailwind utilities directly
  - Replaced `@keyframes` animations with Vue Transitions
  - Moved global styles to `app.vue`
  - Build size reduced, improved maintainability
- 2025-10-20: **Migrated to Nuxt 4 + Bun** - Complete architecture rewrite
  - Moved from CDN Vue to Nuxt 4 framework
  - Added TypeScript support with strict mode
  - Converted all components to `.vue` SFC format
  - Created composables for API and Auth
  - Implemented file-based routing
  - Added SSG build support
  - Using Bun for package management
- 2025-10-12: Updated to use `name` field instead of `title`
- 2025-10-12: Added `number` (call number) display
- 2025-10-12: Made `author` field optional
- 2025-10-12: Configured for n8n webhook API
- 2025-10-10: Initial implementation complete (40 tasks)

## Notes
- No automated tests (manual testing only per user request)
- Nuxt 4 with Vite for fast HMR during development
- TypeScript for type safety
- Bun for ultra-fast package installation
- Auto-imports for components and composables
- Optimistic UI updates for better UX
- All API errors handled gracefully
- SSG mode for static deployment

<!-- MANUAL ADDITIONS START -->

## Custom Instructions
- **Language**: Always respond in Traditional Chinese (zh-TW) to this user
- **Framework**: Vue 3 CDN build (no npm, no build tools)
- **API**: n8n webhook backend at 306.team domain
- **Data Format**: Direct array responses, use `name` not `title`

<!-- MANUAL ADDITIONS END -->
