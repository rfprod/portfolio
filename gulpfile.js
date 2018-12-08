'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');
const spawn = require('child_process').spawn;

/**
 * Lints JS code.
 */
gulp.task('eslint', () => {
  const eslint = require('gulp-eslint');
  // uses ignore list from .eslintignore
  return gulp.src(['./*.js', './functions/**/*.js', './test/**/*.js'])
    .pipe(eslint('./.eslintrc.json'))
    .pipe(eslint.format());
});

/**
 * Default start serquence.
 */
gulp.task('default', (done) => {
  runSequence('server', 'ng-serve', done);
});

/**
 * Angular CLI dev server.
 */
let ngServer;

/**
 * @name ng-serve
 * @member {Function}
 * @summary Starts project using Angular CLI.
 * @description Starts project using Angular CLI.
 */
gulp.task('ng-serve', (done) => {
  if (ngServer) ngServer.kill();
  ngServer = spawn('npm run', ['start-cli'], {stdio: 'inherit'});
  ngServer.on('close', (code) => {
    if (code === 8) {
      console.log('Error detected...');
    }
  });
  done();
});

/**
 * NodeJS server instance.
 */
let node;

/**
 * @name server
 * @member {Function}
 * @summary Starts application server.
 * @description Starts client application server.
 */
gulp.task('server', (done) => {
  if (node) node.kill();
  node = spawn('node', ['server.js'], {stdio: 'inherit'});
  node.on('close', (code) => {
    if (code === 8) {
      console.log('Error detected, waiting for changes...');
    }
  });
  done();
});

process.on('exit', (code) => {
  console.log(`PROCESS EXIT CODE ${code}`);
});
