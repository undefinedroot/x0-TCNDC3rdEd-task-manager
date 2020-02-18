const express = require('express');
const UserRouter = new express.Router();
const sharp = require('sharp');

const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account.js');

// need to use .js in order for intellisense to work!
// but you can always omit the .js part.
const User = require('../models/user.js');

const Auth = require('../middleware/auth.js');

// every time you create a new user, you generate a new auth-token
UserRouter.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save(); // create our new user
    // can use await, but not really needed, no need to make sure this completes before proceeding
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(500).send(e);
  }
});

// for every login, you generate a new auth-token only after your credentials are correct
UserRouter.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(`error: ${e}`);
  }
});

// delete the currently being used token when logging out
UserRouter.post('/users/logout', Auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(loopedToken => {
      return loopedToken.token !== req.token;
    });
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(`error: ${e}`);
  }
});

// delete all existing tokens for the user
UserRouter.post('/users/logoutAll', Auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(`error: ${e}`);
  }
});

UserRouter.get('/users/me', Auth, async (req, res) => {
  // omitted because 'user' exists after using Auth middleware
  // try {
  //   const users = await User.find({});
  //   res.status(200).send(users);
  // } catch (e) {
  //   res.status(500).send('error in fetching users');
  // }
  res.status(200).send(req.user);
});

//#region old code
// UserRouter.get('/users/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).send('User not found');
//     }
//     res.status(200).send(user);
//   } catch (e) {
//     res.status(500).send('User not found');
//   }
// });
//#endregion

// mongoose automatically ignores missing fields
UserRouter.patch('/users/me', Auth, async (req, res) => {
  // field check, only allowed fields to be updated should be here.
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  // iterate on each element from update, if one false, .every() will return false
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    //#region old code
    // return the new user, also validate.. from 3rd argument
    // .findByIdAndUpdate() = bypass middleware
    //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    // // find user by id
    // const user = await User.findById(req.params.id);
    // // iterate
    // updates.forEach(update => user[update] = req.body[update]);
    // // execute
    // await user.save();
    //#endregion

    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.status(200).send(req.user);

  } catch (e) {
    res.status(400).send(e);
  }
});

UserRouter.delete('/users/me', Auth, async (req, res) => {
  try {
    //const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) {
    //   return res.status(404).send('No user to delete');
    // }

    await req.user.remove();
    sendCancelEmail(req.user.email, req.user.name);

    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send('error in deleting' + e);
  }
});

// 1mb = 1m bytes
// when you remove 'dest' (dest: 'avatars'), it will pass data through (req,res)
const multer = require('multer');
const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
      return cb(new Error('upload a jpg/jpeg file'), false);
    }
    cb(undefined, true);
  }
});

// to show at html;
// <img src="data:image/jpg;base64,(buffer)>
// "avatar" : { "$binary" : "(buffer)", "$type" : "00" }
UserRouter.post('/users/me/avatar', Auth, upload.single('avatar'), async (req, res) => {
  // no 'dest' option setup at multer({})
  //req.user.avatar = req.file.buffer;

  const buffer = await sharp(req.file.buffer).resize({ width: 150, height: 150 }).png().toBuffer();
  req.user.avatar = buffer;

  await req.user.save();
  res.send();
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message });
});

UserRouter.delete('/users/me/avatar', Auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(400).send('failed to delete avatar');
  }
});

UserRouter.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    // need to set Content-Type before sending
    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = UserRouter;