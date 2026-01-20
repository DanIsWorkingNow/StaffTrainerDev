# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies first (better caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy source and build project
COPY . .
RUN npm run build

# Stage 2: Production Runner
FROM node:20-slim AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy only the production build output
COPY --from=builder /app/.output ./.output

EXPOSE 3000

# Start the Nitro server provided by TanStack Start
CMD ["node", ".output/server/index.mjs"]
