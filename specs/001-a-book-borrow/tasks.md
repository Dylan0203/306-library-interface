# Tasks: Book Borrowing System

**Input**: Design documents from `/specs/001-a-book-borrow/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/  
**Tests**: No automated tests (per user request - manual testing only)  
**Organization**: Tasks grouped by user story for independent implementation

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Frontend-only application with root-level structure:
- `index.html`, `borrowed.html` - Page entry points
- `css/styles.css` - Shared styles
- `js/api.js` - API client
- `js/components/` - Reusable Vue components
- `js/pages/` - Page-specific logic

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] **T001** Create project directory structure (root: /, css/, js/, js/components/, js/pages/)
- [x] **T002** [P] Create placeholder `index.html` with Vue 3 CDN link and basic HTML structure
- [x] **T003** [P] Create placeholder `borrowed.html` with Vue 3 CDN link and basic HTML structure
- [x] **T004** [P] Create `css/styles.css` with CSS reset, root variables, and mobile-first base styles
- [x] **T005** Create `.gitignore` file for common frontend artifacts

**Checkpoint**: ✅ Basic project structure exists, pages can be opened in browser

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] **T006** Create `js/api.js` with base API client structure:
  - API_BASE_URL constant (placeholder for backend URL)
  - `apiRequest(endpoint, options)` wrapper function with fetch + error handling
  - Return format: `{success: boolean, data?: any, error?: string}`
  - Export empty `api` object ready for endpoint functions

- [x] **T007** [P] Create `js/components/Navigation.js`:
  - Export Navigation component definition
  - Props: `current` (string - 'available' or 'borrowed')
  - Template: nav element with links to index.html and borrowed.html
  - Highlight current page based on `current` prop
  - Responsive styling (stack on mobile, inline on desktop)

- [x] **T008** [P] Add global CSS for navigation component in `css/styles.css`:
  - Nav bar styles (flexbox layout)
  - Link styles (normal and active states)
  - Mobile responsive (padding, font sizes)

**Checkpoint**: ✅ Foundation ready - API client exists, navigation component created, user story implementation can begin

---

## Phase 3: User Story 1 - Browse Available Books (Priority: P1) 🎯 MVP

**Goal**: Display list of available books from API with error/empty state handling

**Independent Test**: Load index.html and verify:
1. Page displays available books (if API configured)
2. Empty state message shows if no books available
3. Error message shows if API fails
4. Layout responsive on mobile and desktop

### Implementation for User Story 1

- [x] **T009** [P] [US1] Add `getAvailableBooks()` function to `js/api.js`:
  - Call `apiRequest('/books/available')`
  - Return `{success, data: {books: []}, error}`
  - Export in api object

- [x] **T010** [P] [US1] Create `js/components/BookList.js`:
  - Export BookList component definition
  - Props: `books` (array), `type` (string: 'available' or 'borrowed'), `loading` (boolean), `error` (string | null)
  - Template: Display books in grid/list with title, author
  - Show "No books currently {type}" if empty array
  - Show error message if error prop present
  - Show loading spinner if loading=true
  - Emit events: 'borrow' (for available type), 'return' (for borrowed type)
  - Include action buttons based on type

- [x] **T011** [US1] Create `js/pages/available.js`:
  - Import Vue's `createApp` from global Vue
  - Import Navigation component
  - Import BookList component
  - Define app with data: `books: [], loading: true, error: null`
  - Mounted hook: call `api.getAvailableBooks()`, update state
  - Register Navigation and BookList components
  - Mount app to `#app`

- [x] **T012** [US1] Update `index.html`:
  - Add `<div id="app">` container with Vue template
  - Template: `<navigation current="available">`, `<h1>`, `<book-list>`
  - Include script module: `<script type="module" src="js/pages/available.js"></script>`
  - Ensure Vue CDN loads first

- [x] **T013** [P] [US1] Add CSS for BookList component in `css/styles.css`:
  - Book list grid (1 column mobile, 2-3 columns tablet/desktop)
  - Book card styles (border, padding, hover effects)
  - Empty state message styles
  - Error message styles (red background, icon)
  - Loading spinner styles

