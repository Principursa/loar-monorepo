FROM oven/bun:1.1.8-alpine AS builder

WORKDIR /app

# Copy package files for monorepo context
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/
COPY turbo.json ./

# Install dependencies
RUN bun install --frozen-lockfile && \
    rm -rf ~/.bun/install/cache && \
    rm -rf /tmp/*

# Copy only web app source code and minimal server files for build
COPY apps/web/ ./apps/web/
COPY apps/server/tsconfig.json ./apps/server/
COPY apps/server/src/routers ./apps/server/src/routers

# Build web app only  
RUN cd apps/web && \
    bun run build && \
    rm -rf src node_modules

# Production stage - lightweight nginx
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy custom nginx config  
COPY nginx.simple.conf /etc/nginx/conf.d/default.conf

# Install curl for health checks
RUN apk add --no-cache curl

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]