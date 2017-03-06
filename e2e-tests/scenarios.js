'use strict';

describe('portfolio', function() {

	it('should automatically redirect all url-requests to /', function(done) {
		browser.ignoreSynchronization = true;
		browser.get('');
		expect(browser.getLocationAbsUrl()).toMatch(/\//);

		done();
	});

	describe('Portfolio view', function() {

		function waitForElementPresence(locator, timeout) {
			if (!timeout) {
				browser.wait(function() {
					return browser.driver.isElementPresent(locator);
				}, 7000);
			} else {
				browser.wait(function() {
					return browser.driver.isElementPresent(locator);
				}, timeout);
			}
		}

		beforeEach(function() {
			browser.ignoreSynchronization = true;
			browser.get('/');
		});

		it('should render portfolio view when user navigates to /', function(done) {
			browser.driver.manage().window().setSize(1024, 768);
			expect(browser.getLocationAbsUrl()).toMatch(/\//);
			expect(element(by.css('.flex-container')).isDisplayed()).toBeTruthy();
			expect(element.all(by.css('.flex-item')).get(0).isDisplayed()).toBeTruthy();
			expect(element.all(by.css('.flex-item')).get(1).isDisplayed()).toBeTruthy();
			expect(element.all(by.css('.flex-item')).get(2).isDisplayed()).toBeTruthy();
			expect(element.all(by.tagName('img')).get(0).isDisplayed()).toBeTruthy();
			waitForElementPresence(by.css('#badge'), 10000); // codewars badge may take some time to load
			expect(element.all(by.tagName('img')).get(1).isPresent()).toBeTruthy(); // this is Codewars badge and there are issues with this element display when testing
			expect(element.all(by.tagName('img')).get(2).isDisplayed()).toBeTruthy();
			expect(element.all(by.tagName('img')).get(3).isDisplayed()).toBeTruthy();
			expect(element.all(by.tagName('table')).get(0).isDisplayed()).toBeTruthy();
			expect(element.all(by.tagName('table')).get(1).isDisplayed()).toBeTruthy();

			done();
		});

		var rootHandle;
		it('should open links in new tabs on each flex-item click: codewars', function(done) {
			element.all(by.css('.flex-item')).get(0).click().then(function() {
				browser.getAllWindowHandles().then(function(handles) {
					rootHandle = handles[0];
					var newWindowHandle = handles[1];
					browser.switchTo().window(newWindowHandle).then(function() {
						expect(browser.getCurrentUrl()).toMatch(/codewars/);
					});
				});
			});

			done();
		});

		it('should open links in new tabs on each flex-item click: github', function(done) {
			browser.close();
			browser.switchTo().window(rootHandle).then(function() {
				/*
				*	CSP returns error, so instead of checking url after click
				*	anchor element attributes are checked
				*/
				element.all(by.css('.flex-item')).get(1).getAttribute('href').then(function(value) {
					expect(value).toMatch(/github/);
				});
				element.all(by.css('.flex-item')).get(1).getAttribute('target').then(function(value) {
					expect(value).toMatch(/_blank/);
				});
			});

			done();
		});

		it('should open links in new tabs on each flex-item click: codepen', function(done) {
			element.all(by.css('.flex-item')).get(2).click().then(function() {
				browser.getAllWindowHandles().then(function(handles) {
					var newWindowHandle = handles[1];
					browser.switchTo().window(newWindowHandle).then(function() {
						expect(browser.getCurrentUrl()).toMatch(/codepen/);
					});
				});
			});

			done();
		});

	});
});
