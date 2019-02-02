'use strict';

const gulp = require('gulp');
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
gulp.task('default', gulp.series('server', 'ng-serve', (done) => {
  done();
}));

process.on('exit', (code) => {
  console.log(`PROCESS EXIT CODE ${code}`);
});
