# Manual Test Plan - Library Book Borrowing System

## Test Environment Setup

- [ ] Backend API is running and accessible
- [ ] API_BASE_URL is configured correctly in `js/api.js`
- [ ] Application is served via HTTP server (not file://)
- [ ] Browser DevTools console is open for error monitoring

## Browser Testing Matrix

Test on the following browsers (last 2 versions):
- [ ] Google Chrome
- [ ] Mozilla Firefox
- [ ] Apple Safari
- [ ] Microsoft Edge

## Responsive Design Testing

Test on the following viewport sizes:
- [ ] 320px (small mobile)
- [ ] 375px (iPhone)
- [ ] 768px (tablet)
- [ ] 1024px (laptop)
- [ ] 1440px (desktop)
- [ ] 2560px (large display)

---

## User Story 1: Browse Available Books

### Test Case 1.1: View Available Books (Happy Path)
**Prerequisites**: Backend has available books

- [ ] Navigate to `index.html`
- [ ] Verify Navigation component displays with "Library System" title
- [ ] Verify "Available Books" link is highlighted as active
- [ ] Verify page heading shows "Available Books"
- [ ] Verify books are displayed in a grid layout
- [ ] Verify each book card shows:
  - [ ] Book title
  - [ ] Author name (prefixed with "by")
  - [ ] "Borrow" button

**Expected Result**: Available books are displayed correctly

### Test Case 1.2: Empty State
**Prerequisites**: Backend returns empty books array

- [ ] Navigate to `index.html`
- [ ] Verify message "No books currently available" is displayed
- [ ] Verify no book cards are shown
- [ ] Verify no error message is shown

**Expected Result**: Appropriate empty state message is shown

### Test Case 1.3: Loading State
**Prerequisites**: Slow network or delayed API response

- [ ] Navigate to `index.html` with throttled network
- [ ] Verify skeleton loader cards are displayed (6 cards)
- [ ] Verify each skeleton has animated shimmer effect
- [ ] Verify skeleton shows placeholder for title, author, and button
- [ ] Wait for data to load
- [ ] Verify skeleton is replaced with actual book data

**Expected Result**: Loading state provides visual feedback

### Test Case 1.4: Network Error
**Prerequisites**: Backend is offline or unreachable

- [ ] Stop the backend API server
- [ ] Navigate to `index.html`
- [ ] Verify error message is displayed
- [ ] Verify error message is user-friendly (not technical)
- [ ] Verify "Retry" button is displayed
- [ ] Click "Retry" button
- [ ] Verify loading state appears
- [ ] Verify error persists if server still offline

**Expected Result**: Clear error messaging with retry option

### Test Case 1.5: Server Error (500)
**Prerequisites**: Backend returns 500 error

- [ ] Configure backend to return 500 error
- [ ] Navigate to `index.html`
- [ ] Verify error message: "Server error occurred. Please try again later."
- [ ] Verify "Retry" button is available

**Expected Result**: Server error is handled gracefully

### Test Case 1.6: Text Truncation and Tooltips
**Prerequisites**: Backend has books with very long titles/authors

- [ ] Add book with title longer than card width
- [ ] Verify title is truncated with ellipsis
- [ ] Hover over truncated title
- [ ] Verify tooltip shows full title
- [ ] Repeat for long author names

**Expected Result**: Long text is truncated with tooltip showing full text

---

## User Story 2: Borrow a Book

### Test Case 2.1: Borrow Book (Happy Path)
**Prerequisites**: At least one available book

- [ ] Navigate to `index.html`
- [ ] Click "Borrow" button on any book
- [ ] Verify modal overlay appears
- [ ] Verify modal shows:
  - [ ] Modal title "Borrow Book"
  - [ ] Book title and author
  - [ ] Input field labeled "Your Name or ID"
  - [ ] "Cancel" button
  - [ ] "Confirm Borrow" button
- [ ] Enter borrower name: "John Doe"
- [ ] Click "Confirm Borrow"
- [ ] Verify button shows "Borrowing..." during request
- [ ] Verify button is disabled during request
- [ ] Verify modal closes after success
- [ ] Verify book is removed from available list
- [ ] Verify success toast appears: "Book borrowed successfully!"
- [ ] Verify toast auto-dismisses after 5 seconds

**Expected Result**: Book is borrowed and UI updates immediately

### Test Case 2.2: Borrow Form Validation - Empty Name
**Prerequisites**: Available books exist

- [ ] Click "Borrow" button on a book
- [ ] Leave "Your Name or ID" field empty
- [ ] Click "Confirm Borrow"
- [ ] Verify error message appears: "Please enter your name or ID"
- [ ] Verify form does not submit
- [ ] Verify modal remains open

**Expected Result**: Validation prevents empty submission

### Test Case 2.3: Cancel Borrow
**Prerequisites**: Available books exist

- [ ] Click "Borrow" button
- [ ] Enter name: "Jane Smith"
- [ ] Click "Cancel" button
- [ ] Verify modal closes
- [ ] Verify book remains in available list
- [ ] Verify no toast message appears

**Expected Result**: Cancel closes modal without action

### Test Case 2.4: Close Modal with Overlay Click
**Prerequisites**: Available books exist

- [ ] Click "Borrow" button
- [ ] Click outside the modal (on dark overlay)
- [ ] Verify modal closes
- [ ] Verify book remains in available list

**Expected Result**: Clicking overlay closes modal

### Test Case 2.5: Close Modal with X Button
**Prerequisites**: Available books exist

- [ ] Click "Borrow" button
- [ ] Click the "×" button in modal header
- [ ] Verify modal closes

**Expected Result**: Close button works correctly

### Test Case 2.6: Borrow API Error
**Prerequisites**: Backend returns error for borrow request

- [ ] Configure backend to return error on borrow
- [ ] Click "Borrow" on a book
- [ ] Enter name and confirm
- [ ] Verify error toast appears with error message
- [ ] Verify toast has red/error styling
- [ ] Verify book remains in available list (no optimistic removal)

**Expected Result**: API errors are displayed to user

### Test Case 2.7: Double-Click Prevention
**Prerequisites**: Available books exist

- [ ] Click "Borrow" button
- [ ] Enter name
- [ ] Quickly double-click "Confirm Borrow" button
- [ ] Verify button becomes disabled after first click
- [ ] Verify button text changes to "Borrowing..."
- [ ] Verify only one API request is made (check Network tab)

**Expected Result**: Double submission is prevented

### Test Case 2.8: Form Reset on Book Change
**Prerequisites**: Multiple available books

- [ ] Click "Borrow" on Book A
- [ ] Enter name: "Test User"
- [ ] Trigger validation error (try to submit)
- [ ] Cancel modal
- [ ] Click "Borrow" on Book B
- [ ] Verify name field is empty
- [ ] Verify no error message is shown

**Expected Result**: Form resets for each new book

---

## User Story 3: Return a Borrowed Book

### Test Case 3.1: View Borrowed Books (Happy Path)
**Prerequisites**: Backend has borrowed books

- [ ] Click "Borrowed Books" link in navigation
- [ ] Verify URL changes to `borrowed.html`
- [ ] Verify "Borrowed Books" link is highlighted as active
- [ ] Verify page heading shows "Borrowed Books"
- [ ] Verify books are displayed in grid layout
- [ ] Verify each book card shows:
  - [ ] Book title
  - [ ] Author name
  - [ ] Borrower name (with "Borrowed by:" label)
  - [ ] Borrowed date (relative time format)
  - [ ] "Return" button

**Expected Result**: Borrowed books are displayed with borrower info

### Test Case 3.2: Empty State - No Borrowed Books
**Prerequisites**: Backend returns empty borrowed books array

- [ ] Navigate to `borrowed.html`
- [ ] Verify message "No books currently borrowed" is displayed
- [ ] Verify no book cards are shown

**Expected Result**: Empty state message is appropriate

### Test Case 3.3: Return Book (Happy Path)
**Prerequisites**: At least one borrowed book

- [ ] Navigate to `borrowed.html`
- [ ] Click "Return" button on any book
- [ ] Verify browser confirmation dialog appears
- [ ] Verify dialog message includes borrower name
- [ ] Click "OK" to confirm
- [ ] Verify book is removed from list immediately
- [ ] Verify success toast appears: "Book returned successfully!"
- [ ] Verify toast auto-dismisses

**Expected Result**: Book is returned and UI updates immediately

### Test Case 3.4: Cancel Return
**Prerequisites**: At least one borrowed book

- [ ] Click "Return" button
- [ ] Click "Cancel" in confirmation dialog
- [ ] Verify book remains in borrowed list
- [ ] Verify no toast message appears

**Expected Result**: Cancel prevents return action

### Test Case 3.5: Return API Error
**Prerequisites**: Backend returns error for return request

- [ ] Configure backend to return error on return
- [ ] Click "Return" on a book
- [ ] Confirm the dialog
- [ ] Verify error toast appears with error message
- [ ] Verify book remains in borrowed list

**Expected Result**: API errors are handled gracefully

### Test Case 3.6: Borrowed Date Formatting
**Prerequisites**: Books borrowed at different times

- [ ] Ensure borrowed books with various borrowedAt dates:
  - [ ] Today
  - [ ] Yesterday  
  - [ ] 3 days ago
  - [ ] 2 weeks ago
  - [ ] 2 months ago
- [ ] Navigate to `borrowed.html`
- [ ] Verify dates are displayed in relative format:
  - [ ] "Today"
  - [ ] "Yesterday"
  - [ ] "3 days ago"
  - [ ] "2 weeks ago"
  - [ ] Absolute date for old entries

**Expected Result**: Dates are formatted user-friendly

### Test Case 3.7: Loading State on Borrowed Page
**Prerequisites**: Slow network

- [ ] Navigate to `borrowed.html` with throttled network
- [ ] Verify skeleton loaders are displayed
- [ ] Verify loading experience matches available page

**Expected Result**: Consistent loading experience

### Test Case 3.8: Network Error on Borrowed Page
**Prerequisites**: Backend offline

- [ ] Stop backend API
- [ ] Navigate to `borrowed.html`
- [ ] Verify error message is displayed
- [ ] Verify "Retry" button appears
- [ ] Click retry
- [ ] Verify loading state shows

**Expected Result**: Error handling works on borrowed page

---

## Navigation Testing

### Test Case 4.1: Navigate Between Pages
- [ ] Start on `index.html`
- [ ] Click "Borrowed Books" link
- [ ] Verify navigation to `borrowed.html`
- [ ] Verify "Borrowed Books" is highlighted
- [ ] Click "Available Books" link
- [ ] Verify navigation back to `index.html`
- [ ] Verify "Available Books" is highlighted

**Expected Result**: Navigation works correctly both directions

### Test Case 4.2: Browser Back/Forward
- [ ] Navigate from Available to Borrowed
- [ ] Click browser back button
- [ ] Verify return to Available Books
- [ ] Verify correct page is highlighted in nav
- [ ] Click browser forward button
- [ ] Verify return to Borrowed Books

**Expected Result**: Browser navigation works correctly

---

## Accessibility Testing

### Test Case 5.1: Keyboard Navigation
- [ ] Navigate to `index.html`
- [ ] Press Tab key repeatedly
- [ ] Verify focus moves through elements in logical order:
  - [ ] Skip to content link appears on first tab
  - [ ] Navigation links
  - [ ] Borrow buttons
- [ ] Verify visible focus indicators on all elements
- [ ] Verify focus ring has good contrast
- [ ] Press Enter on "Borrow" button
- [ ] Verify modal opens
- [ ] Verify focus moves to input field
- [ ] Tab through modal elements
- [ ] Press Escape key
- [ ] Verify modal closes

**Expected Result**: Full keyboard navigation support

### Test Case 5.2: Screen Reader (VoiceOver/NVDA)
- [ ] Enable screen reader
- [ ] Navigate to `index.html`
- [ ] Verify page title is announced
- [ ] Verify navigation landmarks are announced
- [ ] Navigate to book cards
- [ ] Verify book information is announced
- [ ] Verify button labels include book titles
- [ ] Open borrow modal
- [ ] Verify form labels are associated with inputs

**Expected Result**: Screen reader can access all content

### Test Case 5.3: Skip to Main Content
- [ ] Navigate to `index.html`
- [ ] Press Tab once
- [ ] Verify "Skip to main content" link is visible
- [ ] Press Enter
- [ ] Verify focus jumps to main content area
- [ ] Verify navigation is skipped

**Expected Result**: Skip link works for keyboard users

---

## Responsive Design Testing

### Test Case 6.1: Mobile Layout (320px - 767px)
- [ ] Resize browser to 320px width
- [ ] Verify navigation stacks vertically
- [ ] Verify book grid is single column
- [ ] Verify buttons are full width
- [ ] Verify modal is responsive
- [ ] Verify text is readable
- [ ] Verify no horizontal scroll
- [ ] Test at 375px, 414px

**Expected Result**: Mobile layout works well

### Test Case 6.2: Tablet Layout (768px - 1023px)
- [ ] Resize browser to 768px width
- [ ] Verify navigation is horizontal
- [ ] Verify book grid is 2 columns
- [ ] Verify spacing is appropriate
- [ ] Test at 800px, 1000px

**Expected Result**: Tablet layout is optimized

### Test Case 6.3: Desktop Layout (1024px+)
- [ ] Resize to 1024px width
- [ ] Verify book grid is 3 columns
- [ ] Resize to 1440px
- [ ] Verify book grid is 4 columns
- [ ] Verify content is centered with max-width
- [ ] Test at 1920px, 2560px

**Expected Result**: Desktop layout utilizes space well

### Test Case 6.4: Orientation Change (Mobile/Tablet)
- [ ] Use mobile device or DevTools device mode
- [ ] Test in portrait orientation
- [ ] Rotate to landscape
- [ ] Verify layout adapts correctly
- [ ] Verify no layout breaks

**Expected Result**: Orientation changes handled gracefully

---

## Toast Notification Testing

### Test Case 7.1: Success Toast
- [ ] Trigger a successful borrow operation
- [ ] Verify green toast appears in top-right
- [ ] Verify message: "Book borrowed successfully!"
- [ ] Verify toast is visible for 5 seconds
- [ ] Verify toast auto-dismisses
- [ ] Verify fade-out animation

**Expected Result**: Success toast displays correctly

### Test Case 7.2: Error Toast
- [ ] Trigger an API error
- [ ] Verify red toast appears
- [ ] Verify error message is displayed
- [ ] Verify toast has error styling
- [ ] Verify toast auto-dismisses after 5 seconds

**Expected Result**: Error toast displays correctly

### Test Case 7.3: Manual Toast Dismiss
- [ ] Trigger any toast
- [ ] Click the X button on toast
- [ ] Verify toast closes immediately
- [ ] Verify no errors in console

**Expected Result**: Manual dismiss works

### Test Case 7.4: Multiple Toasts
- [ ] Trigger two operations quickly
- [ ] Verify second toast replaces first
- [ ] Verify no toast stacking

**Expected Result**: Only one toast shows at a time

### Test Case 7.5: Toast on Small Screens
- [ ] Resize to 320px width
- [ ] Trigger a toast
- [ ] Verify toast fits within viewport
- [ ] Verify toast is left and right aligned
- [ ] Verify no horizontal scroll

**Expected Result**: Toast is responsive on mobile

---

## Edge Cases and Error Scenarios

### Test Case 8.1: Very Long Book Titles
**Prerequisites**: Book with 200+ character title

- [ ] Verify title is truncated in card
- [ ] Verify ellipsis is shown
- [ ] Verify tooltip shows full title on hover
- [ ] Open borrow modal
- [ ] Verify full title is visible in modal

**Expected Result**: Long titles handled gracefully

### Test Case 8.2: Special Characters in Data
**Prerequisites**: Book with special characters in title/author

- [ ] Test with titles containing: & < > " ' / \
- [ ] Verify special characters display correctly
- [ ] Verify no HTML injection occurs
- [ ] Test with emoji characters
- [ ] Test with Unicode characters (Chinese, Arabic, etc.)

**Expected Result**: Special characters are properly escaped

### Test Case 8.3: Rapid Operations
- [ ] Quickly borrow multiple books in succession
- [ ] Verify each operation completes
- [ ] Verify UI remains responsive
- [ ] Verify no race conditions
- [ ] Check console for errors

**Expected Result**: Rapid operations handled correctly

### Test Case 8.4: Slow API Response
**Prerequisites**: Add 5 second delay to API

- [ ] Borrow a book
- [ ] Verify loading state shows for full duration
- [ ] Verify user cannot submit again during loading
- [ ] Verify operation completes after delay

**Expected Result**: Slow responses handled gracefully

### Test Case 8.5: Session Persistence
- [ ] Perform operations
- [ ] Refresh the page
- [ ] Verify fresh data is loaded from API
- [ ] Verify no stale data is shown

**Expected Result**: Page refresh loads fresh data

---

## Performance Testing

### Test Case 9.1: Initial Page Load
- [ ] Clear browser cache
- [ ] Open DevTools Performance tab
- [ ] Navigate to `index.html`
- [ ] Measure page load time
- [ ] Verify load time < 2 seconds (normal network)
- [ ] Check for any render-blocking resources

**Expected Result**: Fast initial page load

### Test Case 9.2: API Response Rendering
- [ ] Use Network tab to measure API time
- [ ] Verify API response is rendered < 1 second
- [ ] Verify no layout shifts during render

**Expected Result**: Quick API response handling

### Test Case 9.3: Large Data Sets
**Prerequisites**: Backend returns 50+ books

- [ ] Load page with many books
- [ ] Verify page remains responsive
- [ ] Verify scrolling is smooth
- [ ] Check FPS in DevTools

**Expected Result**: Large lists perform well

---

## Cross-Browser Specific Tests

### Chrome
- [ ] All test cases pass
- [ ] No console errors
- [ ] CSS Grid displays correctly

### Firefox
- [ ] All test cases pass
- [ ] No console errors
- [ ] Focus styles work correctly

### Safari
- [ ] All test cases pass
- [ ] Date formatting works
- [ ] Animations are smooth

### Edge
- [ ] All test cases pass
- [ ] Fetch API works
- [ ] ES6 modules load correctly

---

## Acceptance Criteria Validation

From spec.md requirements:

### Functional Requirements
- [ ] FR-001: Display available books with title and author
- [ ] FR-002: Retrieve data from backend APIs
- [ ] FR-003: Borrow form with name/ID input
- [ ] FR-004: User-friendly error messages
- [ ] FR-005: Immediate UI updates after borrow
- [ ] FR-006: Success confirmation after borrow
- [ ] FR-007: Display borrowed books with borrower info
- [ ] FR-008: Return books interface
- [ ] FR-009: Immediate UI updates after return
- [ ] FR-010: Success confirmation after return
- [ ] FR-011: Publicly accessible
- [ ] FR-012: Interactive without page reloads

### Non-Functional Requirements
- [ ] NFR-001: Page load < 2 seconds
- [ ] NFR-002: API rendering < 1 second
- [ ] NFR-003: Responsive 320px - 2560px
- [ ] NFR-004: Works on Chrome, Firefox, Safari, Edge (last 2 versions)

---

## Test Summary

**Total Test Cases**: 60+

**Passed**: _____ / _____  
**Failed**: _____ / _____  
**Blocked**: _____ / _____

**Tested By**: _______________  
**Date**: _______________  
**Environment**: _______________

**Critical Issues Found**:
1. _________________________
2. _________________________

**Notes**:
_______________________________
_______________________________
