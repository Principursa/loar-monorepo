FROM oven/bun:1.1.8-alpine AS builder

WORKDIR /app/web

# Copy web app package files only
COPY apps/web/package.json ./
COPY apps/web/bun.lock* ./

# Install only web app dependencies
RUN bun install --frozen-lockfile && \
    rm -rf ~/.bun/install/cache && \
    rm -rf /tmp/*

# Copy source code
COPY apps/web/ ./

# Build and clean up
RUN bun run build && \
    rm -rf src node_modules

# Production stage - lightweight nginx
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/web/dist /usr/share/nginx/html

# Copy custom nginx config  
COPY nginx.simple.conf /etc/nginx/conf.d/default.conf

# Install curl for health checks
RUN apk add --no-cache curl

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]