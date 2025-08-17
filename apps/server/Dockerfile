FROM oven/bun:1.1.8-alpine AS base

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
COPY apps/server/package.json ./apps/server/
COPY turbo.json ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY apps/server/ ./apps/server/

# Build the application
RUN cd apps/server && bun run build

# Production stage
FROM oven/bun:1.1.8-alpine AS production

WORKDIR /app

# Copy built application
COPY --from=base /app/apps/server/dist ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/server/package.json ./package.json

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S bun -u 1001
USER bun

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["bun", "run", "index.js"]