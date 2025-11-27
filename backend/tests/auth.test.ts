import request from 'supertest';
import { connectTestDB, clearDB, closeTestDB } from './setup';
import { app } from '../src/app';

describe('Auth API', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  afterEach(async () => {
    await clearDB();
  });

  it('should signup a new user and login', async () => {
    const payload = { name: 'Test User', email: 'test@example.com', password: 'password123' };
    const res = await request(app).post('/api/auth/signup').send(payload).expect(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('token');

    const loginRes = await request(app).post('/api/auth/login').send({ email: payload.email, password: payload.password }).expect(200);
    expect(loginRes.body).toHaveProperty('success', true);
    expect(loginRes.body.data).toHaveProperty('token');
  });

  it('should allow admin login with admin credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@nexus.io', password: 'aimadmin@123' }).expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('admin');
    expect(res.body.data.token).toBeTruthy();
  });
});
