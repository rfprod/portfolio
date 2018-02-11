exports.config = {

	onPrepare: function() {
		browser.angularAppRoot('html');
		browser.driver.get('http://localhost:7070/app/index.html');
	},

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

	allScriptsTimeout: 30000,

	getPageTimeout: 30000,

	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000
	}

};
