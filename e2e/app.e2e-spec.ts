import { WordCampPage } from './app.po';

describe('word-camp App', function() {
  let page: WordCampPage;

  beforeEach(() => {
    page = new WordCampPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
