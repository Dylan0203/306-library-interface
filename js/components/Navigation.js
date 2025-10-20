/**
 * Navigation Component
 * Displays page navigation with current page highlighting
 */

export const Navigation = {
  props: {
    current: {
      type: String,
      required: true,
      validator: (value) => ["available", "borrowed"].includes(value),
    },
  },
  template: `
    <nav class="navigation">
      <div class="nav-container">
        <h2 class="nav-title">306 Library System</h2>
        <ul class="nav-links">
          <li>
            <a
              href="index.html"
              :class="{ active: current === 'available' }"
              class="nav-link"
            >
              Available Books
            </a>
          </li>
          <li>
            <a
              href="borrowed.html"
              :class="{ active: current === 'borrowed' }"
              class="nav-link"
            >
              Borrowed Books
            </a>
          </li>
        </ul>
      </div>
    </nav>
  `,
};
