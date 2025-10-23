#!/bin/bash

# Kundli API Deployment Script
echo "🚀 Starting Kundli API Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create logs directory
mkdir -p logs

# Set environment variables
export NODE_ENV=production
export DATABASE_URL=postgresql://kundli_user:kundli_password@postgres:5432/kundli
export JWT_SECRET=$(openssl rand -base64 32)

echo "📦 Building Docker images..."
docker-compose build --no-cache

echo "🗄️ Starting database..."
docker-compose up -d postgres

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "🔧 Running database migrations..."
docker-compose exec kundli-api npx prisma generate
docker-compose exec kundli-api npx prisma db push

echo "🌱 Seeding database..."
docker-compose exec kundli-api npm run db:seed

echo "🚀 Starting Kundli API..."
docker-compose up -d kundli-api

echo "⏳ Waiting for API to be ready..."
sleep 15

echo "🔍 Checking API health..."
curl -f http://localhost:3000/api/health || echo "❌ API health check failed"

echo "✅ Deployment completed!"
echo "🌐 API is running at: http://localhost:3000"
echo "📊 Health check: http://localhost:3000/api/health"
echo "📚 API documentation: http://localhost:3000/api/docs"

# Show running containers
echo "📋 Running containers:"
docker-compose ps
