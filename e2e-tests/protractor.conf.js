exports.config = {

	specs: [
		'scenarios.js'
	],

	capabilities: {
		browserName: 'chrome',
		chromeOptions: {
			args: [ '--headless', '--disable-gpu', '--window-size=1024x768' ]
		}
	},

	chromeOnly: false,

	directConnect: true,

	baseUrl: 'http://localhost:7070/',

	framework: 'jasmine',

	allScriptsTimeout: 15000,

	getPageTimeout: 15000,

	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000
	}

};
