const st_req = require('supertest');

const app = require('../src/app.js');
const User = require('../src/models/user.js');

const { userOneId, userOne, setupDatabase } = require('./fixtures/db.js');

// code runs once before any test case.
beforeEach(setupDatabase);

test('Should signup a new user', async () => {
  const response = await st_req(app)
    .post('/users')
    .send({
      name: 'from test',
      email: "email@email.com",
      password: "red12345"
    })
    .expect(201);

  // assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull(); //check if user is not null

  // assertions about the response
  expect(response.body).toMatchObject(
    {
      user: {
        name: 'from test',
        email: 'email@email.com'
      },
      token: user.tokens[0].token
    }
  );

  // password should not be equal to plaintext
  expect(user.password).not.toBe('red12345');

});

test('Should login existing user', async () => {
  const response = await st_req(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);

  const user = await User.findOne({ email: userOne.email });

  // because when you login again, you will get a new token,
  // that's why you need to test the 2nd token
  // 1st token has been generated during creation of seed data
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login nonexistent user', async () => {
  await st_req(app)
    .post('/users/login')
    .send({
      email: 'shouldnotexist@y.com',
      password: 'abc21314cc'
    })
    .expect(400);
  // custom assertion function
  // .expect(function (res) {
  //   if (res.statusCode !== 400) {
  //     throw new Error('should have 500 status code');
  //   }
  // });
});

test('Should get profile for user', async () => {
  // set the header to have an Authorization header with a valid Token before sending it
  await st_req(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
  await st_req(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('Should delete account for user', async () => {
  const response = await st_req(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(response.body._id);
  expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
  await st_req(app)
    .delete('/users/me')
    .send()
    .expect(401);
});

test('Should upload avatar image', async () => {
  await st_req(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);
  const user = await User.findById(userOneId);

  // toEqual() does not use the === operator
  // below you create object in different memory space
  // that's why .toBe() does not work correct in expect({}).toBe({})

  // check if datatype is of Buffer, if it exists, then image upload is a success
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
  await st_req(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Test Snake'
    })
    .expect(200);

  const checkUser = await User.findById(userOneId);
  expect(checkUser.name).toBe('Test Snake');
});

test('Should not update invalid user fields', async () => {
  await st_req(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: 'should not be here'
    })
    .expect(400);
});
