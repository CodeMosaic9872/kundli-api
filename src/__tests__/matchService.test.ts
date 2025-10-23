import { MatchService } from '../services/matchService';
import { BirthDetails } from '../types';

describe('MatchService', () => {
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

  describe('calculateMatch', () => {
    it('should calculate match successfully with valid input', async () => {
      const result = await MatchService.calculateMatch(samplePersonA, samplePersonB);
      
      expect(result).toBeDefined();
      expect(result.totalScore).toBeGreaterThanOrEqual(0);
      expect(result.maxScore).toBe(36); // Sum of all Koota max scores
      expect(result.percentage).toBeGreaterThanOrEqual(0);
      expect(result.percentage).toBeLessThanOrEqual(100);
      expect(result.kootas).toHaveLength(8);
      expect(result.personADetails).toBeDefined();
      expect(result.personBDetails).toBeDefined();
      expect(result.compatibility).toBeDefined();
    });

    it('should throw error for invalid birth details', async () => {
      const invalidPerson: BirthDetails = {
        name: '',
        gender: 'INVALID' as any,
        dateOfBirth: 'invalid-date',
        timeOfBirth: 'invalid-time',
        placeOfBirth: '',
        latitude: 200, // Invalid latitude
        longitude: 200 // Invalid longitude
      };

      await expect(MatchService.calculateMatch(invalidPerson, samplePersonB))
        .rejects.toThrow();
    });

    it('should handle future birth dates', async () => {
      const futurePerson: BirthDetails = {
        ...samplePersonA,
        dateOfBirth: '2030-01-01'
      };

      await expect(MatchService.calculateMatch(futurePerson, samplePersonB))
        .rejects.toThrow('Birth date cannot be in the future');
    });
  });

  describe('getMatchSummary', () => {
    it('should return match summary', async () => {
      const matchResult = await MatchService.calculateMatch(samplePersonA, samplePersonB);
      const summary = MatchService.getMatchSummary(matchResult);
      
      expect(summary).toBeDefined();
      expect(summary.totalScore).toBe(matchResult.totalScore);
      expect(summary.maxScore).toBe(matchResult.maxScore);
      expect(summary.percentage).toBe(matchResult.percentage);
      expect(summary.compatibility).toBeDefined();
      expect(Array.isArray(summary.keyStrengths)).toBe(true);
      expect(Array.isArray(summary.keyWeaknesses)).toBe(true);
    });
  });

  describe('getCompatibilitySuggestions', () => {
    it('should return compatibility suggestions', async () => {
      const matchResult = await MatchService.calculateMatch(samplePersonA, samplePersonB);
      const suggestions = MatchService.getCompatibilitySuggestions(matchResult);
      
      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });
});
