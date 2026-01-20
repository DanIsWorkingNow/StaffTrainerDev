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

# Updated to match your build logs
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Start the server using the path found in your logs
CMD ["node", "dist/server/server.js"]