- [x] **T014** [US1] Add error handling in available.js:
  - Handle API network failures
  - Display user-friendly error messages
  - Provide "Retry" button that reloads books

**Checkpoint**: ✅ User Story 1 complete - available books page fully functional, independently testable

---

## Phase 4: User Story 2 - Borrow a Book (Priority: P2)

**Goal**: Allow users to borrow books by entering their name/ID, update list immediately

**Independent Test**: On available books page:
1. Click "Borrow" button on a book
2. Modal/form appears requesting borrower name
3. Enter name and confirm
4. Book disappears from available list
5. Success message displays
6. Error handling works (empty name, API errors)

### Implementation for User Story 2

- [x] **T015** [P] [US2] Add `borrowBook(bookId, borrowerName)` function to `js/api.js`:
  - Call `apiRequest('/books/borrow', {method: 'POST', body: JSON.stringify({bookId, borrowerName})})`
  - Return `{success, data: {book}, error}`
  - Export in api object

- [x] **T016** [P] [US2] Create `js/components/BorrowForm.js`:
  - Export BorrowForm component definition
  - Props: `book` (object | null) - book being borrowed
  - Data: `borrowerName` (string), `loading` (boolean), `error` (string | null)
  - Template: Modal overlay with form
    - Show book title
    - Input field for borrower name (required)
    - Cancel and Confirm buttons
    - Show validation error if name empty
  - Methods: `validateAndSubmit()` - emit 'confirm' event with {bookId, borrowerName}
  - Emit events: 'confirm', 'cancel'
  - Show modal only if book prop is not null

- [x] **T017** [US2] Update `js/pages/available.js`:
  - Add data properties: `borrowerName: ''`, `selectedBook: null`, `borrowing: false`
  - Add method `showBorrowForm(book)`: set `selectedBook = book`
  - Add method `async handleBorrow({bookId, borrowerName})`:
    - Set `borrowing = true`
    - Call `api.borrowBook(bookId, borrowerName)`
    - If success: remove book from `books` array, clear `selectedBook`, show success toast
    - If error: display error message
    - Set `borrowing = false`
  - Add method `cancelBorrow()`: clear `selectedBook`
  - Register BorrowForm component
  - Update template: add `<borrow-form>` with props and event handlers

- [x] **T018** [US2] Update BookList component in `js/components/BookList.js`:
  - Add "Borrow" button to each book card when `type="available"`
  - Button click emits 'borrow' event with book object
  - Disable button when loading

- [x] **T019** [US2] Update available.js template:
  - Wire BookList 'borrow' event to `showBorrowForm` method
  - Wire BorrowForm 'confirm' event to `handleBorrow` method
  - Wire BorrowForm 'cancel' event to `cancelBorrow` method

- [x] **T020** [P] [US2] Add CSS for BorrowForm component in `css/styles.css`:
  - Modal overlay (fixed, centered, semi-transparent background)
  - Modal content box (white, centered, responsive width)
  - Form styles (input, labels, buttons)
  - Validation error styles
  - Submit/cancel button styles
  - Loading state (disabled buttons, spinner)

- [x] **T021** [P] [US2] Create `js/components/Toast.js`:
  - Export Toast component definition
  - Props: `message` (string | null), `type` ('success' | 'error')
  - Template: Toast notification (appears top-right)
  - Auto-dismiss after 5 seconds
  - Emit 'close' event for manual dismiss

- [x] **T022** [US2] Update available.js to include Toast:
  - Add data: `toastMessage: null`, `toastType: 'success'`
  - Add method `showToast(message, type)`: set toast data, auto-clear after 5s
  - Register Toast component
  - Update template: add `<toast>` with props
  - Use toast in success/error scenarios

- [x] **T023** [P] [US2] Add CSS for Toast component in `css/styles.css`:
  - Toast container (fixed top-right, z-index high)
  - Success/error color variants
  - Slide-in animation
  - Close button styles

**Checkpoint**: User Story 2 complete - borrowing functionality works, UI updates immediately, error handling robust

