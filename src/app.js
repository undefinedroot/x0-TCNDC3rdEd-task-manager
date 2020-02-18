// app.js is for setting up everything
// because we need to call this on
// our test suite, supertest
// does not want us to call app.listen();

const express = require('express');

require('./db/mongoose.js'); // ensure that the file runs and connects to database

const UserRouter = require('./routers/user.js');
const TaskRouter = require('./routers/task.js');

const app = express();

//#region old code
// required: added first for auth middleware
// app.use(async (req, res, next) => {
//   if (req.method === 'GET') {
//     res.status(400).send('not allowed');
//   } else {
//     next();
//   }
// });
// app.use('*', async (req, res, next) => {
//   res.status(503).send('service temporarily disabled. backend under maintenance.');
// });
//#endregion

//#region old code, multer

// const multer = require('multer'); // add file upload support
// // fileSize: bytes, important to limit filesizes
// // 1000000 = under 1mb file
// const upload = multer({
//   dest: 'images',
//   limits: {
//     fileSize: 1000000
//   },
//   fileFilter(req, file, cb) {
//     // if (!file.originalname.endsWith('.pdf')) {
//     //   return cb(new Error('upload a PDF'));
//     // }

//     // https://regex101.com/
//     // file extension, either .doc or .docx
//     // \.(doc|docx)$

//     if (!file.originalname.match(/\.(doc|docx)$/)) {
//       return cb(new Error('upload a word document'));
//     }
//     cb(undefined, true);
//   }
// });

// // look for a key called upload at request and save at images directory
// app.post('/upload', upload.single('upload'), (req, res) => {
//   res.send();
// }, (error, req, res, next) => {
//   // customize error
//   // call signature required; error, req, res, next
//   res.status(400).send({ error: error.message });
// });

//#endregion

// use middleware to allow express to automatically parse incoming JSON payloads
app.use(express.json());

// use your routers
app.use(UserRouter);
app.use(TaskRouter);

module.exports = app; // export app to index.js, this is done for testing purposes

//#region old code, using relationship between collections

const main = async () => {

  const Task = require('./models/task.js');
  const User = require('./models/user.js');

  const task = await Task.findById('5d37fd5486f2590554a422b6');
  await task.populate({ path: 'owner' }).execPopulate(); // populate data in a relationship
  console.log(task.owner); // now, instead of id, it will be the object itself

  const user = await User.findById('5d37fa6b616e6617bc41bc5c');
  // populate data, provide filter 'match.completed === true'
  await user.populate({ path: 'tasks', match: { completed: 'true' } }).execPopulate();
  console.log(user.tasks); // now, you can retrieve the items related

};
//main();

//#endregion

//#region old code
// const pet = {
//   name: 'E'
// };

// pet.toJSON = function () {
//   return {};
// }

// console.log(JSON.stringify(pet));
//#endregion

//#region old code