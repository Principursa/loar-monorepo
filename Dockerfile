# Simple Dockerfile - build everything in one stage to avoid workspace issues
FROM oven/bun:1.1.8-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl nodejs npm

# Copy entire monorepo
COPY . .

# Build web frontend using npm (to avoid Rollup issues)
WORKDIR /app/apps/web
RUN npm install && npm run build

# Build and setup server
WORKDIR /app/apps/server
RUN bun install
RUN bun add drizzle-kit
RUN bun run build

EXPOSE 3000

# Start script
CMD ["sh", "-c", "bun run db:push && bun run start"]