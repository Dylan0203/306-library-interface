# frontend-architecture Specification

## Purpose
TBD - created by archiving change migrate-to-nuxt4. Update Purpose after archive.
## Requirements
### Requirement: Nuxt 4 Framework Integration
The system SHALL use Nuxt 4 as the frontend framework with TypeScript support.

#### Scenario: Development server startup
- **WHEN** developer runs `npm run dev`
- **THEN** Vite development server starts with hot module replacement
- **AND** application is accessible at `http://localhost:1234`

#### Scenario: Production build generation
- **WHEN** developer runs `npm run build`
- **THEN** Nuxt generates optimized static files in `.output/public/` directory
- **AND** all assets are minified and code-split appropriately

#### Scenario: TypeScript type checking
- **WHEN** developer writes TypeScript code with type errors
- **THEN** IDE shows type errors immediately
- **AND** `npx nuxt typecheck` reports all type issues

### Requirement: Project Structure Convention
The system SHALL follow Nuxt 4 directory conventions for organization.

#### Scenario: Auto-import components
- **WHEN** a Vue component is placed in `components/` directory
- **THEN** it is automatically available in all pages and components without explicit import

#### Scenario: File-based routing
- **WHEN** a Vue file is created in `pages/` directory
- **THEN** a corresponding route is automatically generated
- **AND** the route matches the file path structure

#### Scenario: Composables auto-import
- **WHEN** a composable is created in `composables/` directory
- **THEN** it is automatically available throughout the application without import statements

### Requirement: Environment Configuration
The system SHALL use Nuxt runtime config for environment-specific settings.

#### Scenario: API base URL configuration
- **WHEN** `NUXT_PUBLIC_API_BASE_URL` is set in `.env` file
- **THEN** the value is accessible via `useRuntimeConfig().public.apiBaseUrl`
- **AND** the value is replaced at build time for production

#### Scenario: Private environment variables
- **WHEN** sensitive configuration is needed
- **THEN** it is accessed only on server-side using `useRuntimeConfig()` without `public` prefix

### Requirement: Build Optimization
The system SHALL generate optimized production builds for static hosting.

#### Scenario: Static site generation (SSG)
- **WHEN** build runs with SSG mode enabled
- **THEN** all pages are pre-rendered as HTML files
- **AND** client-side hydration works correctly

#### Scenario: Code splitting
- **WHEN** production build is generated
- **THEN** code is automatically split by route and component
- **AND** only required chunks are loaded per page

#### Scenario: Asset optimization
- **WHEN** CSS and JavaScript files are built
- **THEN** they are minified and fingerprinted
- **AND** unused CSS is tree-shaken from production bundle

### Requirement: Development Experience
The system SHALL provide modern development tools and workflows.

#### Scenario: Hot module replacement
- **WHEN** developer saves a Vue component file
- **THEN** changes appear in browser without full page reload
- **AND** component state is preserved when possible

#### Scenario: Error overlay
- **WHEN** runtime error occurs during development
- **THEN** error overlay displays with stack trace and source location
- **AND** clicking stack trace opens file in editor

### Requirement: CSS Architecture
The system SHALL use vanilla CSS with Nuxt's built-in CSS support.

#### Scenario: Global CSS import
- **WHEN** CSS files are listed in `nuxt.config.ts` css array
- **THEN** they are loaded globally on all pages
- **AND** styles are extracted and optimized in production

#### Scenario: Scoped component styles
- **WHEN** component uses `<style scoped>` tag
- **THEN** styles only apply to that component
- **AND** no style leakage occurs to other components

### Requirement: External Script Integration
The system SHALL integrate third-party scripts via Nuxt configuration.

#### Scenario: Google Identity Services script loading
- **WHEN** application initializes
- **THEN** Google Identity Services script is loaded from CDN
- **AND** `google.accounts` API is available globally

#### Scenario: QR Code library integration
- **WHEN** QR code feature is used
- **THEN** npm-based QR code library is available
- **AND** no external CDN dependencies are required