---

## Phase 5: User Story 3 - Return a Borrowed Book (Priority: P3)

**Goal**: Display borrowed books with borrower info, allow any user to return books

**Independent Test**: 
1. Navigate to borrowed.html
2. See list of borrowed books with borrower names
3. Click "Return" on a book
4. Confirm return action
5. Book disappears from borrowed list
6. Success message displays
7. Verify empty state shows when no borrowed books

### Implementation for User Story 3

- [x] **T024** [P] [US3] Add `getBorrowedBooks()` function to `js/api.js`:
  - Call `apiRequest('/books/borrowed')`
  - Return `{success, data: {books: []}, error}`
  - Export in api object

- [x] **T025** [P] [US3] Add `returnBook(bookId)` function to `js/api.js`:
  - Call `apiRequest('/books/return', {method: 'POST', body: JSON.stringify({bookId})})`
  - Return `{success, data: {book}, error}`
  - Export in api object

- [x] **T026** [US3] Create `js/pages/borrowed.js`:
  - Import Vue's `createApp` from global Vue
  - Import Navigation, BookList, Toast components
  - Define app with data: `books: [], loading: true, error: null, toastMessage: null, toastType: 'success'`
  - Mounted hook: call `api.getBorrowedBooks()`, update state
  - Add method `async handleReturn(book)`:
    - Show confirmation prompt: "Return book borrowed by {borrowerName}?"
    - If confirmed: call `api.returnBook(book.id)`
    - If success: remove book from `books` array, show success toast
    - If error: display error message
  - Add method `showToast(message, type)`
  - Register components: Navigation, BookList, Toast
  - Mount app to `#app`

- [x] **T027** [US3] Update `borrowed.html`:
  - Add `<div id="app">` container with Vue template
  - Template: `<navigation current="borrowed">`, `<h1>Borrowed Books</h1>`, `<book-list type="borrowed">`, `<toast>`
  - Include script module: `<script type="module" src="js/pages/borrowed.js"></script>`
  - Ensure Vue CDN loads first

- [x] **T028** [US3] Update BookList component in `js/components/BookList.js`:
  - Add "Return" button to each book card when `type="borrowed"`
  - Display borrower name prominently for borrowed books
  - Optionally display `borrowedAt` timestamp (format as relative time if present)
  - Button click emits 'return' event with book object
  - Disable button when loading

- [x] **T029** [US3] Wire up events in borrowed.js:
  - BookList 'return' event → `handleReturn` method
  - Toast 'close' event → clear toast message

- [x] **T030** [P] [US3] Add CSS for borrowed books display in `css/styles.css`:
  - Borrower name styles (prominent, different color)
  - Borrowed timestamp styles (smaller, gray)
  - Return button styles (distinct from borrow button)
  - Confirmation prompt styles (if using custom prompt instead of browser confirm)

**Checkpoint**: User Story 3 complete - borrowed books page functional, return workflow works, all three user stories independently operational

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories and final touches

- [x] **T031** [P] Refine responsive design in `css/styles.css`:
  - Test on 320px (mobile), 768px (tablet), 1024px+ (desktop)
  - Adjust breakpoints if needed
  - Ensure text truncation works for long titles/authors/names
  - Add tooltips for truncated text (title attribute)

- [x] **T032** [P] Enhance error messages across both pages:
  - Network errors: "Unable to connect to server. Please check your connection."
  - Server errors: "Server error occurred. Please try again later."
  - Specific API errors: Display backend error messages
  - Add "Retry" buttons for recoverable errors

- [x] **T033** [P] Add loading states and skeleton screens:
  - Skeleton loaders for book cards while fetching
  - Loading spinner for operations in progress
  - Disable action buttons during operations
  - Prevent double-click submissions

- [x] **T034** [P] Accessibility improvements:
  - Add ARIA labels to buttons and forms
  - Ensure keyboard navigation works (tab order, enter to submit)
  - Add focus styles for keyboard users
  - Semantic HTML elements (nav, main, article for books)
  - Alt text for any icons/images

