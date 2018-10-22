const testUtils = require('./test-utils');
const headlessChromeFlags = testUtils.headlessChromeFlags();

const os = require('os');

module.exports = function(config){
	config.set({

		basePath : '../',
		
		files : [

			'node_modules/core-js/client/shim.js',
			'node_modules/reflect-metadata/Reflect.js',

			'node_modules/zone.js/dist/zone.js',
			'node_modules/zone.js/dist/long-stack-trace-zone.js',
			'node_modules/zone.js/dist/proxy.js',
			'node_modules/zone.js/dist/sync-test.js',
			'node_modules/zone.js/dist/jasmine-patch.js',
			'node_modules/zone.js/dist/async-test.js',
			'node_modules/zone.js/dist/fake-async-test.js',

			'node_modules/moment/min/moment-with-locales.min.js',

			'node_modules/systemjs/dist/system.src.js',
			{ pattern: 'node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css' },

			{ pattern: 'systemjs.config.js', included: false, watched: false },
			{ pattern: 'systemjs.karma.config.js', included: false, watched: false },
			{ pattern: 'systemjs.config.extras.js', included: false, watched: false },
			
			'node_modules/hammerjs/hammer.js',
			{ pattern: 'node_modules/@angular/**', included: false, watched: false },
			{ pattern: 'node_modules/rxjs/**', included: false, watched: false },

			{ pattern: 'node_modules/tslib/**', included: false, watched: false },
			{ pattern: 'node_modules/traceur/**', included: false, watched: false },

			'test/karma.test-shim.js',
			{ pattern: 'test/client/**', included: false, watched: false },

			{ pattern: 'public/src/**', included: false, watched: false },

			{ pattern: 'public/views/**', included: false, watched: false },

			{ pattern: 'public/webfonts/**', included: false, watched: false },

			{ pattern: 'public/img/**', included: false, watched: false },
		],

		proxies: {
			'/public/webfonts/': '/base/public/webfonts/',
			'/public/img/': '/base/public/img/',
			'/views': '/base/public/views'
		},

		frameworks: ['parallel', 'jasmine'],

		browserNoActivityTimeout: 20000,
		browserDisconnectTimeout: 20000,
		customLaunchers: {
			/*
			*	this custom launcher requires setting env var CHROME_BIN=chromium-browser
			*	possible options for env var value depending on what you have installed:
			*	chromium-browser, chromium, google-chrome
			*/
			ChromeHeadless: {
				base: 'Chrome',
				flags: headlessChromeFlags
			}
		},
		browsers: ['ChromeHeadless'],
		
		plugins: [
			'karma-parallel',
			'karma-redirect-preprocessor',
			'karma-chrome-launcher',
			'karma-html-reporter',
			'karma-sourcemap-loader',
			'karma-coverage',
			'karma-jasmine'
		],

		parallelOptions: {
			executors: Math.ceil(os.cpus().length / 2),
			shardStrategy: 'description-length'
		},

		preprocessors: {
			'public/**/*.html': ['redirect'],
			'public/src/**/!(*.spec|*.mock).js': ['coverage'],
			'public/src/*.js': ['sourcemap']
		},

		reporters: ['progress', 'coverage', 'html'],
		coverageReporter: {
			dir: 'public/logs/',
			reporters: [
				{ type: 'json', subdir: 'coverage'}
			]
		},
		htmlReporter: {
			outputDir: 'public/logs/unit',
			templatePath: null,
			focusOnFailures: true,
			namedFiles: false,
			pageTitle: 'Portfolio Client Unit Tests',
			urlFriendlyName: true,
			reportName: 'client'
		},

		failOnEmptyTestSuite: false,

		hostname: process.env.IP,
		port: process.env.PORT,
		runnerPort: 0,

		autoWatch: true,
		singleRun: true,
		colors: true,

		logLevel: config.LOG_ERROR,
		browserConsoleLogOptions: {
			level: 'debug',
			format: '%b %T %m',
			path: 'public/logs/unit/browser-console.log',
			terminal: false
		}

	});
};
