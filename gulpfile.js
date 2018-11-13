'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');
const webserver = require('gulp-webserver');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const eslint = require('gulp-eslint');
const tslint = require('gulp-tslint');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const karmaServer = require('karma').Server;
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const systemjsBuilder = require('gulp-systemjs-builder');
const spawn = require('child_process').spawn;
const fs = require('fs');

let httpServer;
let protractor;
let tsc;

/**
 *	load .env variables
 */
require('dotenv').load();

gulp.task('generate-logs-index', (done) => {
	const logsIndexHTML = `
	<!DOCTYPE html>
	<html>
		<head>
			<style>
				body {
					height: 100%;
					margin: 0;
					padding: 0 1em;
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					align-items: flex-start;
					align-content: flex-start;
					justify-content: stretch;
				}
				.flex-100 {
					flex: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.flex-item {
					flex: 1 1 auto;
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					align-items: center;
					justify-content: center;
					border: 1px rgba(0, 0, 0, 0.3) dotted;
				}
				a {
					text-transform: uppercase;
				}
			</style>
		</head>
		<body>
			<h1 class="flex-100">Portfolio Reports and Documentation Index</h1>

			<h2 class="flex-100">Reports</h2>

				<span class="flex-item">
					<h3 class="flex-100">Client Unit</h3>
					<a class="flex-item" href="unit/client/index.html" target=_blank>Spec</a>
					<a class="flex-item" href="coverage/html-report/index.html" target=_blank>Coverage</a>
					<small class="flex-100"><a href="unit/browser-console.log" target=_blank>browser-console.log</a></small>
				</span>

		</body>
	</html>
	`;

	fs.writeFile('./public/logs/index.html', logsIndexHTML, (err) => {
		if (err) throw err;
		console.log('# > LOGS index.html > was created');
		done();
	});
});

gulp.task('server', (done) => {
	if (httpServer) httpServer.emit('kill');
	httpServer = gulp.src('./public').pipe(webserver({
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
			if (req.url.match(/^\/((__|public|css|data|img|js|views|webfonts)\/|robots).*$/)) {
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
			console.log('gulp replaced ' + match + ' at ' + offset + ' with actual github access token' );
			return process.env.GITHUB_ACCESS_TOKEN;
		}))
		.pipe(gulp.dest('./public/js'));
});

gulp.task('sass-autoprefix-minify-css', () => {
	return gulp.src('./public/css/*.scss')
		.pipe(plumber())
		.pipe(concat('packed-app.css'))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(cssnano())
		.pipe(plumber.stop())
		.pipe(rename('bundle.min.css'))
		.pipe(gulp.dest('./public/css'));
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
		.pipe(gulp.dest('./public/js'));
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
		.pipe(gulp.dest('./public/css'));
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
		.pipe(gulp.dest('./public/webfonts'));
});


gulp.task('eslint', () => {
	return gulp.src(['./*.js', './functions/index.js', './test/*.js', './test/e2e/*.js']) // uses ignore list from .eslintignore
		.pipe(eslint('./.eslintrc.json'))
		.pipe(eslint.format());
});

gulp.task('tslint', () => {
	return gulp.src(['./public/*.ts', './public/**/*.ts', '!./public/{css,views}/', './test/client/*.ts', './test/client/**/*.ts'])
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
	gulp.watch('./public/css/*.scss', ['sass-autoprefix-minify-css']);
	gulp.watch(['./public/src/**/*.js', './karma.conf.js'], ['client-unit-test']);
	gulp.watch(['./public/src/**/*.ts', './tslint.json'], ['spawn-rebuild-app']);
	gulp.watch(['./test/client/*.ts', './test/client/**/*.ts'], ['tsc']);
	gulp.watch(['./*.js', './functions/index.js', './test/*.js', './test/e2e/*.js'], ['eslint']);
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
	runSequence('compile-and-build', 'server', 'watch', done);
});


process.on('exit', (code) => {
	console.log(`PROCESS EXIT CODE ${code}`);
});
