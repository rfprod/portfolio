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
	del = require('del'),
	spawn = require('child_process').spawn,
	exec = require('child_process').exec;
let httpServer,
	protractor;

function killProcessByName(name){
	exec('pgrep ' + name, (error, stdout, stderr) => {
		if (error) {
			// throw error;
			console.log('killProcessByName, error', error);
		}
		if (stderr) console.log('stderr: ',stderr);
		if (stdout) {
			const runningProcessesIDs = stdout.match(/\d+/);
			runningProcessesIDs.forEach((id) => {
				exec('kill -9 ' + id, (error, stdout, stderr) => {
					if (error) throw error;
					if (stderr) console.log('stdout: ', stdout);
					if (stdout) console.log('stderr: ', stderr);
				});
			});
		}
	});
}

gulp.task('dev-server', (done) => {
	if (httpServer) httpServer.emit('kill');
	httpServer = gulp.src('./app').pipe(webserver({
		host: 'localhost',
		port: 7070,
		livereload: true,
		open: 'http://localhost:7070',
		middleware: function(req, res, next) {
			/*
			*	config for SPA
			*	returns index.html if condition is met
			*	this ignores all requests to api endpoint, and to files with extensions
			*/
			if (req.url.match(/^\/(?!api)[^.]*$/)) {
				console.log('httpServer middleware SPA config:', req.url);
				req.url = '/index.html';
			}
			next();
		}
	}));
	done();
});

gulp.task('server', (done) => {
	if (httpServer) httpServer.emit('kill');
	httpServer = gulp.src('./app').pipe(webserver({
		host: 'localhost',
		port: 7070,
		livereload: false,
		middleware: function(req, res, next) {
			/*
			*	config for SPA
			*	returns index.html if condition is met
			*	this ignores all requests to api endpoint, and to files with extensions
			*/
			if (req.url.match(/^\/(?!api)[^.]*$/)) {
				console.log('httpServer middleware SPA config:', req.url);
				req.url = '/index.html';
			}
			next();
		}
	}));
	done();
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

gulp.task('client-e2e-test', (done) => {
	if (protractor) protractor.kill();
	protractor = spawn('npm', ['run', 'protractor'], {stdio: 'inherit'});
	protractor.on('exit', (exitCode) => {
		console.log('Protractor done, exited with code', exitCode);
		done();
	});
});

gulp.task('clean-build', () => {
	return del(['./app/css/*.css', './app/js/*.js', './app/fonts/*.otf', './app/fonts/*.eot', './app/fonts/*.svg', './app/fonts/*.ttf', './app/fonts/*.woff', './app/fonts/*.woff2']);
});

gulp.task('pack-app-js', () => {
	return gulp.src(['./app/*.js', './app/components/**/*.js', '!./app/components/**/*_test.js', './app/views/**/*.js', '!./app/views/**/*_test.js' ])
		.pipe(plumber())
		.pipe(concat('packed-app.js'))
		.pipe(uglify())
		.pipe(plumber.stop())
		.pipe(rename('packed-app.min.js'))
		.pipe(gulp.dest('./app/js'));
});

gulp.task('pack-app-css', () => {
	return gulp.src('./app/css/*.scss')
		.pipe(plumber())
		.pipe(concat('packed-app.css'))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(cssnano())
		.pipe(plumber.stop())
		.pipe(rename('packed-app.min.css'))
		.pipe(gulp.dest('./app/css'));
});

gulp.task('pack-vendor-js', () => {
	return gulp.src([
		/*
		*	add third party js files here
		*
		*	sequence is essential
		*/

		'./node_modules/firebase/firebase.js',

		'./node_modules/angular/angular.js',
		'./node_modules/angular-loader/angular-loader.js',
		'./node_modules/angular-sanitize/angular-sanitize.js',
		'./node_modules/angular-aria/angular-aria.js',
		'./node_modules/angular-messages/angular-messages.js',
		'./node_modules/angular-animate/angular-animate.js',
		'./node_modules/angular-material/angular-material.js',
		'./node_modules/angular-resource/angular-resource.js',
		'./node_modules/angular-route/angular-route.js',
		'./node_modules/angular-mocks/angular-mocks.js',
		'./node_modules/angular-websocket/dist/angular-websocket.js',
		'./node_modules/angular-spinner/dist/angular-spinner.js',
		'./node_modules/angular-translate/dist/angular-translate.js'
	])
		.pipe(plumber())
		.pipe(concat('vendor-pack.js'))
		.pipe(uglify())
		.pipe(plumber.stop())
		.pipe(rename('vendor-pack.min.js'))
		.pipe(gulp.dest('./app/js'));
});

gulp.task('pack-vendor-css', () => { // packs vendor css files which bowerFiles put into app/js folder on bower-files task execution
	return gulp.src([
		/*
		*	add third party css files here
		*/
		'./node_modules/font-awesome/css/font-awesome.css',

		'./node_modules/angular-material/angular-material.css',
		'./node_modules/angular-material/layouts/angular-material.layouts.css',
		'./node_modules/angular-material/layouts/angular-material.layout-attributes.css'
	])
		.pipe(plumber())
		.pipe(concat('vendor-pack.css'))
		.pipe(cssnano())
		.pipe(plumber.stop())
		.pipe(rename('vendor-pack.min.css'))
		.pipe(gulp.dest('./app/css'));
});

gulp.task('move-vendor-fonts', () => { // move vendor font files which bowerFiles put into app/fonts folder on bower-files task execution
	return gulp.src([
		/*
		*	add third party fonts here
		*/
		'./node_modules/font-awesome/fonts/*.*'
	])
		.pipe(gulp.dest('./app/fonts'));
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
	gulp.watch(['./gulpfile.js', './app/*.js','./app/components/**/*.js','!./app/components/**/*_test.js','./app/views/**/*.js','!./app/views/**/*_test.js'], ['pack-app-js']);
	gulp.watch('./app/css/app.scss', ['pack-app-css']);
	gulp.watch(['./app/*.js', './app/components/**/*.js','./app/views/**/*.js','./karma.conf.js'], ['client-unit-test']);
	gulp.watch(['./app/*.js', './app/components/**/*.js','!./app/components/**/*_test.js','./app/views/**/*.js','!./app/views/**/*_test.js','./e2e-tests/*.js'], ['client-e2e-test']);
	gulp.watch(['./app/**', './*.js'], ['lint']);
});

gulp.task('build', (done) => {
	runSequence('clean-build', 'lint', 'pack-app-js', 'pack-app-css', 'pack-vendor-js', 'pack-vendor-css', 'move-vendor-fonts', done);
});

gulp.task('run-tests', (done) => {
	runSequence('client-unit-test', 'client-e2e-test', done);
});

gulp.task('default', ['build', 'dev-server', 'run-tests', 'watch']);

process.on('exit', () => {
	if (httpServer) httpServer.emit('kill');
	if (protractor) protractor.kill();
});

process.on('SIGINT', () => {
	killProcessByName('gulp');
});
