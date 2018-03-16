'use strict';

describe('portfolio', () => {

	it('should automatically redirect all url-requests to /', (done) => {
		browser.ignoreSynchronization = true;
		browser.get('');
		expect(browser.getCurrentUrl()).toMatch(/\//);

		done();
	});

	describe('Portfolio view', () => {

		function waitForElementPresence(locator, timeout) {
			if (!timeout) {
				browser.wait(() => {
					return element(locator).isPresent();
				}, 7000);
			} else {
				browser.wait(() => {
					return element(locator).isPresent();
				}, timeout);
			}
		}

		beforeEach(() => {
			browser.ignoreSynchronization = true;
			browser.get('/');
		});

		it('should render portfolio view when user navigates to /', (done) => {
			browser.driver.manage().window().setSize(1024, 768);
			expect(browser.getCurrentUrl()).toMatch(/\//);
			expect(element(by.css('.flex-container')).isDisplayed()).toBeTruthy();
			expect(element.all(by.css('a.flex-item')).get(0).isDisplayed()).toBeTruthy();
			expect(element.all(by.css('a.flex-item')).get(1).isDisplayed()).toBeTruthy();
			expect(element.all(by.css('a.flex-item')).get(2).isDisplayed()).toBeTruthy();
			expect(element.all(by.tagName('img')).get(0).isDisplayed()).toBeTruthy();
			waitForElementPresence(by.css('#badge'), 10000); // codewars badge may take some time to load
			expect(element.all(by.tagName('img')).get(1).isPresent()).toBeTruthy(); // this is Codewars badge and there are issues with this element display when testing
			expect(element.all(by.tagName('img')).get(2).isDisplayed()).toBeTruthy();
			expect(element.all(by.tagName('img')).get(3).isDisplayed()).toBeTruthy();
			expect(element.all(by.tagName('table')).get(0).isDisplayed()).toBeTruthy();
			expect(element.all(by.tagName('table')).get(1).isDisplayed()).toBeTruthy();

			done();
		});

		let rootHandle;
		it('should open links in new tabs on each flex-item click: codewars', (done) => {
			element.all(by.css('a.flex-item')).get(0).click().then(() => {
				browser.getAllWindowHandles().then((handles) => {
					rootHandle = handles[0];
					const newWindowHandle = handles[1];
					browser.switchTo().window(newWindowHandle).then(() => {
						expect(browser.getCurrentUrl()).toMatch(/codewars/);
					});
				});
			});

			done();
		});

		it('should open links in new tabs on each flex-item click: hackerrank', (done) => {
			browser.close();
			browser.switchTo().window(rootHandle).then(() => {
				element.all(by.css('a.flex-item')).get(1).click().then(() => {
					browser.getAllWindowHandles().then((handles) => {
						rootHandle = handles[0];
						const newWindowHandle = handles[1];
						browser.switchTo().window(newWindowHandle).then(() => {
							expect(browser.getCurrentUrl()).toMatch(/hackerrank/);
						});
					});
				});
			});

			done();
		});

		it('should open links in new tabs on each flex-item click: github', (done) => {
			browser.close();
			browser.switchTo().window(rootHandle).then(() => {
				/*
				*	check anchor attributes instead of opening link in a jew window
				*/
				element.all(by.css('a.flex-item')).get(2).getAttribute('href').then((value) => {
					expect(value).toMatch(/github/);
				});
				element.all(by.css('a.flex-item')).get(2).getAttribute('target').then((value) => {
					expect(value).toMatch(/_blank/);
				});
			});

			done();
		});

		it('should open links in new tabs on each flex-item click: codepen', (done) => {
			/*
			*	no need to switch windows here
			*/
			element.all(by.css('a.flex-item')).get(3).click().then(() => {
				browser.getAllWindowHandles().then((handles) => {
					const newWindowHandle = handles[1];
					browser.switchTo().window(newWindowHandle).then(() => {
						expect(browser.getCurrentUrl()).toMatch(/codepen/);
					});
				});
			});

			done();
		});

	});
});
