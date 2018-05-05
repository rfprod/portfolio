const testUtils = require('./test-utils');
const isDocker = testUtils.isDocker();

exports.config = {

	useAllAngular2AppRoots: true,

	onPrepare: function() {
		browser.angularAppRoot('html');
		browser.driver.get('http://localhost:7070/app/index.html');

		return browser.getProcessedConfig().then((/*config*/) => {
			// console.log('config:', config);
		});
	},

	specs: [
		'e2e/scenarios.js'
	],

	capabilities: {
		browserName: 'chrome',
		chromeOptions: {
			args: (!isDocker) ? [
				'--headless',
				'--disable-gpu',
				'--window-size=1680x1024'
			] : [
				'--headless',
				'--disable-gpu',
				'--window-size=1680x1024',
				'--no-sandbox'
			]
		}
	},

	chromeOnly: true,

	directConnect: true,

	baseUrl: 'http://localhost:7070/',

	framework: 'jasmine',

	allScriptsTimeout: 5000000,

	getPageTimeout: 5000000,

	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 5000000
	}
};
