# Dockerfile for a Next.js application

# 1. Base image for dependencies and building
# Using Alpine Linux for a small image size
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# 2. Install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# 3. Build the application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 4. Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
