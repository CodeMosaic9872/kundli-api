import request from 'supertest';
import app from '../app';

describe('API Endpoints', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('uptime');
    });
  });

  describe('API Info', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/api/info')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('version');
      expect(response.body.data).toHaveProperty('endpoints');
    });
  });

  describe('Match Calculation', () => {
    const samplePersonA = {
      name: 'John Doe',
      gender: 'MALE',
      dateOfBirth: '1990-05-15',
      timeOfBirth: '1990-05-15T10:30:00',
      placeOfBirth: 'New York, USA',
      latitude: 40.7128,
      longitude: -74.0060
    };

    const samplePersonB = {
      name: 'Jane Smith',
      gender: 'FEMALE',
      dateOfBirth: '1992-08-20',
      timeOfBirth: '1992-08-20T14:45:00',
      placeOfBirth: 'Los Angeles, USA',
      latitude: 34.0522,
      longitude: -118.2437
    };

    it('should calculate match successfully', async () => {
      const response = await request(app)
        .post('/api/match')
        .send({
          personA: samplePersonA,
          personB: samplePersonB
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalScore');
      expect(response.body.data).toHaveProperty('maxScore');
      expect(response.body.data).toHaveProperty('percentage');
      expect(response.body.data).toHaveProperty('kootas');
      expect(response.body.data.kootas).toHaveLength(8);
    });

    it('should return error for missing personA', async () => {
      const response = await request(app)
        .post('/api/match')
        .send({
          personB: samplePersonB
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('personA');
    });

    it('should return error for missing personB', async () => {
      const response = await request(app)
        .post('/api/match')
        .send({
          personA: samplePersonA
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('personB');
    });

    it('should return error for invalid birth details', async () => {
      const response = await request(app)
        .post('/api/match')
        .send({
          personA: {
            name: '',
            gender: 'INVALID',
            dateOfBirth: 'invalid-date',
            timeOfBirth: 'invalid-time',
            placeOfBirth: ''
          },
          personB: samplePersonB
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Match Analysis', () => {
    const samplePersonA = {
      name: 'John Doe',
      gender: 'MALE',
      dateOfBirth: '1990-05-15',
      timeOfBirth: '1990-05-15T10:30:00',
      placeOfBirth: 'New York, USA'
    };

    const samplePersonB = {
      name: 'Jane Smith',
      gender: 'FEMALE',
      dateOfBirth: '1992-08-20',
      timeOfBirth: '1992-08-20T14:45:00',
      placeOfBirth: 'Los Angeles, USA'
    };

    it('should return Koota analysis for valid Koota name', async () => {
      const response = await request(app)
        .post('/api/match/analysis/Varna')
        .send({
          personA: samplePersonA,
          personB: samplePersonB
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('name', 'Varna');
      expect(response.body.data).toHaveProperty('score');
      expect(response.body.data).toHaveProperty('maxScore');
    });

    it('should return error for invalid Koota name', async () => {
      const response = await request(app)
        .post('/api/match/analysis/InvalidKoota')
        .send({
          personA: samplePersonA,
          personB: samplePersonB
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid Koota name');
    });
  });

  describe('Match Suggestions', () => {
    const samplePersonA = {
      name: 'John Doe',
      gender: 'MALE',
      dateOfBirth: '1990-05-15',
      timeOfBirth: '1990-05-15T10:30:00',
      placeOfBirth: 'New York, USA'
    };

    const samplePersonB = {
      name: 'Jane Smith',
      gender: 'FEMALE',
      dateOfBirth: '1992-08-20',
      timeOfBirth: '1992-08-20T14:45:00',
      placeOfBirth: 'Los Angeles, USA'
    };

    it('should return compatibility suggestions', async () => {
      const response = await request(app)
        .post('/api/match/suggestions')
        .send({
          personA: samplePersonA,
          personB: samplePersonB
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('suggestions');
      expect(response.body.data).toHaveProperty('matchSummary');
      expect(Array.isArray(response.body.data.suggestions)).toBe(true);
    });
  });

  describe('Match Summary', () => {
    const samplePersonA = {
      name: 'John Doe',
      gender: 'MALE',
      dateOfBirth: '1990-05-15',
      timeOfBirth: '1990-05-15T10:30:00',
      placeOfBirth: 'New York, USA'
    };

    const samplePersonB = {
      name: 'Jane Smith',
      gender: 'FEMALE',
      dateOfBirth: '1992-08-20',
      timeOfBirth: '1992-08-20T14:45:00',
      placeOfBirth: 'Los Angeles, USA'
    };

    it('should return match summary', async () => {
      const response = await request(app)
        .post('/api/match/summary')
        .send({
          personA: samplePersonA,
          personB: samplePersonB
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalScore');
      expect(response.body.data).toHaveProperty('maxScore');
      expect(response.body.data).toHaveProperty('percentage');
      expect(response.body.data).toHaveProperty('compatibility');
      expect(response.body.data).toHaveProperty('keyStrengths');
      expect(response.body.data).toHaveProperty('keyWeaknesses');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Route not found');
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/match')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
