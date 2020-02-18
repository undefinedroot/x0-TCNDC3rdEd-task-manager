1. testing is important so that you can continually expect that certain functionality is constant across refactors

2. when you need to mock an npm module, create it within __mocks__
   you also need to provide the functions that specific mocked npm module is using, example;

   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey();
   sgMail.send({})

   you need to create a @sendgrid folder and inside it has mail.js
   and create the functions.... mocking is used if you want to
   replace the functionality of an npm module.. in sendgrid's case,
   you use mocks to a preventing wasted API call limits.

3. fixtures; things that allow you to setup the environment your tests are going to run in.
   so if you need to test code with images, you place it there.

4. package.json;

  "scripts": {
    "test": "env-cmd config/test.env jest --watch --runInBand"
  },
  "jest": {
    "testEnvironment": "node"
  }


  a. use config/test.env variables for process.env...
  b. --watch: setup jest to watch for file changes and automatically run tests
  c. --runInBand: run tests in a series to prevent tests from interfering with each other
     example, on fixtures/db.js, you use the same user test data, there is logic that
     you can't register duplicate emails, if multiple codes need such logic, it will conflict

5. should always return the correct status codes AND objects, so that you can test it easily.