- [x] **T035** Add GitHub Pages deployment configuration:
  - Verify all paths are relative (no absolute paths)
  - Test locally with simple HTTP server
  - Create README.md with:
    - Project description
    - Setup instructions
    - API configuration steps
    - Deployment instructions

- [x] **T036** [P] Browser compatibility testing:
  - Test on Chrome (last 2 versions)
  - Test on Firefox (last 2 versions)
  - Test on Safari (last 2 versions)
  - Test on Edge (last 2 versions)
  - Document any compatibility issues

- [x] **T037** Performance optimization:
  - Verify page load < 2 seconds (measure with Network throttling)
  - Check API response handling < 1 second
  - Minimize DOM manipulations (Vue handles this)
  - Add cache headers if serving from GitHub Pages

- [x] **T038** Code cleanup and documentation:
  - Add JSDoc comments to all functions in api.js
  - Add comments explaining complex logic
  - Remove any console.log statements (or gate behind DEBUG flag)
  - Ensure consistent code style (naming conventions, indentation)

- [x] **T039** Create manual test plan in `tests/manual-test-plan.md`:
  - Test scenarios for each user story
  - Edge case testing checklist
  - Error scenario testing
  - Browser compatibility checklist
  - Responsive design checklist
  - Acceptance criteria from spec.md

- [x] **T040** Final validation:
  - All user stories work independently
  - Navigation between pages works smoothly
  - No console errors
  - Mobile responsive works (320px to 2560px)
  - Empty states display correctly
  - Error handling works for all scenarios

**Checkpoint**: Application polished, production-ready, all quality checks passed

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies - can start immediately
2. **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories**
3. **User Story 1 (Phase 3)**: Depends on Foundational phase
4. **User Story 2 (Phase 4)**: Depends on Foundational phase (independent of US1)
5. **User Story 3 (Phase 5)**: Depends on Foundational phase (independent of US1, US2)
6. **Polish (Phase 6)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational - Uses BookList from US1 but extends it (can be done independently)
- **User Story 3 (P3)**: Can start after Foundational - Completely independent page, reuses components

**Key Point**: All three user stories are independent and can be worked on in parallel after Phase 2 completes (if team has multiple developers).

### Within Each User Story

1. API client functions first
2. Components (can be parallel if different files)
3. Page logic (integrates components)
4. HTML page updates
5. CSS styling (can be parallel with implementation)
6. Testing/validation

### Parallel Opportunities

**Phase 1 (Setup)**:
- T002, T003, T004 can run in parallel (different files)

**Phase 2 (Foundational)**:
- T007, T008 can run in parallel (Navigation component + CSS)

**Phase 3 (User Story 1)**:
- T009, T010 can run in parallel (API function + BookList component - different files)
- T013 (CSS) can run in parallel with T009-T012

**Phase 4 (User Story 2)**:
- T015, T016, T021 can run in parallel (API function + BorrowForm + Toast - different files)
- T020, T023 (CSS) can run in parallel with implementation

**Phase 5 (User Story 3)**:
- T024, T025 can run in parallel (two API functions - same file but different functions)
- T030 (CSS) can run in parallel with implementation

**Phase 6 (Polish)**:
- Most polish tasks (T031-T039) can run in parallel as they affect different concerns

**Cross-Story Parallelism**:
- After Phase 2 completes, teams can work on:
  - Developer A: User Story 1 (T009-T014)
  - Developer B: User Story 2 (T015-T023)
  - Developer C: User Story 3 (T024-T030)

---

## Parallel Execution Examples

### User Story 1 Parallel Tasks
```bash
# Can launch together:
Task: "Add getAvailableBooks() function to js/api.js" (T009)
Task: "Create js/components/BookList.js" (T010)
Task: "Add CSS for BookList component" (T013)

# Then after T009, T010 complete:
Task: "Create js/pages/available.js" (T011)
Task: "Update index.html" (T012)
```

