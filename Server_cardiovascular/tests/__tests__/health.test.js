const request = require('supertest');
const app = require('../../src/app');

describe('Health Endpoints', () => {
  describe('POST /api/health/profile', () => {
    it('should create health profile', async () => {
      const { user, token } = await createTestUser();
      const profileData = {
        age: 45,
        weight: 75.5,
        height: 175,
        bloodPressure: '120/80',
        cholesterolLevel: 180,
        medicalConditions: ['Hypertension'],
        allergies: ['None']
      };

      const response = await request(app)
        .post('/api/health/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(profileData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('userId', user.id);
      expect(response.body).toHaveProperty('bmi');
      expect(response.body.medicalConditions).toEqual(expect.arrayContaining(profileData.medicalConditions));
    });

    it('should validate required fields', async () => {
      const { token } = await createTestUser();
      const response = await request(app)
        .post('/api/health/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          age: -1, // invalid age
          weight: 0, // invalid weight
          height: 0 // invalid height
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should update existing health profile', async () => {
      const { user, token } = await createTestUser();
      await createTestHealthProfile(user.id);

      const updates = {
        weight: 73.5,
        bloodPressure: '118/75',
        cholesterolLevel: 170
      };

      const response = await request(app)
        .post('/api/health/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('weight', updates.weight);
      expect(response.body).toHaveProperty('bloodPressure', updates.bloodPressure);
    });
  });

  describe('GET /api/health/profile', () => {
    it('should get health profile', async () => {
      const { user, token } = await createTestUser();
      const profile = await createTestHealthProfile(user.id);

      const response = await request(app)
        .get('/api/health/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', profile.id);
      expect(response.body).toHaveProperty('userId', user.id);
    });

    it('should return 404 if profile not found', async () => {
      const { token } = await createTestUser();

      const response = await request(app)
        .get('/api/health/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/health/logs', () => {
    it('should create health log', async () => {
      const { user, token } = await createTestUser();
      const logData = {
        weight: 75.5,
        bloodPressure: '120/80',
        notes: 'Feeling good today'
      };

      const response = await request(app)
        .post('/api/health/logs')
        .set('Authorization', `Bearer ${token}`)
        .send(logData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('userId', user.id);
      expect(response.body).toHaveProperty('weight', logData.weight);
      expect(response.body).toHaveProperty('date');
    });

    it('should validate log data', async () => {
      const { token } = await createTestUser();
      const response = await request(app)
        .post('/api/health/logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          weight: -1, // invalid weight
          bloodPressure: '' // invalid blood pressure
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/health/logs', () => {
    it('should get health logs', async () => {
      const { user, token } = await createTestUser();
      await createTestHealthLog(user.id);
      await createTestHealthLog(user.id, { date: new Date(Date.now() - 86400000) }); // yesterday

      const response = await request(app)
        .get('/api/health/logs')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('userId', user.id);
    });

    it('should filter logs by date range', async () => {
      const { user, token } = await createTestUser();
      await createTestHealthLog(user.id);
      await createTestHealthLog(user.id, { date: new Date(Date.now() - 86400000 * 31) }); // 31 days ago

      const response = await request(app)
        .get('/api/health/logs')
        .query({ days: 30 })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body).toHaveLength(1);
    });
  });
}); 