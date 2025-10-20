# Implementation Tasks: Migrate to Nuxt 4

## 1. Project Setup
- [ ] 1.1 Install Bun if not already installed (`curl -fsSL https://bun.sh/install | bash`)
- [ ] 1.2 Initialize Nuxt 4 project with `bunx nuxi@latest init`
- [ ] 1.3 Configure `nuxt.config.ts` (SSG mode, modules, CSS)
- [ ] 1.4 Set up `tsconfig.json` for TypeScript support
- [ ] 1.5 Update `.gitignore` (add `node_modules/`, `.nuxt/`, `.output/`, `bun.lockb`)
- [ ] 1.6 Create project structure (`pages/`, `components/`, `composables/`, `assets/`)
- [ ] 1.7 Install dependencies with `bun add` (QR code library, Google Identity)

## 2. Migrate Core Infrastructure
- [ ] 2.1 Create `composables/useApi.ts` from `js/api.js`
- [ ] 2.2 Create `composables/useAuth.ts` from `js/auth.js`
- [ ] 2.3 Set up environment variables in `.env` (API_BASE_URL)
- [ ] 2.4 Configure Nuxt runtime config for API endpoints
- [ ] 2.5 Create `app.vue` as root component

## 3. Migrate Components
- [ ] 3.1 Convert `js/components/BookList.js` → `components/BookList.vue`
- [ ] 3.2 Convert `js/components/BorrowForm.js` → `components/BorrowForm.vue`
- [ ] 3.3 Convert `js/components/Navigation.js` → `components/Navigation.vue`
- [ ] 3.4 Convert `js/components/Toast.js` → `components/Toast.vue`
- [ ] 3.5 Convert `js/components/QRCodeModal.js` → `components/QRCodeModal.vue`

## 4. Migrate Pages
- [ ] 4.1 Create `pages/index.vue` from `js/pages/available.js` + `index.html`
- [ ] 4.2 Create `pages/borrowed.vue` from `js/pages/borrowed.js` + `borrowed.html`
- [ ] 4.3 Create `pages/print.vue` from `js/pages/print.js` + `print.html`
- [ ] 4.4 Set up page metadata (title, description) using `useHead()`

## 5. Migrate Styling
- [ ] 5.1 Move `css/styles.css` → `assets/css/main.css`
- [ ] 5.2 Move `css/checkbox-styles.css` → `assets/css/checkbox.css`
- [ ] 5.3 Import global CSS in `nuxt.config.ts`
- [ ] 5.4 Verify responsive design (320px - 2560px)
- [ ] 5.5 Test dark mode and print styles

## 6. Integrate External Services
- [ ] 6.1 Set up Google Identity Services (replace CDN with npm package or script tag in nuxt.config)
- [ ] 6.2 Integrate QR Code generation (use npm package like `qrcode` or `vue-qrcode-reader`)
- [ ] 6.3 Test Google login flow
- [ ] 6.4 Test QR code generation and modal display

## 7. API Integration
- [ ] 7.1 Test `getAvailableBooks()` API call
- [ ] 7.2 Test `borrowBook()` API call
- [ ] 7.3 Test `getBorrowedBooks()` API call
- [ ] 7.4 Test `returnBook()` API call
- [ ] 7.5 Test `findUserName()` API call
- [ ] 7.6 Verify error handling and loading states

## 8. Features Verification
- [ ] 8.1 Verify book browsing (display name, number, author)
- [ ] 8.2 Verify borrow modal form
- [ ] 8.3 Verify borrowed books view with keeper mode
- [ ] 8.4 Verify return functionality
- [ ] 8.5 Verify QR code display
- [ ] 8.6 Verify print mode
- [ ] 8.7 Verify Google account integration
- [ ] 8.8 Verify toast notifications
- [ ] 8.9 Verify skeleton loading states

## 9. Accessibility & UX
- [ ] 9.1 Verify ARIA labels on all interactive elements
- [ ] 9.2 Test keyboard navigation
- [ ] 9.3 Verify focus indicators
- [ ] 9.4 Test skip-to-content link
- [ ] 9.5 Verify semantic HTML structure

## 10. Testing (Manual)
- [ ] 10.1 Test on Chrome (latest)
- [ ] 10.2 Test on Firefox (latest)
- [ ] 10.3 Test on Safari (latest)
- [ ] 10.4 Test on Edge (latest)
- [ ] 10.5 Test on mobile devices (iOS Safari, Android Chrome)
- [ ] 10.6 Follow `tests/manual-test-plan.md` checklist
- [ ] 10.7 Test all viewports (320px, 768px, 1024px, 1920px)

## 11. Build & Deployment
- [ ] 11.1 Run `bun run build` (SSG mode)
- [ ] 11.2 Test production build locally (`bun run preview`)
- [ ] 11.3 Verify `.output/public/` contains all static assets
- [ ] 11.4 Update deployment configuration (GitHub Pages or hosting platform)
- [ ] 11.5 Configure CORS if needed for API endpoints

## 12. Documentation
- [ ] 12.1 Update README.md with new setup instructions (Bun installation, commands)
- [ ] 12.2 Update CLAUDE.md with Nuxt 4 + Bun tech stack
- [ ] 12.3 Document Bun scripts (`bun run dev`, `bun run build`, `bun run preview`)
- [ ] 12.4 Document environment variables
- [ ] 12.5 Update deployment instructions

## 13. Cleanup
- [ ] 13.1 Remove old `index.html`, `borrowed.html`, `print.html`
- [ ] 13.2 Remove `js/` directory
- [ ] 13.3 Remove old `css/` directory
- [ ] 13.4 Archive old files to `legacy/` branch (optional)
- [ ] 13.5 Clean up unused dependencies
