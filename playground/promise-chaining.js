require('../src/db/mongoose');
const User = require('../src/models/user.js');

// promise chaining, updated to async-await
// User.findByIdAndUpdate('5d308a7a883dfc10b0db5376', { age: 1 })
//   .then(user => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
//   })
//   .then(result => {
//     console.log('result', result);
//   })
//   .catch(e => {
//     console.log('error', e);
//   });

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });
  return count;
};

updateAgeAndCount('5d308a7a883dfc10b0db5376', 2)
  .then(count => {
    console.log(count);
  })
  .catch(e => {
    console.log('error', e);
  });