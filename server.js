'use strict';

/**
 * Server module
 * @module server
 */

/**
 * @name bodyParser
 * @constant
 * @summary Body parser
 * @description Body parser for Express server
 */
const bodyParser = require('body-parser');
/**
 * @name compression
 * @constant
 * @summary Compression for Express server
 * @description Compression for Express server
 */
const compression = require('compression');
/**
 * @name express
 * @constant
 * @summary Express server
 * @description Express server
 */
const express = require('express');
/**
 * @name app
 * @constant
 * @summary Express application
 * @description Express application
 */
const app = express();

/**
 * Set process title so that it's easier to indentify process and kill it.
 */
process.title = 'portfolio-dev-server';

/**
 * @name cwd
 * @constant
 * @summary Current directory of the main Server script - server.js
 * @description Correct root path for all setups, it should be used for all file references for the server and its modules like filePath: cwd + '/actual/file.extension'. Built Electron app contains actual app in resources/app(.asar) subdirectory, so it is essential to prefer __dirname usage over process.cwd() to get the value.
 */
const cwd = __dirname;

/**
 *  load .env variables
 */
require('dotenv').config();

/**
 * @name routes
 * @constant
 * @summary Express server Routes
 * @description Express server Routes
 * @see {@link module:server/routes/index}
 */
const routes = require(`${cwd}/server/routes/index.js`);

/**
 * Use compression for all responses.
 */
app.use(
  compression({
    threshold: 0,
    level: -1,
  }),
);

/**
 * Dist.
 */
app.use('/', express.static(cwd + '/dist/portfolio/'));

/**
 * Serve app index file for paths excluding provided in regX.
 */
app.use((req, res, next) => {
  const regX = /(api|assets|txt|ico|html|css|js)/;
  const apiRegX = /(githubUser|githubUserRepos|githubUserReposLanguages)/;
  if (regX.test(req.path) || apiRegX.test(req.path)) {
    return next();
  } else if (/dist/.test(req.path)) {
    res.sendFile(cwd + '/dist/portfolio/index.html');
  } else {
    res.redirect('/portfolio/');
  }
});

/**
 * Request parameters middleware.
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Headers config for all Express routes.
 */
app.all('/*', function (req, res, next) {
  // CORS headers
  res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain if needed
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  // add headers to be exposed
  res.header('Access-Control-Expose-Headers', 'Views');
  // cache control
  res.header('Cache-Control', 'public, no-cache, no-store, must-ravalidate, max-age=0');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  // handle OPTIONS method
  if (req.method == 'OPTIONS') res.status(200).end();
  else next();
});

/** Call app routes. */
routes(app);

/**
 * @function terminator
 * @summary Terminator function
 * @description Terminates application
 */
function terminator(sig) {
  if (typeof sig === 'string') {
    console.log(`\n${Date(Date.now())}: Received signal ${sig} - terminating app...\n`);
    process.exit(0);
  }
}

/**
 * Termination handlers.
 */
(() => {
  process.on('exit', () => {
    terminator('exit');
  });
  // Removed 'SIGPIPE' from the list - bugz 852598.
  [
    'SIGHUP',
    'SIGINT',
    'SIGQUIT',
    'SIGILL',
    'SIGTRAP',
    'SIGABRT',
    'SIGBUS',
    'SIGFPE',
    'SIGUSR1',
    'SIGSEGV',
    'SIGUSR2',
    'SIGTERM',
  ].forEach(element => {
    process.on(element, () => {
      terminator(element);
    });
  });
})();

/**
 * @name port
 * @summary Application port
 * @description Application port
 */
const port = 8080;

/**
 * Start application without explicit definition of ip address it should use.
 */
app.listen(port, () => {
  console.log(`\n# > START > Node.js listening on port ${port}...\n`);
});
