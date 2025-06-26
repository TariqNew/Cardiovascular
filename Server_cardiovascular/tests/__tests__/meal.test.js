const request = require('supertest');
const app = require('../../src/app');

describe('Meal Endpoints', () => {
  describe('POST /api/meals', () => {
    it('should create meal log', async () => {
      const { user, token } = await createTestUser();
      const mealData = {
        mealType: 'BREAKFAST',
        foodItems: ['Oatmeal', 'Banana'],
        calories: 350,
        proteins: 12,
        carbs: 65,
        fats: 8,
        fiber: 6,
        sodium: 120,
        date: new Date().toISOString(),
        rating: 4
      };

      const response = await request(app)
        .post('/api/meals')
        .set('Authorization', `Bearer ${token}`)
        .send(mealData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('userId', user.id);
      expect(response.body).toHaveProperty('mealType', mealData.mealType);
      expect(response.body.foodItems).toEqual(expect.arrayContaining(mealData.foodItems));
    });

    it('should validate meal data', async () => {
      const { token } = await createTestUser();
      const response = await request(app)
        .post('/api/meals')
        .set('Authorization', `Bearer ${token}`)
        .send({
          mealType: 'INVALID',
          calories: -1,
          proteins: -1
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/meals', () => {
    it('should get meal logs', async () => {
      const { user, token } = await createTestUser();
      await createTestMealLog(user.id);
      await createTestMealLog(user.id, { date: new Date(Date.now() - 86400000) }); // yesterday

      const response = await request(app)
        .get('/api/meals')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('userId', user.id);
    });

    it('should filter meals by date range', async () => {
      const { user, token } = await createTestUser();
      await createTestMealLog(user.id);
      await createTestMealLog(user.id, { date: new Date(Date.now() - 86400000 * 31) }); // 31 days ago

      const response = await request(app)
        .get('/api/meals')
        .query({ days: 30 })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body).toHaveLength(1);
    });

    it('should filter meals by type', async () => {
      const { user, token } = await createTestUser();
      await createTestMealLog(user.id, { mealType: 'BREAKFAST' });
      await createTestMealLog(user.id, { mealType: 'LUNCH' });

      const response = await request(app)
        .get('/api/meals')
        .query({ type: 'BREAKFAST' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('mealType', 'BREAKFAST');
    });
  });

  describe('GET /api/meals/summary', () => {
    it('should get meal summary', async () => {
      const { user, token } = await createTestUser();
      await createTestMealLog(user.id, {
        calories: 500,
        proteins: 20,
        carbs: 60,
        fats: 15
      });
      await createTestMealLog(user.id, {
        calories: 700,
        proteins: 30,
        carbs: 80,
        fats: 20
      });

      const response = await request(app)
        .get('/api/meals/summary')
        .query({ days: 7 })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalCalories', 1200);
      expect(response.body).toHaveProperty('averageCalories', 600);
      expect(response.body).toHaveProperty('totalProteins', 50);
      expect(response.body).toHaveProperty('totalCarbs', 140);
      expect(response.body).toHaveProperty('totalFats', 35);
    });

    it('should return empty summary for no meals', async () => {
      const { token } = await createTestUser();

      const response = await request(app)
        .get('/api/meals/summary')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalCalories', 0);
      expect(response.body).toHaveProperty('averageCalories', 0);
    });
  });

  describe('PUT /api/meals/:id', () => {
    it('should update meal log', async () => {
      const { user, token } = await createTestUser();
      const meal = await createTestMealLog(user.id);

      const updates = {
        calories: 400,
        proteins: 15,
        rating: 5
      };

      const response = await request(app)
        .put(`/api/meals/${meal.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', meal.id);
      expect(response.body).toHaveProperty('calories', updates.calories);
      expect(response.body).toHaveProperty('rating', updates.rating);
    });

    it('should not update meal of another user', async () => {
      const { user } = await createTestUser();
      const { token: otherToken } = await createTestUser({ email: 'other@example.com' });
      const meal = await createTestMealLog(user.id);

      const response = await request(app)
        .put(`/api/meals/${meal.id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ calories: 400 });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/meals/:id', () => {
    it('should delete meal log', async () => {
      const { user, token } = await createTestUser();
      const meal = await createTestMealLog(user.id);

      const response = await request(app)
        .delete(`/api/meals/${meal.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);

      // Verify meal is deleted
      const getMealResponse = await request(app)
        .get(`/api/meals/${meal.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(getMealResponse.status).toBe(404);
    });

    it('should not delete meal of another user', async () => {
      const { user } = await createTestUser();
      const { token: otherToken } = await createTestUser({ email: 'other@example.com' });
      const meal = await createTestMealLog(user.id);

      const response = await request(app)
        .delete(`/api/meals/${meal.id}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(response.status).toBe(403);
    });
  });
}); 