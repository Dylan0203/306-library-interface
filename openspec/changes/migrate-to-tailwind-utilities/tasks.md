# Tasks: Migrate CSS to Tailwind Utility Classes

**Change ID**: `migrate-to-tailwind-utilities`

## Task List

### Phase 1: Preparation
- [ ] **T1.1** - Audit current CSS usage
  - Review all custom classes in `main.css`
  - Document which classes are used in which components
  - List all animations (`@keyframes`) to convert
  - List all base styles to migrate to Tailwind config
  - **Validation**: Complete list of custom classes and their usage
  - **Estimated**: 30 min

- [ ] **T1.2** - Create visual baseline
  - Take screenshots of all pages and component states (light + dark mode)
  - Document current responsive breakpoints behavior
  - Note all interactive states (hover, focus, active)
  - **Validation**: Screenshot set for regression testing
  - **Estimated**: 20 min

- [ ] **T1.3** - Create shared style constants file
  - Create `constants/styles.ts` for shared style patterns
  - Define initial constants for common patterns (cards, buttons, etc.)
  - Export constants with descriptive names
  - **Validation**: File created and constants are typed correctly
  - **Dependencies**: T1.1 (need to know which patterns are common)
  - **Estimated**: 15 min

### Phase 2: Core Component Migration
- [ ] **T2.1** - Migrate BookList.vue
  - Replace `.book-grid`, `.book-card`, `.book-title` classes with utilities
  - Extract repeated card classes as TypeScript constants in component
  - Replace skeleton shimmer animation with Tailwind `animate-pulse` or custom
  - Preserve responsive grid behavior
  - Test light/dark mode
  - **Validation**: Visual comparison matches baseline, all interactions work
  - **Dependencies**: T1.2, T1.3
  - **Estimated**: 50 min

- [ ] **T2.2** - Migrate BorrowForm.vue
  - Replace `.modal-overlay`, `.modal-content` classes with utilities
  - Migrate form input styles (`.form-group`, `.form-input`)
  - Convert button styles (`.btn`, `.btn-primary`, `.btn-secondary`) to constants
  - Use Vue `<Transition>` for modal enter/leave animations
  - Add modal and button classes to shared constants if reusable
  - **Validation**: Modal opens/closes correctly, form validation displays properly
  - **Dependencies**: T1.2, T1.3
  - **Estimated**: 55 min

- [ ] **T2.3** - Migrate QRCodeModal.vue
  - Replace modal and QR code container classes with utilities
  - Reuse modal constants from BorrowForm if applicable
  - Ensure QR code display remains centered and properly sized
  - **Validation**: QR code modal displays correctly on all screen sizes
  - **Dependencies**: T2.2 (shares modal styles), T1.3
  - **Estimated**: 20 min

### Phase 3: Supporting Component Migration
- [ ] **T3.1** - Migrate Toast.vue
  - Replace `.toast`, `.toast-success`, `.toast-error` with utilities
  - Use Vue `<Transition>` with Tailwind classes for slideIn animation
  - Extract toast base classes as constants
  - Test auto-dismiss functionality
  - **Validation**: Toast appears with correct styling and animation
  - **Dependencies**: T1.2, T1.3
  - **Estimated**: 20 min

- [ ] **T3.2** - Review Navigation.vue
  - Verify Navigation already uses utility classes (it appears to be mostly migrated)
  - Migrate any remaining custom classes if present
  - Extract any repeated nav styles to constants
  - **Validation**: Navigation styling unchanged
  - **Dependencies**: T1.3 (can run in parallel)
  - **Estimated**: 10 min

### Phase 4: Page-Level Styles
- [ ] **T4.1** - Migrate page layout classes
  - Review and migrate `.main-content`, `.page-header` usage in pages
  - Check `index.vue`, `borrowed.vue`, `print.vue` (if exists)
  - **Validation**: Page layouts remain consistent
  - **Dependencies**: T2.1, T2.2 (components must be done first)
  - **Estimated**: 20 min

