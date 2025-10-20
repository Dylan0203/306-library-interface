# Tailwind CSS Migration Strategy

## Status: In Progress (Option 2 - Gradual Migration)

### Completed ✅
- [x] **Navigation Component** - Fully migrated to Tailwind CSS
  - Responsive layout with flexbox utilities
  - Dark mode support with `dark:` classes
  - NuxtUI components (UButton)
  - Removed custom CSS, now 100% Tailwind

### Strategy

**Approach:** New components use Tailwind, existing components remain unchanged until needed.

**Benefits:**
- No breaking changes to existing UI
- Learn Tailwind gradually
- Easier to review and test changes
- Can compare old vs new approach

### Tailwind Classes Used in Navigation

#### Layout & Spacing
```
container mx-auto px-4        # Container with auto margins and padding
flex flex-wrap items-center   # Flexbox with wrapping and vertical centering
gap-3 gap-6                   # Spacing between flex items
py-4                          # Vertical padding
```

#### Colors & Backgrounds
```
bg-gray-800 dark:bg-gray-950  # Background colors with dark mode
text-white                    # Text color
border-blue-400               # Border color
```

#### Typography
```
text-xl font-bold             # Text size and weight
text-sm font-medium           # Smaller text
```

#### Interactive States
```
hover:text-blue-300           # Hover state
transition-colors             # Smooth color transitions
```

#### Responsive Design
```
hidden md:inline              # Hide on mobile, show on medium+ screens
w-8 h-8                       # Width and height
rounded-full                  # Fully rounded corners
```

### Components to Migrate (Priority Order)

1. ✅ **Navigation** - DONE
2. ⏳ **BookList** - Next (high visibility)
3. ⏳ **Toast** - Simple component
4. ⏳ **BorrowForm** - Modal styling
5. ⏳ **QRCodeModal** - Modal styling
6. ⏳ **Pages** (index, borrowed, print) - Last

### Guidelines for New Components

#### 1. Use Tailwind Utilities
```vue
<!-- ✅ Good -->
<div class="flex items-center gap-4 p-4 bg-white dark:bg-gray-900">
  <h1 class="text-2xl font-bold">Title</h1>
</div>

<!-- ❌ Avoid -->
<div class="custom-container">
  <h1 class="custom-title">Title</h1>
</div>
```

#### 2. Dark Mode Support
```vue
<!-- Always include dark mode variants -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>
```

#### 3. Responsive Design
```vue
<!-- Mobile first approach -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- Cards -->
</div>
```

#### 4. Use NuxtUI Components When Possible
```vue
<UButton color="primary">Click</UButton>
<UCard>Content</UCard>
<UModal>Modal</UModal>
```

### Common Patterns

#### Card Component
```vue
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
  <h3 class="text-lg font-semibold mb-2">Title</h3>
  <p class="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

#### Button
```vue
<!-- Primary -->
<button class="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors">
  Click
</button>

<!-- Secondary -->
<button class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg">
  Cancel
</button>
```

#### Input
```vue
<input 
  type="text"
  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
/>
```

### Existing CSS Files

**Keep for now:**
- `main.css` - Global styles, resets, legacy component styles
- `checkbox.css` - Custom checkbox styles

**Removed:**
- ~~`dark-mode.css`~~ - Replaced by Tailwind `dark:` classes

### Testing Checklist

When migrating a component:
- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Interactive states work (hover, focus, active)
- [ ] Accessibility preserved (ARIA labels, keyboard nav)
- [ ] No visual regressions

### Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [NuxtUI Components](https://ui.nuxt.com/components)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [NuxtUI Color Mode](https://ui.nuxt.com/getting-started/color-mode)

### Notes

- Tailwind is automatically configured by NuxtUI
- No need to manually create `tailwind.config.ts` unless customizing
- All Tailwind utilities are available out of the box
- NuxtUI provides pre-built components with Tailwind styling
