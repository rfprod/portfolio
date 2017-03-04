//jshint strict: false
module.exports = function(config) {
	config.set({

		basePath: './app',

		files: [
				'bower_components/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js', // eslint-disable-line indent
			'bower_components/jquery/dist/jquery.min.js',
				'bower_components/bootstrap-css/js/bootstrap.min.js', // eslint-disable-line indent
			'bower_components/angular/angular.js',
			'bower_components/angular-route/angular-route.js',
			'bower_components/angular-resource/angular-resource.min.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'bower_components/angular-bootstrap/ui-bootstrap.js',
			'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
			'bower_components/angular-sanitize/angular-sanitize.js',
			'bower_components/angular-spinner/dist/angular-spinner.js',
			'app.js',
			'components/**/*.js',
			'views/**/*.js'
		],

		autoWatch: true,
		singleRun: false,

		frameworks: ['jasmine'],

		browsers: ['PhantomJS'],
		//browsers: ['Chromium'],

		plugins: [
			//'karma-chrome-launcher',
			'karma-phantomjs-launcher',
			'karma-jasmine'
		],

		phantomjsLauncher: {
			exitOnResourceError: false
		},
		failOnEmptyTestSuite: false,
		logLevel: config.LOG_DEBUG,
		colors: true

	});
};
