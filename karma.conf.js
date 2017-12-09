module.exports = function(config) {
	config.set({

		basePath: '',

		files: [
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
			'./node_modules/angular-translate/dist/angular-translate.js',

			'./app/app.js',
			'./app/components/**/*.js',
			'./app/views/**/*.js',
			'./app/views/**/*.html'
		],

		frameworks: ['jasmine'],

		// convert html-templates to js files for inclusion in tests
		preprocessors: {
			'app/views/**/*.html': ['ng-html2js']
		},

		ngHtml2JsPreprocessor: {
			// strip this from the file path
			stripPrefix: 'app/',
			//stripSuffix: '.ext',
			// prepend this to the
			//prependPrefix: 'served/',

			// - setting this option will create only a single module that contains templates
			//   from all the files, so you can load them all with module('foo')
			// - you may provide a function(htmlPath, originalPath) instead of a string
			//   if you'd like to generate modules dynamically
			//   htmlPath is a originalPath stripped and/or prepended
			//   with all provided suffixes and prefixes
			moduleName: 'ngTemplates'
		},

		plugins: [
			'karma-ng-html2js-preprocessor',
			'karma-chrome-launcher',
			'karma-jasmine'
		],

		customLaunchers: {
			/*
			*	this custom launcher requires setting env var CHROME_BIN=chromium-browser
			*	possible options for env var value depending on what you have installed:
			*	chromium-browser, chromium, google-chrome
			*/
			ChromeHeadless: {
				base: 'Chrome',
				flags: [
					'--headless',
					'--disable-gpu',
					// Without a remote debugging port Chrome exits immediately
					'--remote-debugging-port=9222'
				]
			}
		},
		browsers: ['ChromeHeadless'],
		//browsers : ['Chrome', 'Firefox'],
		/*
		*	overrides the error, warn instead
		*	by default returns error if there're no tests defined
		*/
		failOnEmptyTestSuite: false,
		browserNoActivityTimeout: 10000,
		
		//hostname: process.env.IP,
		//port: 8080,
		//runnerPort: 0,

		logLevel: config.LOG_DEBUG,
		autoWatch: true,
		singleRun: false,
		colors: true

	});
};
