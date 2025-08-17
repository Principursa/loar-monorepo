FROM oven/bun:1.1.8-alpine AS base

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY turbo.json ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY apps/web/ ./apps/web/

# Build the application
RUN cd apps/web && bun run build

# Production stage
FROM nginx:alpine AS production

# Copy built application
COPY --from=base /app/apps/web/dist /usr/share/nginx/html

# Copy custom nginx config
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Install curl for health checks
RUN apk add --no-cache curl

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001 || exit 1

CMD ["nginx", "-g", "daemon off;"]