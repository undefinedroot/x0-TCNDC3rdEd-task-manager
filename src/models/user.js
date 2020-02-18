const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Task = require('./task.js');

// create new Schema so that you can
// use a middleware

// always create an email with
// unique: true.. in the first time
// so that mongodb can index it
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Must be a valid email address');
        }
      }
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error('Age must be a positive number');
        }
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error(`Should not contain the word "password"`);
        }
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true
  }
);

// virtual property, not actual data,
// but relationship between two entities
// 'tasks' = name of the property to access this
// (user.tasks)
// ref: 'Task' = name of collection
// localField = Users._id
// foreignField = Tasks.owner
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

// .toJSON is always called during the
// execution of res.send()
// objects gets stringified.
// this is more like a method override.
// other code already used the deleted
// properties, so it still works
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject(); // convert it to object

  // remove properties, you don't
  // need to expose these.
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar; //IMPORTANT! so that json payload is not large

  return userObject;
};

// create method on instance
// so that it refers to itself
// need to use regular function
// to bind 'this'
// called: instance methods.
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  // embed _id for this user, sign it with a secret key
  // user._id convert it from ObjectID to string
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '10h' });
  // concatinate to user's existing token array the newly created token
  user.tokens = user.tokens.concat({ token });
  await user.save(); // update our user with the newly inserted token
  return token;
};

// attach a new function on this schema
// always use a vague error message
// so that nobody can determine which
// to target if bruteforcing
// called: model methods.
userSchema.statics.findByCredentials = async (email, plainPassword) => {
  // find the email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('unable to login');
  }
  // compare if entered password is the same with the password in database
  const isMatched = await bcryptjs.compare(plainPassword, user.password);
  if (!isMatched) {
    throw new Error('unable to login');
  }
  return user;
};

// middleware, delete all linked user tasks BEFORE user is removed
// --- cascading delete
userSchema.pre('remove', async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

// using middleware, hash plaintext password BEFORE saving
// .pre() execute BEFORE the event
// using regular function due to 'this' binding
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcryptjs.hash(user.password, 8);
  }
  next(); // resume process
});

// important to define it in a variable, tests fail if you use it directly
const User = mongoose.model('User', userSchema);

module.exports = User;