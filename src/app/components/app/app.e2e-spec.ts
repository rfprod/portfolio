import { AppPage } from './app.po';

import { Expected } from 'protractor/bin/elementexplorer';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getRootsSelectorsCount()).toEqual(1 as Expected<Promise<number>>);
  });
});
