// CRUD create read update delete

const { MongoClient, ObjectID } = require('mongodb');

// never use localhost, performance problems.
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

//const id = new ObjectID(); // ObjectID has timestamp inside.. first 4 bytes of Unix epoch starting 1/1/1970 12AM
// ObjectID is 12-byte binary data instead of string, for storage purposes...
//console.log(id);
//console.log(id.getTimestamp());

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log('Unable to connect to database!');
  }

  const db = client.db(databaseName);

  //#region 'Create'
  // db.collection('users').insertOne({
  //   _id: id,
  //   name: 'JohnR',
  //   age: 32
  // }, (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert user');
  //   }
  //   console.log(result.ops);
  // });
  // db.collection('users').insertMany(
  //   [
  //     {
  //       name: 'X1',
  //       age: 11
  //     },
  //     {
  //       name: 'X2',
  //       age: 12
  //     }
  //   ], (error, result) => {
  //     if (error) {
  //       return console.log('error encountered');
  //     }
  //     console.log(result.ops);
  //   }
  // )


  // db.collection('tasks').insertMany(
  //   [
  //     {
  //       description: 'task1',
  //       completed: false
  //     },
  //     {
  //       description: 'task2',
  //       completed: false
  //     },
  //     {
  //       description: 'task3',
  //       completed: false
  //     }
  //   ],
  //   (error, result) => {
  //     if (error) {
  //       return console.log('error in inserting');
  //     }
  //     console.log(result.ops);
  //   }
  // );

  //#endregion

  //#region 'Read'
  // db.collection('users')
  //   .findOne(
  //     {
  //       _id: new ObjectID('5d2ec25cace0880a681bbef7')
  //     },
  //     (error, user) => {
  //       if (error) {
  //         return console.log('error');
  //       }
  //       console.log(user);
  //     }
  //   );

  // // .find() returns a Cursor instead of a callback
  // // Cursor is for flexibility, it just returns the address of your record
  // const result = db.collection('users').find({ age: 32 });
  // result.toArray((error, users) => {
  //   console.log(users);
  // });


  // db.collection('tasks')
  //   .findOne(
  //     {
  //       _id: new ObjectID('5d2ec68174f7580888536724')
  //     },
  //     (error, task) => {
  //       if (error) {
  //         return console.log('error encountered');
  //       }
  //       console.log(task);
  //     }
  //   );

  // const resultset = db.collection('tasks').find({ completed: false });
  // resultset.toArray((error, data) => {
  //   if (error) {
  //     return console.log('error encountered');
  //   }
  //   console.log(data);
  // });

  //#endregion

  //#region 'Update'
  // // operators;
  // // $set = update value of field
  // // $inc = increment
  // db.collection('users')
  //   .updateOne(
  //     {
  //       _id: new ObjectID('5d2ec3e31bba250d2051329a')
  //     },
  //     {
  //       $set: {
  //         name: 'John v3'
  //       },
  //       $inc: {
  //         age: 1
  //       }
  //     }
  //   )
  //   .then(result => {
  //     console.log(result);
  //   })
  //   .catch(e => {
  //     console.log('error', e);
  //   });

  // db.collection('tasks')
  //   .updateMany(
  //     {
  //       completed: false
  //     },
  //     {
  //       $set: {
  //         completed: true
  //       }
  //     }
  //   )
  //   .then(result => {
  //     console.log('success', result);
  //   })
  //   .catch(e => {
  //     console.log('error', e);
  //   });

  //#endregion

  //#region 'Delete'

  // db.collection('users')
  //   .deleteMany(
  //     {
  //       age: 32
  //     }
  //   )
  //   .then(result => {
  //     console.log('success', result);
  //   })
  //   .catch(e => {
  //     console.log('fail', e);
  //   });

  // db.collection('tasks')
  //   .deleteOne(
  //     {
  //       completed: false
  //     }
  //   )
  //   .then(result => {
  //     console.log('success', result);
  //   })
  //   .catch(e => {
  //     console.log('error', e);
  //   });

  //#endregion

});