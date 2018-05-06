'use strict';

const gulp = require('gulp'),
	runSequence = require('run-sequence'),
	webserver = require('gulp-webserver'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
	eslint = require('gulp-eslint'),
	tslint = require('gulp-tslint'),
	plumber = require('gulp-plumber'),
	uglify = require('gulp-uglify'),
	karmaServer = require('karma').Server,
	sass = require('gulp-sass'),
	cssnano = require('gulp-cssnano'),
	autoprefixer = require('gulp-autoprefixer'),
	systemjsBuilder = require('gulp-systemjs-builder'),
	spawn = require('child_process').spawn,
	exec = require('child_process').exec;
let httpServer,
	protractor,
	tsc;

/**
 *	load .env variables
 */
require('dotenv').load();

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

gulp.task('server', (done) => {
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
			if (req.url.match(/^\/(__|app|css|data|img|js|views|webfonts)\/.*$/)) {
				console.log('httpServer middleware SPA config, pass request:', req.url);
			} else {
				console.log('httpServer middleware SPA config, replace url:', req.url);
				req.url = '/index.html';
			}
			next();
		}
	}));
	done();
});

gulp.task('tsc', (done) => {
	if (tsc) tsc.kill();
	tsc = spawn('tsc', [], {stdio: 'inherit'});
	tsc.on('close', (code) => {
		if (code === 8) {
			console.log('Error detected, waiting for changes...');
		} else {
			done();
		}
	});
});

let karmaSRV;
gulp.task('client-unit-test', (done) => {
	if (!karmaSRV) {
		karmaSRV = new karmaServer({
			configFile: require('path').resolve('test/karma.conf.js'),
			singleRun: true
		});

		karmaSRV.on('browser_error', (browser, err) => {
			console.log('=====\nKarma > Run Failed\n=====\n', err);
			throw err;
		});

		karmaSRV.on('run_complete', (browsers, results) => {
			if (results.failed) {
				console.log('=====\nKarma > Tests Failed\n=====\n', results);
			} else {
				console.log('=====\nKarma > Complete With No Failures\n=====\n', results);
			}
			done();
		});

		karmaSRV.start();
	} else {
		console.log('<<<<< karmaSRV already running >>>>>');
	}
});

gulp.task('client-e2e-test', (done) => {
	if (protractor) protractor.kill();
	protractor = spawn('npm', ['run', 'protractor'], {stdio: 'inherit'});
	protractor.on('exit', (exitCode) => {
		console.log('Protractor done, exited with code', exitCode);
		done();
	});
});

gulp.task('run-tests', (done) => {
	runSequence('client-unit-test', 'client-e2e-test', done);
});

gulp.task('build-system-js', () => {
	/*
	*	this task builds angular application
	*	components, angular modules, and some dependencies
	*
	*	nonangular components related to design, styling, data visualization etc.
	*	are built by another task
	*/
	return systemjsBuilder('/','./systemjs.config.js')
		.buildStatic('app', 'bundle.min.js', {
			minify: true,
			mangle: true
		})
		.pipe(replace(/GITHUB_ACCESS_TOKEN/, (match, offset) => {
			console.log('gulp replaced ' + match + ' at ' + offset + 'with actual github access token' );
			return process.env.GITHUB_ACCESS_TOKEN;
		}))
		.pipe(gulp.dest('./app/js'));
});

gulp.task('sass-autoprefix-minify-css', () => {
	return gulp.src('./app/css/*.scss')
		.pipe(plumber())
		.pipe(concat('packed-app.css'))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(cssnano())
		.pipe(plumber.stop())
		.pipe(rename('bundle.min.css'))
		.pipe(gulp.dest('./app/css'));
});

gulp.task('pack-vendor-js', () => {
	return gulp.src([
		/*
		*	add paths to required third party js libraries here
		*/
		// firebase
		'./node_modules/firebase/firebase.js',
		// angular requirements
		'./node_modules/core-js/client/shim.js',
		'./node_modules/zone.js/dist/zone.min.js',
		'./node_modules/reflect-metadata/Reflect.js',
		'./node_modules/web-animations-js/web-animations.min.js'
	])
		.pipe(plumber())
		.pipe(concat('vendor-bundle.js'))
		.pipe(uglify())
		.pipe(plumber.stop())
		.pipe(rename('vendor-bundle.min.js'))
		.pipe(gulp.dest('./app/js'));
});

