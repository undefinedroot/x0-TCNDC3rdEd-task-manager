require('../src/db/mongoose.js');
const Task = require('../src/models/task.js');

// Task.findByIdAndRemove('5d30808f5a042605405f5d75')
//   .then(result => {
//     console.log(result);
//     // .countDocuments() has criteria to search
//     return Task.countDocuments({ completed: false });
//   })
//   .then(result => {
//     console.log(result);
//   })
//   .catch(e => {
//     console.log('error', e);
//   });

const deleteTaskAndCount = async id => {
  await Task.findByIdAndRemove(id);
  return await Task.countDocuments({ completed: false });
};

deleteTaskAndCount('5d30569c80acd909b4475f7e')
  .then(count => {
    console.log(count);
  })
  .catch(e => {
    console.log(e);
  });