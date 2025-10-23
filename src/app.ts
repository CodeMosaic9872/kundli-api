import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import matchRoutes from './routes/matchRoutes';
import healthRoutes from './routes/healthRoutes';

// Import middleware
import { ErrorHandler } from './middleware/errorHandler';
import { ValidationMiddleware } from './middleware/validation';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Request validation middleware
app.use('/api', ValidationMiddleware.validateJsonContentType);

// Routes
app.use('/api', healthRoutes);
app.use('/api', matchRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Kundli Matchmaking API',
    version: '1.0.0',
    documentation: '/api/info',
    health: '/api/health'
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  ErrorHandler.handleNotFound(req, res);
});

// Global error handler
app.use(ErrorHandler.handleError);

export default app;
