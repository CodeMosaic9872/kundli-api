import { EnhancedMatchService } from '../services/enhancedMatchService';
import { BirthDetails } from '../types';

describe('EnhancedMatchService', () => {
  const samplePersonA: BirthDetails = {
    name: 'John Doe',
    gender: 'MALE',
    dateOfBirth: '1990-05-15',
    timeOfBirth: '1990-05-15T10:30:00',
    placeOfBirth: 'New York, USA',
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: 'America/New_York'
  };

  const samplePersonB: BirthDetails = {
    name: 'Jane Smith',
    gender: 'FEMALE',
    dateOfBirth: '1992-08-20',
    timeOfBirth: '1992-08-20T14:45:00',
    placeOfBirth: 'Los Angeles, USA',
    latitude: 34.0522,
    longitude: -118.2437,
    timezone: 'America/Los_Angeles'
  };

  describe('calculateEnhancedMatch', () => {
    it('should calculate enhanced match with Dasha and transit analysis', async () => {
      const result = await EnhancedMatchService.calculateEnhancedMatch(samplePersonA, samplePersonB);
      
      expect(result).toBeDefined();
      expect(result.totalScore).toBeGreaterThanOrEqual(0);
      expect(result.maxScore).toBe(36);
      expect(result.percentage).toBeGreaterThanOrEqual(0);
      expect(result.percentage).toBeLessThanOrEqual(100);
      
      // Enhanced features
      expect(result.dashaCompatibility).toBeDefined();
      expect(result.dashaCompatibility.personADasha).toBeDefined();
      expect(result.dashaCompatibility.personBDasha).toBeDefined();
      expect(result.dashaCompatibility.compatibility).toBeDefined();
      
      expect(result.transitAnalysis).toBeDefined();
      expect(result.transitAnalysis.currentTransits).toBeDefined();
      expect(result.transitAnalysis.mutualInfluence).toBeDefined();
      expect(result.transitAnalysis.recommendations).toBeDefined();
      
      expect(result.planetaryAspects).toBeDefined();
      expect(result.planetaryAspects.aspects).toBeDefined();
      expect(result.planetaryAspects.overallHarmony).toBeGreaterThanOrEqual(0);
      expect(result.planetaryAspects.keyAspects).toBeDefined();
    });
  });

  describe('getComprehensiveAnalysis', () => {
    it('should return comprehensive analysis with all factors', async () => {
      const analysis = await EnhancedMatchService.getComprehensiveAnalysis(samplePersonA, samplePersonB);
      
      expect(analysis).toBeDefined();
      expect(analysis.basicCompatibility).toBeGreaterThanOrEqual(0);
      expect(analysis.basicCompatibility).toBeLessThanOrEqual(100);
      expect(analysis.dashaCompatibility).toBeDefined();
      expect(analysis.transitInfluence).toBeDefined();
      expect(analysis.planetaryHarmony).toBeGreaterThanOrEqual(0);
      expect(analysis.overallScore).toBeGreaterThanOrEqual(0);
      expect(analysis.overallScore).toBeLessThanOrEqual(100);
      expect(Array.isArray(analysis.recommendations)).toBe(true);
    });
  });
});
