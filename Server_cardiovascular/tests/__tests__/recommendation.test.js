const request = require('supertest');
const app = require('../../src/app');

describe('Recommendation Endpoints', () => {
  describe('GET /api/recommendations/meals', () => {
    it('should get meal recommendations', async () => {
      const { user, token } = await createTestUser();
      await createTestHealthProfile(user.id, {
        medicalConditions: ['Hypertension'],
        dietaryRestrictions: ['Low Sodium']
      });

      const response = await request(app)
        .get('/api/recommendations/meals')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('mealType');
      expect(response.body[0]).toHaveProperty('foodItems');
      expect(response.body[0]).toHaveProperty('nutritionalInfo');
    });

    it('should require health profile', async () => {
      const { token } = await createTestUser();

      const response = await request(app)
        .get('/api/recommendations/meals')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Health profile required for recommendations');
    });

    it('should consider dietary restrictions', async () => {
      const { user, token } = await createTestUser();
      await createTestHealthProfile(user.id, {
        dietaryRestrictions: ['Vegetarian', 'Gluten-Free']
      });

      const response = await request(app)
        .get('/api/recommendations/meals')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      // Assuming the AI service is mocked to return appropriate responses
      expect(response.body[0].nutritionalInfo).toHaveProperty('isVegetarian', true);
      expect(response.body[0].nutritionalInfo).toHaveProperty('isGlutenFree', true);
    });
  });

  describe('GET /api/recommendations/health-tips', () => {
    it('should get personalized health tips', async () => {
      const { user, token } = await createTestUser();
      await createTestHealthProfile(user.id);
      await createTestHealthLog(user.id);
      await createTestMealLog(user.id);

      const response = await request(app)
        .get('/api/recommendations/health-tips')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('category');
      expect(response.body[0]).toHaveProperty('tip');
      expect(response.body[0]).toHaveProperty('priority');
    });

    it('should require health profile and logs', async () => {
      const { token } = await createTestUser();

      const response = await request(app)
        .get('/api/recommendations/health-tips')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Health profile and logs required for recommendations');
    });
  });

  describe('GET /api/recommendations/meal-plan', () => {
    it('should get weekly meal plan', async () => {
      const { user, token } = await createTestUser();
      await createTestHealthProfile(user.id);

      const response = await request(app)
        .get('/api/recommendations/meal-plan')
        .query({ days: 7 })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body).toHaveLength(7);
      expect(response.body[0]).toHaveProperty('date');
      expect(response.body[0]).toHaveProperty('meals');
      expect(Array.isArray(response.body[0].meals)).toBeTruthy();
      expect(response.body[0].meals[0]).toHaveProperty('mealType');
      expect(response.body[0].meals[0]).toHaveProperty('foodItems');
    });

    it('should validate days parameter', async () => {
      const { user, token } = await createTestUser();
      await createTestHealthProfile(user.id);

      const response = await request(app)
        .get('/api/recommendations/meal-plan')
        .query({ days: 31 }) // More than allowed
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Days parameter must be between 1 and 30');
    });

    it('should consider user preferences', async () => {
      const { user, token } = await createTestUser();
      await createTestHealthProfile(user.id, {
        dietaryRestrictions: ['Vegetarian'],
        medicalConditions: ['Diabetes']
      });

      const response = await request(app)
        .get('/api/recommendations/meal-plan')
        .query({ days: 3 })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body).toHaveLength(3);
      // Assuming the AI service is mocked to return appropriate responses
      expect(response.body[0].meals[0].nutritionalInfo).toHaveProperty('isVegetarian', true);
      expect(response.body[0].meals[0].nutritionalInfo).toHaveProperty('glycemicIndex');
    });
  });

  describe('GET /api/recommendations/progress', () => {
    it('should get progress analysis', async () => {
      const { user, token } = await createTestUser();
      await createTestHealthProfile(user.id);
      
      // Create some historical data
      const dates = [30, 20, 10, 0].map(days => new Date(Date.now() - days * 86400000));
      for (const date of dates) {
        await createTestHealthLog(user.id, { date });
        await createTestMealLog(user.id, { date });
      }

      const response = await request(app)
        .get('/api/recommendations/progress')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('weightTrend');
      expect(response.body).toHaveProperty('nutritionTrend');
      expect(response.body).toHaveProperty('healthMetricsTrend');
      expect(response.body).toHaveProperty('recommendations');
    });

    it('should require sufficient historical data', async () => {
      const { user, token } = await createTestUser();
      await createTestHealthProfile(user.id);
      await createTestHealthLog(user.id); // Only one log

      const response = await request(app)
        .get('/api/recommendations/progress')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Insufficient historical data for analysis');
    });
  });
}); 