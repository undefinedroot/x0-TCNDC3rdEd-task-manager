const app = require('./app.js');

// value has been defined at /config/dev.env
// PORT environment variable already exists at heroku,
// you need to define other environment variables at heroku

const PORT = process.env.PORT;
app.listen(PORT, () => { console.log(`\n  -- server started at port: ${PORT} --\n`) });

// IMPORTANT:  >>npm i -D env-cmd@8.0.2
// problem with looking for .env instead of the defined dev.env and test.env on higher versions

// then create ./config/dev.env
// file needs to have no special formatting
// include the config folder to gitignore
// when changing dev.env, you need to manually restart server