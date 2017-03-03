import { WordcampPage } from './app.po';

describe('wordcamp App', function() {
  let page: WordcampPage;

  beforeEach(() => {
    page = new WordcampPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
