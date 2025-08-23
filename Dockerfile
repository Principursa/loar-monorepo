# Multi-stage Dockerfile for LOAR monorepo
FROM node:18-alpine AS web-builder

# Build web frontend
WORKDIR /app
COPY package.json bun.lockb ./
COPY apps/web/package.json ./apps/web/
COPY packages ./packages
RUN npm install -g bun
RUN bun install

COPY apps/web ./apps/web
WORKDIR /app/apps/web
RUN bun run build

# Server build stage
FROM oven/bun:1.1.8-alpine AS server-builder

WORKDIR /app
COPY package.json bun.lockb ./
COPY apps/server/package.json ./apps/server/
COPY packages ./packages
RUN bun install

COPY apps/server ./apps/server
WORKDIR /app/apps/server
RUN bun run build

# Production stage
FROM oven/bun:1.1.8-alpine AS production

# Install system dependencies
RUN apk add --no-cache curl

WORKDIR /app

# Copy built server
COPY --from=server-builder /app/apps/server/dist ./apps/server/dist
COPY --from=server-builder /app/apps/server/package.json ./apps/server/
COPY --from=server-builder /app/node_modules ./node_modules

# Copy built web frontend
COPY --from=web-builder /app/apps/web/dist ./apps/web/dist

# Copy root package.json for workspace resolution
COPY package.json bun.lockb ./
COPY packages ./packages

WORKDIR /app/apps/server

# Install drizzle-kit for migrations
RUN bun add drizzle-kit

EXPOSE 3000

# Start script that runs migrations then starts server
CMD ["sh", "-c", "bun run db:push && bun run dist/index.js"]