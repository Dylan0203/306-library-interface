# Multi-stage build for Nuxt static site
# Stage 1: Build the application
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy application source
COPY . .

# Build static site
RUN bun run build

# Stage 2: Production - simple HTTP server
FROM oven/bun:1-slim

WORKDIR /app

# Copy built static files from builder
COPY --from=builder /app/.output/public ./public

# Install serve package globally
RUN bun install -g serve

# Expose port 3000 (Kamal proxy will forward 80/443 to this)
EXPOSE 3000

# Serve static files on port 3000
CMD ["serve", "public", "-l", "3000"]