- [ ] **T4.2** - Migrate utility and state classes
  - Migrate `.empty-state`, `.error-message` classes
  - Migrate `.spinner` loading indicator
  - **Validation**: Loading and error states display correctly
  - **Dependencies**: T2.1 (used in BookList)
  - **Estimated**: 15 min

### Phase 5: CSS and Global Styles Cleanup
- [ ] **T5.1** - Completely clean main.css
  - Remove entire `@layer components` section
  - Remove `@layer base` section (body, h1, h2)
  - Remove `@layer utilities` section
  - Remove all `@keyframes` definitions
  - Keep only `@import "tailwindcss";`
  - **Validation**: Build succeeds, no runtime errors
  - **Dependencies**: All T2.x, T3.x, T4.x tasks
  - **Estimated**: 10 min

- [ ] **T5.2** - Configure global styles in Tailwind config or app.vue
  - Move base typography (font-family, line-height) to Tailwind config or `app.vue`
  - Configure min-width for body if needed
  - Set up any global theme extensions
  - **Validation**: Global styles applied correctly, typography looks correct
  - **Dependencies**: T5.1
  - **Estimated**: 15 min

- [ ] **T5.3** - Review and optimize style constants
  - Check `constants/styles.ts` for any unused constants
  - Ensure naming is clear and consistent
  - Add JSDoc comments if needed
  - **Validation**: All constants are used and well-documented
  - **Dependencies**: All component migrations
  - **Estimated**: 10 min

### Phase 6: Testing and Validation
- [ ] **T6.1** - Visual regression testing
  - Compare all pages and states against baseline screenshots
  - Test responsive design at 320px, 768px, 1024px, 1920px
  - Verify dark mode consistency
  - **Validation**: All visuals match baseline
  - **Dependencies**: All previous tasks
  - **Estimated**: 30 min

- [ ] **T6.2** - Interaction testing
  - Test borrow/return book flows
  - Test modal open/close
  - Test QR code display
  - Test toast notifications
  - Verify all hover/focus/active states
  - **Validation**: All interactions work as before
  - **Dependencies**: T6.1
  - **Estimated**: 20 min

- [ ] **T6.3** - Build and bundle size check
  - Run `bun run build`
  - Compare bundle size before/after migration
  - Run TypeScript type check (`npx nuxt typecheck`)
  - Verify `main.css` in build output is minimal
  - **Validation**: Build succeeds, bundle size reduced, no type errors, main.css only has Tailwind
  - **Dependencies**: T6.2
  - **Estimated**: 10 min

- [ ] **T6.4** - Browser compatibility testing
  - Test on Chrome, Firefox, Safari, Edge
  - Verify responsive design and dark mode on each
  - **Validation**: Consistent behavior across browsers
  - **Dependencies**: T6.3
  - **Estimated**: 20 min

### Phase 7: Documentation
- [ ] **T7.1** - Update CLAUDE.md
  - Update "Code Style" section to reflect Tailwind utility-first approach
  - Document TypeScript constants pattern for reusable styles
  - Note location of shared style constants (`constants/styles.ts`)
  - Update note about `main.css` (now only contains `@import "tailwindcss";`)
  - Document animation approach (Tailwind utilities + Vue Transitions)
  - **Validation**: Documentation accurately reflects new architecture
  - **Dependencies**: T6.4 (all work complete)
  - **Estimated**: 15 min

## Total Estimated Effort
**5 hours 10 minutes**

## Parallelization Opportunities
- T2.1, T2.2, T3.1, T3.2 can be worked on in parallel after T1.2
- T2.3 depends on T2.2 (modal styles)
- T4.1 and T4.2 can run in parallel after Phase 2 and 3
- All of Phase 6 must run sequentially

## Risk Mitigation
- Each task produces a git commit for easy rollback
- Visual baseline (T1.2) enables quick regression detection
- Component-by-component approach minimizes blast radius
- Build validation at each phase ensures no breaking changes
