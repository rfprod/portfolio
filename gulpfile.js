'use strict';

const gulp = require('gulp'),
	runSequence = require('run-sequence'),
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
	gulpFilter = require('gulp-filter'),
	mainBowerFiles = require('main-bower-files'),
	del = require('del'),
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
				exec('kill -9 '+id, (error, stdout, stderr) => {
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
		livereload: true,
		open: 'http://localhost:7070'
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

gulp.task('sass-autoprefix-minify-css', () => {
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

gulp.task('bower-files', () => {
	const filterJS = gulpFilter('**/*.js', { restore: true });
	return gulp.src(mainBowerFiles(
		{
			paths: {
				bowerJson: './bower.json',
				bowerrc: './.bowerrc'
			}
		}))
		.pipe(filterJS)
		.pipe(plumber())
		.pipe(concat('vendor-pack.js'))
		.pipe(uglify())
		.pipe(plumber.stop())
		.pipe(rename('vendor-pack.min.js'))
		.pipe(filterJS.restore)
		.pipe(gulp.dest('./app/js'));
});

gulp.task('pack-vendor-css', () => { // packs vendor css files which bowerFiles put into app/js folder on bower-files task execution
	return gulp.src('./app/js/*.css')
		.pipe(plumber())
		.pipe(concat('vendor-pack.css'))
		.pipe(cssnano())
		.pipe(plumber.stop())
		.pipe(rename('vendor-pack.min.css'))
		.pipe(gulp.dest('./app/css'));
});

gulp.task('move-vendor-fonts', () => { // move vendor font files which bowerFiles put into app/fonts folder on bower-files task execution
	return gulp.src(['./app/js/*.otf', './app/js/*.eot', './app/js/*.svg', './app/js/*.ttf', './app/js/*.woff', './app/js/*.woff2'])
		.pipe(gulp.dest('./app/fonts'));
});

gulp.task('build-clean', () => { // remove vendor css and fonts from app/js
	return del(['./app/js/*.css', './app/js/*.otf', './app/js/*.eot', './app/js/*.svg', './app/js/*.ttf', './app/js/*.woff', './app/js/*.woff2']);
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
	gulp.watch('./app/css/app.scss', ['sass-autoprefix-minify-css']);
	gulp.watch(['./app/*.js', './app/components/**/*.js','./app/views/**/*.js','./karma.conf.js'], ['client-unit-test']);
	gulp.watch(['./app/*.js', './app/components/**/*.js','!./app/components/**/*_test.js','./app/views/**/*.js','!./app/views/**/*_test.js','./e2e-tests/*.js'], ['client-e2e-test']);
});

gulp.task('build', (done) => {
	runSequence('lint', 'concat-and-uglify-js', 'sass-autoprefix-minify-css', 'bower-files', 'pack-vendor-css', 'move-vendor-fonts', 'build-clean', 'client-unit-test', 'client-e2e-test', done);
});

gulp.task('default', ['build','server','watch']);

process.on('exit', () => {
	if (httpServer) httpServer.kill();
	if (protractor) protractor.kill();
});

process.on('SIGINT', () => {
	killProcessByName('gulp');
});