gulp.task('pack-vendor-css', () => {
	return gulp.src([
		/*
		*	add third party css files here
		*/
		/*
		*	Angular material theme should be chosen and loaded here
		*/
		'./node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css'
		//'./node_modules/@angular/material/prebuilt-themes/indigo-pink.css'
		//'./node_modules/@angular/material/prebuilt-themes/pink-bluegrey.css'
		//'./node_modules/@angular/material/prebuilt-themes/purple-green.css'
	])
		.pipe(plumber())
		.pipe(concat('vendor-bundle.css'))
		.pipe(cssnano())
		.pipe(plumber.stop())
		.pipe(rename('vendor-bundle.min.css'))
		.pipe(gulp.dest('./app/css'));
});

gulp.task('move-vendor-fonts', () => {
	return gulp.src([
		/*
		*	add third party fonts here
		*/
		// material design icons
		'./node_modules/material-design-icon-fonts/iconfont/*.eot',
		'./node_modules/material-design-icon-fonts/iconfont/*.woff2',
		'./node_modules/material-design-icon-fonts/iconfont/*.woff',
		'./node_modules/material-design-icon-fonts/iconfont/*.ttf'
	])
		.pipe(gulp.dest('./app/webfonts'));
});


gulp.task('eslint', () => {
	return gulp.src(['./*.js', './functions/index.js', './test/**/*.js']) // uses ignore list from .eslintignore
		.pipe(eslint('./.eslintrc.json'))
		.pipe(eslint.format());
});

gulp.task('tslint', () => {
	return gulp.src(['./app/*.ts', './app/**/*.ts', '!./app/{css,views}/', './test/client/**/*.ts'])
		.pipe(tslint({
			formatter: 'verbose' // 'verbose' - extended info | 'prose' - brief info
		}))
		.pipe(tslint.report({
			emitError: false
		}));
});

gulp.task('lint', (done) => {
	runSequence('eslint', 'tslint', done);
});


gulp.task('watch', () => {
	gulp.watch(['./gulpfile.js'], ['pack-vendor-js', 'pack-vendor-css', 'move-vendor-fonts', 'server']);
	gulp.watch('./app/css/*.scss', ['sass-autoprefix-minify-css']);
	gulp.watch(['./app/*.js', './app/components/**/*.js','./app/views/**/*.js','./karma.conf.js'], ['client-unit-test']);
	gulp.watch(['./app/*.ts', './app/**/*.ts', './test/client/**/*.ts', './tslint.json'], ['spawn-rebuild-app']);
	gulp.watch(['./*.js', './functions/index.js', './test/**/*.js'], ['eslint']);
});


gulp.task('build', (done) => {
	runSequence('build-system-js', 'sass-autoprefix-minify-css', 'pack-vendor-js', 'pack-vendor-css', 'move-vendor-fonts', done);
});

gulp.task('compile-and-build', (done) => {
	runSequence('tsc', 'build-system-js', 'sass-autoprefix-minify-css', 'pack-vendor-js', 'pack-vendor-css', 'move-vendor-fonts', done);
});

gulp.task('rebuild-app', (done) => { // should be used in watcher to rebuild the app on *.ts file changes
	runSequence('tslint', 'tsc', 'build-system-js', done);
});

let rebuildApp;
gulp.task('spawn-rebuild-app', (done) => {
	if (rebuildApp) rebuildApp.kill();
	rebuildApp = spawn('gulp', ['rebuild-app'], {stdio: 'inherit'});
	rebuildApp.on('close', (code) => {
		console.log(`rebuildApp closed with code ${code}`);
	});
	done();
});


gulp.task('default', (done) => {
	runSequence('compile-and-build', 'server', /*'run-tests',*/ 'watch', done);
});


process.on('exit', (code) => {
	console.log(`PROCESS EXIT CODE ${code}`);
	// if (httpServer) httpServer.emit('kill');
	// if (protractor) protractor.kill();
	// if (tsc) tsc.kill();
	// killProcessByName('gulp');
});
