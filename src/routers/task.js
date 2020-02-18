const express = require('express');
const TaskRouter = new express.Router();
const Auth = require('../middleware/auth.js');

const Task = require('../models/task.js');

TaskRouter.post('/tasks', Auth, async (req, res) => {
  try {

    if (!Task.isValidField(Object.keys(req.body))) {
      return res.status(400).send("provide correct fields");
    }

    //await (new Task(req.body)).save();

    // spread operator ...
    const task = new Task({
      ...req.body,
      owner: req.user._id
    });

    await task.save();

    res.status(201).send({ task });
  } catch (e) {
    res.status(500).send('failed in adding new task');
  }
});

// GET /tasks?completed=false
// limit, skip
// GET /tasks?limit=10&skip=10  // skip first 10 result and get the 11th to 20th
// 1. filter via boolean
// 2. limit and skip for pagination

//    first page of 2:    ?limit=2&skip=0
//    third page of 2:    ?limit=2&skip=4
//    first page of 3:    ?limit=3&skip=0
//    third page of 3:    ?limit=3&skip=6

// GET /tasks?sortBy=createdAt:desc

// sample full url: .../tasks?completed=true&limit=5&skip=5&sortBy=updatedAt:asc
TaskRouter.get('/tasks', Auth, async (req, res) => {
  try {
    //#region old code
    //// old code;
    //   const tasks = await Task.find({ owner: req.user._id });
    // if (!tasks) {
    //   return res.status(404).send('tasks not found from database');
    // }

    // more efficient code, after creating and linking
    // virtual property called 'tasks'
    // populate it, then you can use that new virtual property.
    //#endregion
    const match = {};

    // if query named 'completed' exists
    if (req.query.completed) {
      // if the value of completed is 'true', return boolean true
      // if any other value, return false
      match.completed = req.query.completed === 'true';
    }
    // ?completed=true/false

    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      // sort:{ 1 = ascending, -1 = descending }
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    // ?sortBy=createdAt:desc/asc
    // : is a special character used for splitting, you can use _
    // note = createdAt is an existing field in the collection

    // important to provide parseInt()
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate();

    res.status(200).send(req.user.tasks); //after populating virtual property, can now use
  } catch (e) {
    res.status(500).send(`error, no tasks found ${e}`);
  }
});

TaskRouter.get('/tasks/:id', Auth, async (req, res) => {
  try {
    //const task = await Task.findById(req.params.id);

    const _id = req.params.id;
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send('task not found from database');
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send('error, no task found');
  }
});

TaskRouter.patch('/tasks/:id', Auth, async (req, res) => {
  try {

    //#region old code
    // // return enumerable string
    // const updates = Object.keys(req.body);
    // // define string array to check
    // const allowedUpdates = ['description', 'completed'];
    // // use .every() to check on each string array if it exists, if there is one false value, return false.
    // const isAllowedUpdate = updates.every(update => allowedUpdates.includes(update));

    // {new = return the new value of the object being updated... runValidators = run all validator for that model}
    //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    //#endregion

    const updates = Object.keys(req.body);
    if (!Task.isValidField(updates)) {
      return res.status(400).send("provide correct fields");
    }

    // // bypass for middleware
    // const task = await Task.findById(req.params.id);

    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(400).send('task to update not found!');
    }

    // assign new values
    updates.forEach(update => task[update] = req.body[update]);

    await task.save();

    res.status(200).send(task);
  } catch (e) {
    res.status(400).send(`error in task update! ${e}`);
  }
});

TaskRouter.delete('/tasks/:id', Auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).send('no task to delete');
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send('error in deleting task');
  }
});

module.exports = TaskRouter;