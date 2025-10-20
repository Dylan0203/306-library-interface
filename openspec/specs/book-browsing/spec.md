# book-browsing Specification

## Purpose
TBD - created by archiving change migrate-to-nuxt4. Update Purpose after archive.
## Requirements
### Requirement: Available Books Page
The system SHALL display all available books at the root route (`/`).

#### Scenario: Navigate to homepage
- **WHEN** user visits `http://localhost:1234/`
- **THEN** available books page is displayed
- **AND** page title is "Available Books - Library System"

#### Scenario: Load available books data
- **WHEN** available books page mounts
- **THEN** API request is sent to `getAvailableBooks` endpoint
- **AND** loading skeleton is displayed during fetch
- **AND** books are displayed after successful response

#### Scenario: Display book information
- **WHEN** available books are loaded
- **THEN** each book shows name, call number, and author (if available)
- **AND** "Borrow" button is displayed for each book

### Requirement: Book List Component
The system SHALL use Vue 3 Composition API for book list rendering.

#### Scenario: Render book cards
- **WHEN** books array is passed to BookList component
- **THEN** each book is rendered as an article card
- **AND** grid layout is responsive (mobile-first design)

#### Scenario: Empty state display
- **WHEN** no books are available
- **THEN** message "No books currently available" is displayed
- **AND** no book cards are rendered

#### Scenario: Error state display
- **WHEN** API request fails
- **THEN** error message is displayed
- **AND** user-friendly error text is shown

### Requirement: Book Data Structure
The system SHALL handle book objects with specific field names.

#### Scenario: Parse book response
- **WHEN** API returns book data
- **THEN** each book object contains `id`, `name`, `number`, `author` fields
- **AND** `name` field is used (not `title`)
- **AND** `author` field can be empty string

### Requirement: Responsive Book Grid
The system SHALL display books in responsive grid layout.

#### Scenario: Mobile viewport (320px - 767px)
- **WHEN** viewport width is below 768px
- **THEN** books are displayed in single column
- **AND** touch targets are minimum 44x44 pixels

#### Scenario: Tablet viewport (768px - 1023px)
- **WHEN** viewport width is 768px to 1023px
- **THEN** books are displayed in 2 columns
- **AND** appropriate spacing is maintained

#### Scenario: Desktop viewport (1024px+)
- **WHEN** viewport width is 1024px or larger
- **THEN** books are displayed in 3 or more columns
- **AND** maximum width constrains the layout

### Requirement: Loading States
The system SHALL show skeleton loading during data fetch.

#### Scenario: Initial page load
- **WHEN** page is loading books for first time
- **THEN** 6 skeleton cards are displayed
- **AND** skeleton cards animate with shimmer effect

#### Scenario: Skeleton to content transition
- **WHEN** books data is loaded
- **THEN** skeleton is replaced with actual book cards
- **AND** transition is smooth without layout shift

### Requirement: Accessibility
The system SHALL provide accessible book browsing experience.

#### Scenario: Screen reader support
- **WHEN** screen reader navigates book list
- **THEN** each book card has `role="listitem"`
- **AND** borrow button has descriptive `aria-label` with book name

#### Scenario: Keyboard navigation
- **WHEN** user navigates with keyboard
- **THEN** all interactive elements are reachable via Tab key
- **AND** focus indicators are clearly visible

