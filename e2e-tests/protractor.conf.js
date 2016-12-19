exports.config = {

	directConnect: false,

	chromeOnly: false,

	allScriptsTimeout: 15000,

	specs: [
		'scenarios.js'
	],

	capabilities: {
		//'browserName': 'chrome'
		'browserName': 'phantomjs',
		'phantomjs': {
			'binary': {
				'path': require('phantomjs-prebuilt').path
			},
			'ghostdriver': {
				'cli': {
					'args': ['--loglevel=DEBUG']
				}
			}
		}
	},

	baseUrl: 'http://localhost:7070/',

	framework: 'jasmine',

	jasmineNodeOpts: {
		defaultTimeoutInterval: 30000
	}

};
