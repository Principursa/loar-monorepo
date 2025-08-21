FROM oven/bun:1.1.8-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package files
COPY package.json bun.lock ./
COPY apps/server/package.json ./apps/server/
COPY turbo.json ./

# Install all dependencies (including drizzle-kit for DB setup)
RUN bun install --frozen-lockfile && \
    rm -rf ~/.bun/install/cache && \
    rm -rf /tmp/*

# Copy source code
COPY apps/server/src ./apps/server/src
COPY apps/server/tsconfig.json ./apps/server/

# Build and clean up in single layer
RUN cd apps/server && \
    bun run build && \
    rm -rf src tsconfig.json && \
    rm -rf ../node_modules/.cache && \
    rm -rf ~/.bun/install/cache

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S bun -u 1001

USER bun

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["bun", "run", "apps/server/dist/index.js"]