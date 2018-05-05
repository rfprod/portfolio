const fs = require('fs');

function isDocker() {
	try {
		fs.statSync('/.dockerenv');
		console.log('DOCKER environment detected');
		return true;
	} catch(e) {
		return false;
	}
}

module.exports = {
	isDocker: isDocker,
	headlessChromeFlags: () => {
		const flags = [
			'--headless',
			'--disable-gpu',
			// Without a remote debugging port Chrome exits immediately
			'--remote-debugging-port=9222'
		];
		if (isDocker()) {
			flags.push(['--no-sandbox']); // required by Docker
		}
		return flags;
	}
};
