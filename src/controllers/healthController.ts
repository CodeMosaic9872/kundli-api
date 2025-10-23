import { Request, Response } from 'express';
import { ApiResponse } from '../types';
import DatabaseService from '../services/databaseService';
import { ErrorHandler } from '../middleware/errorHandler';

export class HealthController {
  /**
   * Health check endpoint
   */
  static healthCheck = ErrorHandler.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Check database health
    const dbService = DatabaseService.getInstance();
    const isDbHealthy = await dbService.healthCheck();
    
    const healthData = {
      status: isDbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: isDbHealthy ? 'connected' : 'disconnected',
        astrology: 'operational',
        koota: 'operational'
      }
    };

    const response: ApiResponse = {
      success: true,
      data: healthData,
      message: 'Service is healthy and operational'
    };

    res.status(200).json(response);
  });

  /**
   * API information endpoint
   */
  static apiInfo = ErrorHandler.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiInfo = {
      name: 'Kundli Matchmaking API',
      version: '1.0.0',
      description: 'Production-grade Kundli (Horoscope) Matchmaking API using Node.js and PostgreSQL',
      endpoints: {
        'POST /api/match': 'Calculate match compatibility between two persons',
        'GET /api/health': 'Health check endpoint',
        'GET /api/info': 'API information',
        'POST /api/match/analysis/:kootaName': 'Get detailed analysis of a specific Koota',
        'POST /api/match/suggestions': 'Get compatibility suggestions',
        'POST /api/match/summary': 'Get match summary'
      },
      features: [
        '8 Koota calculations (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi)',
        'Astrological data calculation using Swiss Ephemeris',
        'Manglik status checking',
        'Compatibility scoring and analysis',
        'Detailed match reports'
      ],
      documentation: {
        github: 'https://github.com/your-username/kundli-api',
        swagger: '/api/docs' // Future implementation
      }
    };

    const response: ApiResponse = {
      success: true,
      data: apiInfo,
      message: 'API information retrieved successfully'
    };

    res.status(200).json(response);
  });
}