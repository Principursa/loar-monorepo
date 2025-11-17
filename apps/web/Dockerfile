FROM oven/bun:1.1.8-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/
COPY apps/indexer/package.json ./apps/indexer/
COPY turbo.json ./

# Install dependencies and clean up in single layer
RUN bun install --frozen-lockfile && \
    rm -rf ~/.bun/install/cache && \
    rm -rf /tmp/*

# Copy source code
COPY apps/web/ ./apps/web/

# Copy referenced server tsconfig for TypeScript project references
COPY apps/server/tsconfig.json ./apps/server/tsconfig.json

# Build and clean up
RUN cd apps/web && \
    bun run build && \
    rm -rf src node_modules && \
    rm -rf ../node_modules

# Production stage - lightweight caddy
FROM caddy:2-alpine

# Copy built application
COPY --from=builder /app/apps/web/dist /usr/share/caddy

# Copy custom caddy config
COPY apps/web/Caddyfile /etc/caddy/Caddyfile

# Install curl for health checks
RUN apk add --no-cache curl

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]