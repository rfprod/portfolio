import { browser, by, element } from 'protractor';

export class AppPage {
  public async navigateTo() {
    return browser.get('/');
  }

  public async getRootsSelectorsCount() {
    return element.all(by.css('app-root')).count();
  }
}
