'use strict';

const gulp = require('gulp'),
	webserver = require('gulp-webserver'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	eslint = require('gulp-eslint'),
	plumber = require('gulp-plumber'),
	uglify = require('gulp-uglify'),
	karmaServer = require('karma').Server,
	sass = require('gulp-sass'),
	cssnano = require('gulp-cssnano'),
	autoprefixer = require('gulp-autoprefixer'),
	spawn = require('child_process').spawn,
	exec = require('child_process').exec;
let httpServer,
	protractor;

function killProcessByName(name){
	exec('ps -e | grep '+name, (error, stdout, stderr) => {
		if (error) throw error;
		if (stderr) console.log('stderr: ',stderr);
		if (stdout) {
			//console.log('killing running processes:', stdout);
			const runningProcessesIDs = stdout.match(/\d{3,6}/);
			runningProcessesIDs.forEach((id) => {
				exec('kill '+id, (error, stdout, stderr) => {
					if (error) throw error;
					if (stderr) console.log('stdout: ', stdout);
					if (stdout) console.log('stderr: ', stderr);
				});
			});
		}
	});
}

gulp.task('server', () => {
	if (httpServer) httpServer.kill();
	httpServer = gulp.src('./app').pipe(webserver({
		host: 'localhost',
		port: 7070,
		livereload: true
	}));
});

gulp.task('client-unit-test', (done) => {
	new karmaServer({
		configFile: require('path').resolve('karma.conf.js'),
		singleRun: true
	}, () => {
		console.log('done');
		done();
	}).start();
});

gulp.task('client-e2e-test', () => {
	if (protractor) protractor.kill();
	protractor = spawn('npm', ['run', 'protractor'], {stdio: 'inherit'});
});

gulp.task('concat-and-uglify-js', () => {
	return gulp.src(['./app/*.js', './app/components/**/*.js', '!./app/components/**/*_test.js', './app/views/**/*.js', '!./app/views/**/*_test.js' ])
		.pipe(plumber())
		.pipe(concat('packed-app.js'))
		.pipe(uglify())
		.pipe(plumber.stop())
		.pipe(rename('packed-app.min.js'))
		.pipe(gulp.dest('./app/js'));
});

gulp.task('sass-autoprefix-and-minify-css', () => {
	return gulp.src('./app/css/app.scss')
		.pipe(plumber())
		.pipe(concat('packed-app.css'))
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(cssnano())
		.pipe(plumber.stop())
		.pipe(rename('packed-app.min.css'))
		.pipe(gulp.dest('./app/css'));
});

gulp.task('lint', () => {
	return gulp.src(['./app/**', './*.js']) // uses ignore list from .eslintignore
		.pipe(eslint('./.eslintrc.json'))
		.pipe(eslint.format());
});

gulp.task('watch-and-lint', () => {
	gulp.watch(['./app/*.js', './app/components/**', './app/views/**', './*.js', './.eslintignore', './.eslintrc.json'], ['lint']); // watch files to be linted or eslint config files and lint on change
});

gulp.task('watch', () => {
	gulp.watch(['./app/*.js','./app/components/**/*.js','!./app/components/**/*_test.js','./app/views/**/*.js','!./app/views/**/*_test.js'], ['concat-and-uglify-js']);
	gulp.watch('./app/css/app.scss', ['sass-autoprefix-and-minify-css']);
	gulp.watch(['./app/*.js', './app/components/**/*.js','./app/views/**/*.js','./karma.conf.js'], ['client-unit-test']);
	gulp.watch(['./app/*.js', './app/components/**/*.js','!./app/components/**/*_test.js','./app/views/**/*.js','!./app/views/**/*_test.js','./e2e-tests/*.js'], ['client-e2e-test']);
});

gulp.task('default', ['server','lint','concat-and-uglify-js','sass-autoprefix-and-minify-css','client-unit-test','client-e2e-test','watch']);

process.on('exit', () => {
	if (httpServer) httpServer.kill();
	if (protractor) protractor.kill();
});

process.on('SIGINT', () => {
	killProcessByName('gulp');
});
