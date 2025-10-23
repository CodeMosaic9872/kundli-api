# Simple Dockerfile for Kundli API
FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache \
    dumb-init \
    build-base \
    python3 \
    python3-dev \
    py3-setuptools \
    make \
    g++

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Clean up build dependencies
RUN apk del build-base python3-dev py3-setuptools make g++

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S kundli -u 1001

# Change ownership
RUN chown -R kundli:nodejs /app
USER kundli

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]