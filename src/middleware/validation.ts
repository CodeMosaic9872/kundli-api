import { Request, Response, NextFunction } from 'express';
import { ApiResponse, BirthDetails } from '../types';

export class ValidationMiddleware {
  /**
   * Validate birth details structure
   */
  static validateBirthDetails(birthDetails: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!birthDetails || typeof birthDetails !== 'object') {
      errors.push('Birth details must be an object');
      return { isValid: false, errors };
    }

    // Required fields
    const requiredFields = ['name', 'gender', 'dateOfBirth', 'timeOfBirth', 'placeOfBirth'];
    for (const field of requiredFields) {
      if (!birthDetails[field]) {
        errors.push(`${field} is required`);
      }
    }

    // Validate name
    if (birthDetails.name && typeof birthDetails.name !== 'string') {
      errors.push('Name must be a string');
    } else if (birthDetails.name && birthDetails.name.trim().length === 0) {
      errors.push('Name cannot be empty');
    }

    // Validate gender
    if (birthDetails.gender && !['MALE', 'FEMALE', 'OTHER'].includes(birthDetails.gender)) {
      errors.push('Gender must be MALE, FEMALE, or OTHER');
    }

    // Validate date of birth
    if (birthDetails.dateOfBirth) {
      const date = new Date(birthDetails.dateOfBirth);
      if (isNaN(date.getTime())) {
        errors.push('Invalid date of birth format');
      } else if (date > new Date()) {
        errors.push('Date of birth cannot be in the future');
      }
    }

    // Validate time of birth
    if (birthDetails.timeOfBirth) {
      const time = new Date(birthDetails.timeOfBirth);
      if (isNaN(time.getTime())) {
        errors.push('Invalid time of birth format');
      }
    }

    // Validate place of birth
    if (birthDetails.placeOfBirth && typeof birthDetails.placeOfBirth !== 'string') {
      errors.push('Place of birth must be a string');
    } else if (birthDetails.placeOfBirth && birthDetails.placeOfBirth.trim().length === 0) {
      errors.push('Place of birth cannot be empty');
    }

    // Validate optional fields
    if (birthDetails.latitude !== undefined) {
      if (typeof birthDetails.latitude !== 'number' || birthDetails.latitude < -90 || birthDetails.latitude > 90) {
        errors.push('Latitude must be a number between -90 and 90');
      }
    }

    if (birthDetails.longitude !== undefined) {
      if (typeof birthDetails.longitude !== 'number' || birthDetails.longitude < -180 || birthDetails.longitude > 180) {
        errors.push('Longitude must be a number between -180 and 180');
      }
    }

    if (birthDetails.timezone && typeof birthDetails.timezone !== 'string') {
      errors.push('Timezone must be a string');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate match request
   */
  static validateMatchRequest(req: Request, res: Response, next: NextFunction): void {
    const { personA, personB } = req.body;

    if (!personA || !personB) {
      const response: ApiResponse = {
        success: false,
        error: 'Both personA and personB are required',
        message: 'Please provide birth details for both persons'
      };
      res.status(400).json(response);
      return;
    }

    // Validate personA
    const personAValidation = this.validateBirthDetails(personA);
    if (!personAValidation.isValid) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid personA data',
        message: personAValidation.errors.join(', ')
      };
      res.status(400).json(response);
      return;
    }

    // Validate personB
    const personBValidation = this.validateBirthDetails(personB);
    if (!personBValidation.isValid) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid personB data',
        message: personBValidation.errors.join(', ')
      };
      res.status(400).json(response);
      return;
    }

    next();
  }

  /**
   * Validate Koota name parameter
   */
  static validateKootaName(req: Request, res: Response, next: NextFunction): void {
    const { kootaName } = req.params;
    const validKootas = ['Varna', 'Vashya', 'Tara', 'Yoni', 'GrahaMaitri', 'Gana', 'Bhakoot', 'Nadi'];

    if (!kootaName) {
      const response: ApiResponse = {
        success: false,
        error: 'Koota name is required',
        message: 'Please specify which Koota to analyze'
      };
      res.status(400).json(response);
      return;
    }

    if (!validKootas.includes(kootaName)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid Koota name',
        message: `Valid Koota names are: ${validKootas.join(', ')}`
      };
      res.status(400).json(response);
      return;
    }

    next();
  }

  /**
   * Validate JSON content type
   */
  static validateJsonContentType(req: Request, res: Response, next: NextFunction): void {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      if (!req.is('application/json')) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid content type',
          message: 'Content-Type must be application/json'
        };
        res.status(400).json(response);
        return;
      }
    }
    next();
  }
}
