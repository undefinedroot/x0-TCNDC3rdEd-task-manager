const sgMail = require('@sendgrid/mail');

const from = 'test@test.io';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  try {
    sgMail.send({
      to: email,
      from,
      subject: 'Thanks for joining in!',
      text: `Welcome to the app, ${name}. Let me know how you use the app.`
    });
  } catch (e) {
    console.log(`error in sendWelcomeEmail ${e}`);
  }
};

const sendCancelEmail = (email, name) => {
  try {
    sgMail.send({
      to: email,
      from,
      subject: 'Cancel Account Notice',
      text: `Hello ${name}, you have recently cancelled your account, may we know the reason for it?`
    });
  } catch (e) {
    console.log(`error in sendCancelEmail ${e}`);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail
};