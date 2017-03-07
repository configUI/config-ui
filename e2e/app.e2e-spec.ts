import { ConfigUiPage } from './app.po';

describe('config-ui App', () => {
  let page: ConfigUiPage;

  beforeEach(() => {
    page = new ConfigUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
