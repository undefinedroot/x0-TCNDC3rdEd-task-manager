const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../../src/models/user.js');
const Task = require('../../src/models/task.js');

const userOneId = new mongoose.Types.ObjectId;

// defining a seed data, also create it's token
const userOne = {
  _id: userOneId,
  name: 'Test John',
  email: 'test@test.com',
  password: 'red12345!!!',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
};

const userTwoId = new mongoose.Types.ObjectId;

// defining a seed data, also create it's token
const userTwo = {
  _id: userTwoId,
  name: 'Test Naomi',
  email: 'ex@ex.com',
  password: 'blue54321$$$',
  tokens: [{
    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
  }]
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First task',
  completed: false,
  owner: userOneId
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second task',
  completed: true,
  owner: userOneId
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third task',
  completed: true,
  owner: userTwoId
};

const setupDatabase = async () => {
  await User.deleteMany(); // delete all users first
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports =
  {
    userOneId,
    userOne,
    userTwo,
    taskOne,
    setupDatabase
  };