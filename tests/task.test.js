const st_req = require('supertest');

const app = require('../src/app.js');
const Task = require('../src/models/task.js');

const { userOneId, userOne, userTwo, taskOne, setupDatabase } = require('./fixtures/db.js');

// code runs once before any test case.
beforeEach(setupDatabase);

test('Should create task for user', async () => {
  const response = await st_req(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'from test'
    })
    .expect(201);

  const task = await Task.findById(response.body.task._id);
  expect(task).not.toBeNull();
  expect(task.completed).toBe(false);
});

test('Should have two tasks for user one test', async () => {
  const response = await st_req(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toBe(2);
});

test('Should error userTwo deleting taskOne owned by userOne', async () => {
  await st_req(app)
    .delete('/tasks/:id')
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
      id: taskOne._id
    })
    .expect(500);

  const taskOneCheck = await Task.findById(taskOne._id);
  expect(taskOneCheck).not.toBeNull();
  expect(taskOneCheck.owner).toEqual(userOneId);
});