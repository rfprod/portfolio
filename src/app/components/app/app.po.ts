import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getRootsSelectorsCount() {
    return element.all(by.css('root')).count();
  }
}
