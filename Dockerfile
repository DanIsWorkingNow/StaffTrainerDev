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

# 1. Copy package files to install production dependencies
COPY --from=builder /app/package.json /app/package-lock.json* ./

# 2. Install ONLY production dependencies (this fixes the missing @tanstack/history)
RUN npm install --omit=dev

# 3. Copy the build output
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server/server.js"]
