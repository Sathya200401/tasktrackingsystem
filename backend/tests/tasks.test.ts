import request from 'supertest';
import { connectTestDB, clearDB, closeTestDB } from './setup';
import { app } from '../src/app';
import { Employee } from '../src/models/Employee';

describe('Tasks API', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  afterEach(async () => {
    await clearDB();
  });

  it('should create, read, update and delete a task', async () => {
    // create an employee to assign
    const emp = await Employee.create({ name: 'Dev User', email: 'dev@example.com' });

    // login as admin to get token
    const login = await request(app).post('/api/auth/login').send({ email: 'admin@nexus.io', password: 'aimadmin@123' }).expect(200);
    const token = login.body.data.token;

    // create task
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Task', assignedTo: emp.id, priority: 'medium', status: 'todo' })
      .expect(201);

    expect(createRes.body.success).toBe(true);
    const task = createRes.body.data;
    expect(task.title).toBe('Test Task');

    // get tasks
    const listRes = await request(app).get('/api/tasks').expect(200);
    expect(listRes.body.success).toBe(true);
    expect(Array.isArray(listRes.body.data)).toBe(true);

    // update task
    const updateRes = await request(app)
      .put(`/api/tasks/${task.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'in_review' })
      .expect(200);
    expect(updateRes.body.data.status).toBe('in_review');

    // delete task
    await request(app).delete(`/api/tasks/${task.id}`).set('Authorization', `Bearer ${token}`).expect(204);
  });
});
