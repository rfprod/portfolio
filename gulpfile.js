'use strict';

const gulp = require('gulp');
const spawn = require('child_process').spawn;

require('dotenv').load();

let setEnv;

gulp.task('set-env', (done) => {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  setEnv = spawn('bash', ['shell/angular-env-keys.sh', token], {stdio: 'inherit'});
  setEnv.on('close', (code) => {
    if (code === 8) {
      console.log('Error detected, waiting for changes...');
    }
  });
  done();
});

gulp.task('unset-env', (done) => {
  setEnv = spawn('bash', ['shell/angular-env-keys.sh', 'unset-keys'], {stdio: 'inherit'});
  setEnv.on('close', (code) => {
    if (code === 8) {
      console.log('Error detected, waiting for changes...');
    }
  });
  done();
});

process.on('exit', (code) => {
  console.log(`PROCESS EXIT CODE ${code}`);
});
