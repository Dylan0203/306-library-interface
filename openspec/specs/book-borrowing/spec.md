# book-borrowing Specification

## Purpose
TBD - created by archiving change migrate-to-nuxt4. Update Purpose after archive.
## Requirements
### Requirement: Borrow Book Modal
The system SHALL display a modal form when user initiates book borrowing.

#### Scenario: Open borrow modal
- **WHEN** user clicks "Borrow" button on a book card
- **THEN** modal overlay is displayed
- **AND** borrow form is shown with book name
- **AND** focus is moved to first input field

#### Scenario: Google account auto-fill
- **WHEN** user is logged in with Google account
- **THEN** borrower name field is pre-filled with Google account name
- **AND** email field is pre-filled with Google email
- **AND** user can edit the pre-filled values

#### Scenario: Submit borrow request
- **WHEN** user enters borrower name and submits form
- **THEN** API request is sent to `borrowBook` endpoint with book ID and borrower data
- **AND** optimistic UI update removes book from available list
- **AND** success toast notification is displayed

#### Scenario: Borrow request failure
- **WHEN** borrow API request fails
- **THEN** book is restored to available list
- **AND** error toast notification is displayed with error message
- **AND** user can retry the borrow operation

### Requirement: Borrowed Books Page
The system SHALL display borrowed books at `/borrowed` route.

#### Scenario: Navigate to borrowed books
- **WHEN** user clicks "Borrowed Books" navigation link
- **THEN** page navigates to `/borrowed` route
- **AND** borrowed books page is displayed

#### Scenario: Load borrowed books data
- **WHEN** borrowed books page mounts
- **THEN** API request is sent to `getBorrowedBooks` endpoint
- **AND** loading skeleton is displayed during fetch
- **AND** borrowed books are displayed after successful response

#### Scenario: Display borrower information
- **WHEN** borrowed books are loaded
- **THEN** each book shows borrower name
- **AND** borrowed date is displayed in "YYYY/MM/DD" format
- **AND** due date (borrowed date + 14 days) is displayed

#### Scenario: Overdue book indicator
- **WHEN** borrowed book's due date has passed
- **THEN** due date is displayed in red or highlighted style
- **AND** visual indicator shows book is overdue

### Requirement: Return Book Functionality
The system SHALL allow keeper mode users to return borrowed books.

#### Scenario: Display return button
- **WHEN** borrowed books page is in keeper mode
- **THEN** "Return" button is displayed for each borrowed book
- **AND** button is labeled in Traditional Chinese "歸還"

#### Scenario: Return book action
- **WHEN** user clicks "Return" button on borrowed book
- **THEN** API request is sent to `returnBook` endpoint with record ID
- **AND** optimistic UI update removes book from borrowed list
- **AND** success toast notification is displayed

#### Scenario: Return request failure
- **WHEN** return API request fails
- **THEN** book is restored to borrowed list
- **AND** error toast notification is displayed with error message

### Requirement: QR Code Display
The system SHALL generate and display QR codes for books.

#### Scenario: Show QR code modal
- **WHEN** user clicks QR code button (📱) on book card
- **THEN** modal is displayed with generated QR code
- **AND** QR code contains book information

#### Scenario: QR code scanning
- **WHEN** QR code is scanned with mobile device
- **THEN** encoded book information is readable
- **AND** data format is compatible with scanner application

### Requirement: Print Mode
The system SHALL provide print-optimized view at `/print` route.

#### Scenario: Access print mode
- **WHEN** user navigates to `/print` route
- **THEN** print-optimized layout is displayed
- **AND** unnecessary UI elements are hidden (navigation, buttons)

#### Scenario: Print borrowed books
- **WHEN** user triggers browser print function
- **THEN** borrowed books are formatted for paper output
- **AND** essential information (name, borrower, dates) is clearly visible

### Requirement: Navigation Between Pages
The system SHALL provide navigation component for page switching.

#### Scenario: Navigation component display
- **WHEN** any page is loaded
- **THEN** navigation component is displayed in header
- **AND** current page link is highlighted

#### Scenario: Navigate to available books
- **WHEN** user clicks "Available Books" link
- **THEN** page navigates to `/` route using Nuxt router
- **AND** no full page reload occurs (SPA navigation)

#### Scenario: Navigate to borrowed books
- **WHEN** user clicks "Borrowed Books" link
- **THEN** page navigates to `/borrowed` route using Nuxt router
- **AND** navigation state is preserved

### Requirement: Toast Notifications
The system SHALL display toast notifications for user actions.

#### Scenario: Success notification
- **WHEN** borrow or return action succeeds
- **THEN** green toast notification appears
- **AND** success message is displayed for 3 seconds
- **AND** toast auto-dismisses after timeout

#### Scenario: Error notification
- **WHEN** API request fails
- **THEN** red toast notification appears
- **AND** error message from API is displayed
- **AND** toast remains until user dismisses or 5 seconds pass

#### Scenario: Multiple toast handling
- **WHEN** multiple actions trigger toasts simultaneously
- **THEN** toasts are stacked vertically
- **AND** each toast dismisses independently

