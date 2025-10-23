// Core types for Kundli API

export interface BirthDetails {
  name?: string; // Optional for traditional 36-point Guna Milan
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string; // ISO date string
  timeOfBirth: string; // ISO time string
  placeOfBirth: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export interface MatchRequest {
  personA: BirthDetails;
  personB: BirthDetails;
}

export interface KootaScore {
  name: string;
  score: number;
  maxScore: number;
  description: string;
  fractionalScore?: number; // For half-point calculations in traditional Vedic astrology
}

export interface MatchResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  kootas: KootaScore[];
  personADetails: {
    nakshatra: string;
    rashi: string;
    manglik: boolean;
  };
  personBDetails: {
    nakshatra: string;
    rashi: string;
    manglik: boolean;
  };
  compatibility: {
    level: 'Excellent' | 'Good' | 'Average' | 'Poor';
    description: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AstrologicalData {
  nakshatra: string;
  rashi: string;
  longitude: number;
  latitude: number;
  ascendant: number;
  sunPosition: number;
  moonPosition: number;
  marsPosition: number;
  venusPosition: number;
  jupiterPosition: number;
  saturnPosition: number;
  mercuryPosition: number;
  ketuPosition: number;
  rahuPosition: number;
  houseCusps: number[];
}

export interface NakshatraInfo {
  name: string;
  lord: string;
  gana: string;
  yoni: string;
  nadi: string;
  varna: string;
  vashya: string;
}

export interface RashiInfo {
  name: string;
  element: string;
  quality: string;
  lord: string;
  sign: number;
}

// Error types
export class KundliError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'KundliError';
  }
}

export class ValidationError extends KundliError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class CalculationError extends KundliError {
  constructor(message: string) {
    super(message, 'CALCULATION_ERROR', 500);
  }
}
