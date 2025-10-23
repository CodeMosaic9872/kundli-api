# Multi-stage build for production optimization
FROM node:18-alpine AS base

# Install system dependencies for Swiss Ephemeris
RUN apk add --no-cache \
    build-base \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base AS development
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production stage
FROM node:18-alpine AS production

# Install runtime dependencies and build tools for native modules
RUN apk add --no-cache \
    dumb-init \
    build-base \
    python3 \
    python3-dev \
    py3-setuptools \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S kundli -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Clean up build tools to reduce image size
RUN apk del build-base python3 python3-dev py3-setuptools make g++

# Create logs directory
RUN mkdir -p logs && chown -R kundli:nodejs logs

# Change ownership to non-root user
RUN chown -R kundli:nodejs /app
USER kundli

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "start"]