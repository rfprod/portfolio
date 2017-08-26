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

gulp.task('clean-build', () => { // clean old files before a new build
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
		.pipe(sass())
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
		'./node_modules/jquery/dist/jquery.js',
		'./node_modules/bootstrap/dist/js/bootstrap.js',

		'./node_modules/angular/angular.js',
		'./node_modules/angular-animate/angular-animate.js',
		'./node_modules/angular-touch/angular-touch.js',
		'./node_modules/angular-loader/angular-loader.js',
		'./node_modules/angular-mocks/angular-mocks.js',
		'./node_modules/angular-resource/angular-resource.js',
		'./node_modules/angular-route/angular-route.js',
		'./node_modules/angular-sanitize/angular-sanitize.js',
		'./node_modules/angular-websocket/dist/angular-websocket.js',
		'./node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
		'./node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
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
		'./node_modules/bootstrap/dist/css/bootstrap.css',
		'./node_modules/bootstrap/dist/css/bootstrap-theme.css',
		'./node_modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.css',
		'./node_modules/font-awesome/css/font-awesome.css'
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
		'./node_modules/bootstrap/dist/fonts/*.*',
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
	gulp.watch(['./app/*.js','./app/components/**/*.js','!./app/components/**/*_test.js','./app/views/**/*.js','!./app/views/**/*_test.js'], ['concat-and-uglify-js']);
	gulp.watch('./app/css/app.scss', ['sass-autoprefix-minify-css']);
	gulp.watch(['./app/*.js', './app/components/**/*.js','./app/views/**/*.js','./karma.conf.js'], ['client-unit-test']);
	gulp.watch(['./app/*.js', './app/components/**/*.js','!./app/components/**/*_test.js','./app/views/**/*.js','!./app/views/**/*_test.js','./e2e-tests/*.js'], ['client-e2e-test']);
	gulp.watch(['./app/**', './*.js'], ['lint']);
});

gulp.task('build', (done) => {
	runSequence('clean-build', 'lint', 'pack-app-js', 'pack-app-css', 'pack-vendor-js', 'pack-vendor-css', 'move-vendor-fonts', 'client-unit-test', 'client-e2e-test', done);
});

gulp.task('default', ['build','server','watch']);

process.on('exit', () => {
	if (httpServer) httpServer.kill();
	if (protractor) protractor.kill();
});

process.on('SIGINT', () => {
	killProcessByName('gulp');
});
