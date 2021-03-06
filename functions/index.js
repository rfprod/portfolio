/**
 *  Create and Deploy Cloud Functions
 *  https://firebase.google.com/docs/functions/write-firebase-functions
 *
 *  basic usage example
 *
 * exports.helloWorld = functions.https.onRequest((request, response) => {
 *    response.send('Hello from Firebase!');
 *  });
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const nodemailer = require('nodemailer');

/**
 *  load .env variables
 */
require('dotenv').config();

/**githubUserReposLanguages
 *  initialize admin SDK to access Firebase Realtime Database
 */
admin.initializeApp();

/**
 * nodemailer usage notice:
 * To use Gmail you may need to configure "Allow Less Secure Apps" (https://www.google.com/settings/security/lesssecureapps)
 * in your Gmail account unless you are using 2FA
 * in which case you would have to create an Application Specific password (https://security.google.com/settings/security/apppasswords).
 * You may also need to unlock your account with "Allow access to your Google account" (https://accounts.google.com/DisplayUnlockCaptcha)
 * to use SMTP.
 */
const smtpConfig = {
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  secure: true, // use SSL
  auth: {
    type: 'OAuth2',
    user: process.env.MAILER_EMAIL,
    clientId: process.env.MAILER_CLIENT_ID,
    clientSecret: process.env.MAILER_CLIENT_SECRET,
    refreshToken: process.env.MAILER_REFRESH_TOKEN,
    accessToken: 'empty',
  },
};

/**
 *	reusable transporter object using the default SMTP transport
 */
const mailTransporter = nodemailer.createTransport(smtpConfig);
mailTransporter.verify((err, success) => {
  if (err) {
    console.log('Mail transporter diag error >>', err);
  } else {
    console.log('Mail transporter diag success >>', success);
  }
});

/**
 * Fallback function if mail transporter returns an error on sendEmail
 */
function saveEmailToDB(name, email, header, message, domain, res) {
  const entry = {
    name: name,
    email: email,
    header: header,
    message: message,
    domain: domain,
  };
  admin
    .database()
    .ref('/emails')
    .push(entry)
    .then(() => {
      res.status(200).json({ success: 'Your message was successfully sent' });
    })
    .catch(error => {
      res.status(500).send('Error: try again later, please', error);
    });
}

/**
 * Send email message using nodemailer
 */
function sendEmail(name, email, header, message, domain, res) {
  const mailOptions = {
    from: '"PORTFOLIO 👥" <' + process.env.MAILER_EMAIL + '>',
    to: process.env.MAILER_RECIPIENT_EMAIL,
    subject: `PORTFOLIO: ${header} ✔`,
    text: `${message}\n\nMessage was sent from domain: ${domain}`,
    html: `<h3>${header}</h3><p>${message}</p><p>From: ${name} ${email}</p><p>Message was sent from domain: ${domain}</p>`,
  };
  mailTransporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      /*
       *	do not report error to user yet
       *	try recording message to DB first
       */
      // res.status(500).send('Mail transporter error');
      saveEmailToDB(name, email, header, message, domain, res);
    } else {
      console.log('mailTransporter, info', info);
      res.status(200).json({ success: 'Your message was successfully sent' });
    }
  });
}

/**
 * actual send email message cloud function
 */
exports.sendEmail = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST') {
    res.status(403).json({ error: 'Forbidden method' });
  }
  const name = req.body.name || '';
  const email = req.body.email || '';
  const header = req.body.header || '';
  const message = req.body.message || '';
  const domain = req.body.domain || '';
  if (
    name.length >= 2 &&
    /\w{2}@\w{2,}(\.)?\w{2,}/.test(email) &&
    header.length >= 5 &&
    message.length >= 75 &&
    domain.length >= 4
  ) {
    sendEmail(name, email, header, message, domain, res);
  } else {
    res.status(400).json({ error: 'Missing mandatory request parameters' });
  }
});

const handlers = require('./handlers/index');

/**
 * Get Github access token function handler.
 */
exports.githubAccessToken = functions.https.onRequest((req, res) => {
  if (req.method !== 'GET') {
    res.status(403).json({ error: 'Forbidden method' });
  }
  handlers.githubAccessToken(req, res);
});

/**
 * Get Github user function handler.
 */
exports.githubUser = functions.https.onRequest((req, res) => {
  if (req.method !== 'GET') {
    res.status(403).json({ error: 'Forbidden method' });
  }
  handlers.githubUser(req, res);
});

/**
 * Get Github user repos function handler.
 */
exports.githubUserRepos = functions.https.onRequest((req, res) => {
  if (req.method !== 'GET') {
    res.status(403).json({ error: 'Forbidden method' });
  }
  handlers.githubUserRepos(req, res);
});

/**
 * Get Github user repos languages.
 */
exports.githubUserReposLanguages = functions.https.onRequest((req, res) => {
  if (req.method !== 'GET') {
    res.status(403).json({ error: 'Forbidden method' });
  }
  handlers.githubUserReposLanguages(req, res);
});
