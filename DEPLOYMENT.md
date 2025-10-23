# 🚀 Kundli API Deployment Guide

## 📋 Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 2.0+)
- 2GB RAM minimum
- 10GB disk space

## 🐳 Quick Deployment

### Option 1: Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd kundli

# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Option 2: Manual Docker Commands

```bash
# Build the image
docker build -t kundli-api .

# Run with database
docker-compose up -d
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://kundli_user:kundli_password@postgres:5432/kundli
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=*
```

### Database Setup

The deployment script will automatically:
- Start PostgreSQL database
- Run Prisma migrations
- Seed the database with initial data

## 🌐 Access Points

- **API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health
- **Database**: localhost:5432
- **Redis**: localhost:6379

## 📊 Monitoring

### Health Checks

```bash
# Check API health
curl http://localhost:3000/api/health

# Check container status
docker-compose ps

# View logs
docker-compose logs kundli-api
```

### Performance Monitoring

```bash
# View resource usage
docker stats

# Check database connections
docker-compose exec postgres psql -U kundli_user -d kundli -c "SELECT * FROM pg_stat_activity;"
```

## 🔄 Updates

### Update Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Migrations

```bash
# Run new migrations
docker-compose exec kundli-api npx prisma db push

# Reset database (WARNING: This will delete all data)
docker-compose exec kundli-api npx prisma migrate reset
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using port 3000
   lsof -i :3000
   
   # Kill the process
   kill -9 <PID>
   ```

2. **Database connection failed**
   ```bash
   # Check database logs
   docker-compose logs postgres
   
   # Restart database
   docker-compose restart postgres
   ```

3. **API not responding**
   ```bash
   # Check API logs
   docker-compose logs kundli-api
   
   # Restart API
   docker-compose restart kundli-api
   ```

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs kundli-api
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f kundli-api
```

## 🔒 Security

### Production Security

1. **Change default passwords**
2. **Use strong JWT secrets**
3. **Configure CORS properly**
4. **Enable HTTPS**
5. **Use environment variables for secrets**

### Firewall Configuration

```bash
# Allow only necessary ports
ufw allow 3000/tcp  # API
ufw allow 5432/tcp  # Database (if external access needed)
ufw deny 6379/tcp  # Redis (internal only)
```

## 📈 Scaling

### Horizontal Scaling

```bash
# Scale API instances
docker-compose up -d --scale kundli-api=3

# Use load balancer (nginx)
# Add nginx configuration for load balancing
```

### Database Scaling

```bash
# Use external PostgreSQL
# Update DATABASE_URL in .env
# Remove postgres service from docker-compose.yml
```

## 🗑️ Cleanup

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose down -v
```

### Remove Images

```bash
# Remove unused images
docker image prune

# Remove specific image
docker rmi kundli-api
```

## 📞 Support

For issues and questions:
- Check logs: `docker-compose logs`
- Review configuration: `.env` file
- Test API: `curl http://localhost:3000/api/health`
