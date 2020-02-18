// why test?
/**
 * saves time (can be ran over and over again)
 * create realiable software (errors are caught)
 * flexibility to devs
 *    refactoring
 *    collaborating
 *    profiling
 * peace of mind
 */

// test() provided by jest, call this to setup the test

// tests use static values, if these values change due to a refactor
// then your test will fail.

// NOTE = if jest intellisense doesn't work, you need to
// update your jsconfig.json;
/**
  {
    "typeAcquisition": {
      "include": [
        "jest"
      ]
    }
  }
 */
// NOTE2 = check other assertions
// at https://jestjs.io/docs/en/expect

const
  {
    calculateTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    add
  }
    = require('./math.js/index.js');

test('Should calculate total with provided tip value', () => {
  const total = calculateTip(10, .3);
  expect(total).toBe(13);
});

test('Should calculate total with no default tip value', () => {
  const total = calculateTip(10);
  expect(total).toBe(12.5);
});

test('Should convert 32°F to 0°C.', () => {
  const value = fahrenheitToCelsius(32);
  expect(value).toBe(0);
});

test('Should convert 0°C to 32°F.', () => {
  const value = celsiusToFahrenheit(0);
  expect(value).toBe(32);
});

// until done() is called, it will wait.
//#region old code
// test('async test demo', done => {
//   setTimeout(() => {
//     expect(1).toBe(2);
//     done();
//   }, 2000);
// });
//#endregion
test('Should add two numbers (promises)', done => {
  add(2, 3).then(sum => {
    expect(sum).toBe(5);
    done();
  });
});

test('Should add two numbers (async/await)', async () => {
  const value = await add(3, 3);
  expect(value).toBe(6);
});