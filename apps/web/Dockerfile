FROM oven/bun:1.1.8-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY turbo.json ./

# Install dependencies and clean up in single layer
RUN bun install --frozen-lockfile && \
    rm -rf ~/.bun/install/cache && \
    rm -rf /tmp/*

# Copy source code
COPY apps/web/ ./apps/web/

# Build and clean up
RUN cd apps/web && \
    bun run build && \
    rm -rf src node_modules && \
    rm -rf ../node_modules

# Production stage - lightweight nginx
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy custom nginx config
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Install curl for health checks
RUN apk add --no-cache curl

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001 || exit 1

CMD ["nginx", "-g", "daemon off;"]