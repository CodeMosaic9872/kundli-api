import app from './app';
import dotenv from 'dotenv';
import DatabaseService from './services/databaseService';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Initialize database connection
async function startServer() {
  try {
    // Connect to database
    const dbService = DatabaseService.getInstance();
    await dbService.connect();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Kundli API server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📖 API info: http://localhost:${PORT}/api/info`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
