const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

// middleware triggered for those that use it,
// check if Authorization header exists in the request,
// verify if the extracted token is valid,
// once you decode the token, find the
// embedded ID as well as the token

// this middleware will check if the auth-token is valid only after
// the password hash has been compared and returned true

// extract-decode/verify-find-attach-resume
const auth = async (req, res, next) => {
  try {
    // -- extract
    const token = req.header('Authorization').replace('Bearer ', '');
    // -- decode/verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // -- find
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error(); // if no user found, then throw an error
    }

    // create a new property, and attach it to req.
    // which the routes that used this middleware can access to
    // -- attach
    req.token = token;
    req.user = user;

    next(); // -- resume
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

module.exports = auth;