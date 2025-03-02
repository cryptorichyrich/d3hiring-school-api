const request = require('supertest');
const app = require('../app');
const db = require('../config/database');

beforeAll(async () => {
  await db.query('TRUNCATE TABLE teachers_students');
  await db.query('TRUNCATE TABLE students');
});

describe('School API', () => {
  test('POST /register should register students', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        teacher: 'teacher@test.com',
        students: ['student1@test.com', 'student2@test.com']
      });
    
    expect(response.status).toBe(204);
  });

  test('GET /commonstudents should return common students', async () => {
    await request(app)
      .post('/api/register')
      .send({
        teacher: 'teacher1@test.com',
        students: ['common@test.com']
      });
    
    await request(app)
      .post('/api/register')
      .send({
        teacher: 'teacher2@test.com',
        students: ['common@test.com']
      });

    const response = await request(app)
      .get('/api/commonstudents?teacher=teacher1@test.com&teacher=teacher2@test.com');
    
    expect(response.status).toBe(200);
    expect(response.body.students).toContain('common@test.com');
  });

  // Add more tests for suspend and notifications
});