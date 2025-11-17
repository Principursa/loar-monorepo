# Multi-stage build for both development and production
FROM oven/bun:1.1.8-alpine AS base

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package files
COPY package.json bun.lock ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY apps/indexer/package.json ./apps/indexer/
COPY turbo.json ./

# Development stage - for local dev dependencies
FROM base AS development
RUN bun install --frozen-lockfile && \
    rm -rf ~/.bun/install/cache && \
    rm -rf /tmp/*
CMD ["tail", "-f", "/dev/null"]

# Build stage - for production builds
FROM base AS builder
RUN bun install --frozen-lockfile && \
    rm -rf ~/.bun/install/cache && \
    rm -rf /tmp/*

# Copy source code
COPY apps/server/src ./apps/server/src
COPY apps/server/tsconfig.json ./apps/server/
COPY apps/server/drizzle.config.ts ./apps/server/

# Build the application using bun's native build instead of tsdown
RUN cd apps/server && bun build src/index.ts --outdir dist --target node

# Production stage
FROM oven/bun:1.1.8-alpine AS production

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package files for production dependencies only
COPY package.json bun.lock ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY apps/indexer/package.json ./apps/indexer/

# Install only production dependencies
RUN bun install --production --frozen-lockfile && \
    rm -rf ~/.bun/install/cache && \
    rm -rf /tmp/*

# Copy built application from builder stage
COPY --from=builder /app/apps/server/dist ./apps/server/dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S bun -u 1001

USER bun

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Default to production
CMD ["bun", "run", "apps/server/dist/index.js"]