### User Story 2 Parallel Tasks
```bash
# Can launch together:
Task: "Add borrowBook() function to js/api.js" (T015)
Task: "Create js/components/BorrowForm.js" (T016)
Task: "Create js/components/Toast.js" (T021)
Task: "Add CSS for BorrowForm component" (T020)
Task: "Add CSS for Toast component" (T023)
```

### Cross-Story Parallel Work
```bash
# After Phase 2 completes, all three can start simultaneously:
Developer A: Phase 3 (User Story 1) - Tasks T009-T014
Developer B: Phase 4 (User Story 2) - Tasks T015-T023
Developer C: Phase 5 (User Story 3) - Tasks T024-T030
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Goal**: Deliver minimal working product quickly

1. **Complete Phase 1** (Setup) - ~30 minutes
2. **Complete Phase 2** (Foundational) - ~1 hour
3. **Complete Phase 3** (User Story 1) - ~2-3 hours
4. **STOP and VALIDATE**: 
   - Test available books page works
   - Verify empty states
   - Test error handling
   - Check responsive design
5. **Deploy to GitHub Pages**: MVP ready! 🎉

**Result**: Users can browse available books - delivers immediate value

---

### Incremental Delivery

**Goal**: Add features incrementally, each adding value

1. **Foundation** (Phase 1-2) → Project ready for development
2. **MVP Release** (+ Phase 3) → Browse available books ✅
3. **Version 2** (+ Phase 4) → Add borrowing capability ✅
4. **Version 3** (+ Phase 5) → Add return functionality ✅
5. **Polish Release** (+ Phase 6) → Production-ready ✅

Each version is independently deployable and adds value without breaking previous functionality.

---

### Parallel Team Strategy

**With 3 developers**:

**Week 1**:
- All: Complete Phase 1 (Setup) + Phase 2 (Foundational) together

**Week 2** (parallel development):
- Developer A: User Story 1 (Phase 3)
- Developer B: User Story 2 (Phase 4)
- Developer C: User Story 3 (Phase 5)

**Week 3**:
- All: Integration testing, Phase 6 (Polish), deployment

**Result**: All features complete in ~3 weeks vs ~5 weeks sequential

---

## Task Counts

**Total Tasks**: 40

### By Phase:
- Phase 1 (Setup): 5 tasks
- Phase 2 (Foundational): 3 tasks
- Phase 3 (User Story 1): 6 tasks
- Phase 4 (User Story 2): 9 tasks
- Phase 5 (User Story 3): 7 tasks
- Phase 6 (Polish): 10 tasks

### By User Story:
- **User Story 1** (P1 - Browse Available Books): 6 tasks
- **User Story 2** (P2 - Borrow a Book): 9 tasks
- **User Story 3** (P3 - Return a Book): 7 tasks
- **Infrastructure** (Setup + Foundational): 8 tasks
- **Polish** (Cross-cutting): 10 tasks

### Parallel Opportunities:
- 15+ tasks can run in parallel (marked with [P])
- All 3 user stories can be developed in parallel after Phase 2

---

## Notes

- **[P] tasks**: Different files, can run in parallel
- **[Story] labels**: US1, US2, US3 for traceability
- **No automated tests**: Per user request - manual testing only
- **API URLs**: Update `API_BASE_URL` in `js/api.js` when backend ready
- **Each user story is independently testable**: Can validate without other stories being complete
- **Commit strategy**: Commit after each task or logical group
- **Checkpoints**: Stop and validate after each phase
- **MVP recommendation**: Deploy User Story 1 first for quick user feedback

---

## Getting Started

### Immediate Next Steps:

1. Start with **T001** - create project structure
2. Complete **Phase 1** (Setup) - ~30 minutes
3. Complete **Phase 2** (Foundational) - critical for all stories
4. Choose path:
   - **Fast MVP**: Just User Story 1 (Phase 3)
   - **Parallel development**: Start all stories after Phase 2
   - **Sequential**: P1 → P2 → P3 in priority order

### Before You Begin:

- Review `quickstart.md` for detailed setup instructions
- Check `research.md` for technical decisions and patterns
- Review `data-model.md` for data structures
- Read API contracts in `contracts/` folder

**Ready to build! 🚀**
