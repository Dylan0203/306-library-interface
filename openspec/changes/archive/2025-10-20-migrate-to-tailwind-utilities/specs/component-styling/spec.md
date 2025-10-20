# component-styling Specification Delta

## Purpose
Define styling approach for Vue components using Tailwind CSS utility classes.

## MODIFIED Requirements

### Requirement: CSS Architecture
The system SHALL use Tailwind CSS utility classes directly in component templates.

**Replaces**: frontend-architecture Requirement "CSS Architecture"

#### Scenario: Component styling with utility classes
- **WHEN** developer styles a Vue component
- **THEN** Tailwind utility classes are used directly in the template's `class` attribute
- **AND** no custom CSS classes are defined in `assets/css/main.css` for component-specific styles

#### Scenario: Conditional styling with dynamic classes
- **WHEN** component needs conditional styling based on state
- **THEN** Vue's `:class` binding is used with Tailwind utilities
- **AND** class combinations are clearly readable in the template

```vue
<div
  :class="[
    'bg-white dark:bg-gray-800 rounded-lg p-4',
    isActive ? 'border-blue-600' : 'border-gray-200'
  ]"
>
```

#### Scenario: Responsive design with Tailwind breakpoints
- **WHEN** component needs responsive behavior
- **THEN** Tailwind responsive prefixes are used (sm:, md:, lg:, xl:)
- **AND** mobile-first approach is maintained

```vue
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
```

#### Scenario: Dark mode support with Tailwind
- **WHEN** component supports dark mode
- **THEN** Tailwind's `dark:` variant is used for dark mode styles
- **AND** color mode preference is managed by Nuxt's colorMode module

```vue
<p class="text-gray-900 dark:text-white">
```

#### Scenario: Global base styles via Tailwind config
- **WHEN** global base styles are needed (body, headings)
- **THEN** they are configured in Tailwind config file or `app.vue`
- **AND** Tailwind's default typography and theme values are used where possible

#### Scenario: Animations with Tailwind utilities
- **WHEN** animations are needed (e.g., shimmer, slideIn)
- **THEN** Tailwind's built-in `animate-*` utilities are used (animate-pulse, animate-spin, etc.)
- **OR** Vue's `<Transition>` component is used for enter/leave animations
- **AND** no custom `@keyframes` are defined in CSS files

## ADDED Requirements

### Requirement: Reusable Style Patterns
The system SHALL handle repetitive style combinations efficiently using TypeScript constants.

#### Scenario: Extract common class combinations as constants
- **WHEN** same class combination is used in multiple places within a component
- **THEN** it MUST be extracted as a TypeScript string constant in the component's `<script>` section
- **AND** the constant is used via `:class` binding

```vue
<script setup lang="ts">
const cardBaseClasses = 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200'
</script>

<template>
  <div :class="cardBaseClasses">...</div>
</template>
```

#### Scenario: Shared style constants across components
- **WHEN** same class combination is used across multiple components
- **THEN** it SHOULD be extracted to a shared constants file (e.g., `constants/styles.ts`)
- **AND** imported into components that need it

```typescript
// constants/styles.ts
export const CARD_BASE = 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm'
export const BTN_PRIMARY = 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
```

#### Scenario: No component-specific CSS files
- **WHEN** styling a component
- **THEN** no scoped `<style>` blocks with `@apply` directives are used
- **AND** all styling is done via utility classes or TypeScript constants

### Requirement: Migration Standards
The system SHALL maintain visual consistency during and after migration.

#### Scenario: Visual regression prevention
- **WHEN** a component is migrated from custom classes to utility classes
- **THEN** the visual appearance MUST remain identical
- **AND** responsive behavior and dark mode are preserved

#### Scenario: Accessibility preservation
- **WHEN** styles are migrated
- **THEN** all ARIA labels, focus states, and keyboard navigation continue to work
- **AND** focus indicators remain visible and accessible

#### Scenario: Performance maintenance
- **WHEN** build is generated after migration
- **THEN** CSS bundle size SHOULD be equal or smaller
- **AND** no unused custom classes remain in the compiled CSS
- **AND** `main.css` contains only `@import "tailwindcss";`

## REMOVED Requirements

None - this change extends existing requirements rather than removing them.

## Cross-References

- **Extends**: `frontend-architecture` - Builds upon Nuxt 4 framework and CSS architecture
- **Relates to**: `book-browsing` - BookList component styling will be migrated
- **Relates to**: `book-borrowing` - BorrowForm and modal styling will be migrated
