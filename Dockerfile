# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production Runner
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy the self-contained Nitro output
COPY --from=builder /app/.output ./.output

EXPOSE 3000

# This is the standard entry point for TanStack Start / Nitro
CMD ["node", ".output/server/index.mjs"]
