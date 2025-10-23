import { Request, Response, NextFunction } from 'express';
import { ApiResponse, KundliError } from '../types';

export class ErrorHandler {
  /**
   * Global error handler middleware
   */
  static handleError(error: Error, req: Request, res: Response, next: NextFunction): void {
    console.error('Error occurred:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });

    let statusCode = 500;
    let message = 'Internal server error';

    if (error instanceof KundliError) {
      statusCode = error.statusCode;
      message = error.message;
    } else if (error.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation error: ' + error.message;
    } else if (error.name === 'SyntaxError') {
      statusCode = 400;
      message = 'Invalid JSON syntax';
    } else if (error.name === 'TypeError') {
      statusCode = 400;
      message = 'Type error: ' + error.message;
    }

    const response: ApiResponse = {
      success: false,
      error: message,
      message: 'An error occurred while processing your request'
    };

    res.status(statusCode).json(response);
  }

  /**
   * 404 handler for undefined routes
   */
  static handleNotFound(req: Request, res: Response): void {
    const response: ApiResponse = {
      success: false,
      error: 'Route not found',
      message: `The requested route ${req.method} ${req.originalUrl} does not exist`
    };

    res.status(404).json(response);
  }

  /**
   * Async error wrapper for controllers
   */
  static asyncHandler(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}
