# Kundli Matchmaking API

A production-grade Kundli (Horoscope) Matchmaking API built with Node.js, TypeScript, and PostgreSQL. This API calculates compatibility scores between two individuals based on their birth details using the traditional Ashtakoota (8 Kootas) system.

## 🌟 Features

- **8 Koota Calculations**: Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi
- **Astrological Data**: Nakshatra, Rashi, Manglik status calculation
- **Compatibility Scoring**: 0-36 point scoring system with percentage
- **RESTful API**: Clean, well-documented endpoints
- **TypeScript**: Full type safety and better maintainability
- **PostgreSQL**: Robust data storage with Prisma ORM
- **Docker Support**: Easy deployment and scaling
- **Comprehensive Testing**: Jest test suite
- **Rate Limiting**: Built-in API protection
- **Error Handling**: Graceful error management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kundli-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## 📚 API Endpoints

### Health & Info
- `GET /api/health` - Health check
- `GET /api/info` - API information

### Match Calculation
- `POST /api/match` - Calculate match compatibility
- `POST /api/match/analysis/:kootaName` - Get specific Koota analysis
- `POST /api/match/suggestions` - Get compatibility suggestions
- `POST /api/match/summary` - Get match summary

## 🔧 Usage Examples

### Calculate Match Compatibility

```bash
curl -X POST http://localhost:3000/api/match \
  -H "Content-Type: application/json" \
  -d '{
    "personA": {
      "name": "John Doe",
      "gender": "MALE",
      "dateOfBirth": "1990-05-15",
      "timeOfBirth": "1990-05-15T10:30:00",
      "placeOfBirth": "New York, USA",
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "personB": {
      "name": "Jane Smith",
      "gender": "FEMALE",
      "dateOfBirth": "1992-08-20",
      "timeOfBirth": "1992-08-20T14:45:00",
      "placeOfBirth": "Los Angeles, USA",
      "latitude": 34.0522,
      "longitude": -118.2437
    }
  }'
```

### Response Format

```json
{
  "success": true,
  "data": {
    "totalScore": 28,
    "maxScore": 36,
    "percentage": 78,
    "kootas": [
      {
        "name": "Varna",
        "score": 1,
        "maxScore": 1,
        "description": "Same Varna - Perfect compatibility"
      }
      // ... other Kootas
    ],
    "personADetails": {
      "nakshatra": "Rohini",
      "rashi": "Taurus",
      "manglik": false
    },
    "personBDetails": {
      "nakshatra": "Magha",
      "rashi": "Leo",
      "manglik": true
    },
    "compatibility": {
      "level": "Good",
      "description": "This is a good match with solid compatibility."
    }
  },
  "message": "Match calculation completed successfully"
}
```

## 🏗️ Architecture

### Core Components

1. **AstrologyService**: Calculates astrological data using Swiss Ephemeris
2. **KootaService**: Implements 8 Koota calculation logic
3. **MatchService**: Orchestrates complete match calculation
4. **Controllers**: Handle HTTP requests and responses
5. **Middleware**: Validation, error handling, rate limiting

### Database Schema

- **Users**: Store birth data and profiles
- **Matches**: Store computed match results
- **Koota Rules**: Static lookup tables for scoring
- **API Keys**: Future authentication support

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t kundli-api .

# Run container
docker run -p 3000:3000 -e DATABASE_URL="your-db-url" kundli-api
```

## 📊 8 Kootas Explained

1. **Varna (1 point)**: Caste compatibility
2. **Vashya (2 points)**: Mutual attraction and control
3. **Tara (3 points)**: Birth star compatibility
4. **Yoni (4 points)**: Sexual compatibility
5. **Graha Maitri (5 points)**: Planetary friendship
6. **Gana (6 points)**: Temperament compatibility
7. **Bhakoot (7 points)**: Zodiac sign compatibility
8. **Nadi (8 points)**: Genetic compatibility

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses
- **CORS Protection**: Configurable cross-origin policies
- **Helmet**: Security headers

## 🚀 Production Deployment

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:port/database"
NODE_ENV="production"
PORT=3000
JWT_SECRET="your-secret-key"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN="https://yourdomain.com"
```

### Deployment Options

1. **Render**: One-click deployment
2. **Fly.io**: Global edge deployment
3. **AWS**: ECS or Lambda
4. **DigitalOcean**: App Platform
5. **Heroku**: Container deployment

## 📈 Performance Considerations

- **Caching**: Redis for frequently accessed data
- **Database Indexing**: Optimized queries
- **Connection Pooling**: Efficient database connections
- **Rate Limiting**: API protection
- **Monitoring**: Health checks and metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check `/api/info` endpoint
- **Health Check**: `/api/health`
- **Issues**: GitHub Issues
- **Email**: your-email@domain.com

## 🔮 Future Enhancements

- [ ] JWT Authentication
- [ ] Redis Caching
- [ ] Swagger Documentation
- [ ] Advanced Astrological Features
- [ ] Mobile SDK
- [ ] Webhook Support
- [ ] Analytics Dashboard
- [ ] Multi-language Support

---

**Built with ❤️ for the astrology community**
