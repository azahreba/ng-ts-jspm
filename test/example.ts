describe('Protractor Demo App', () => {
    const url: string = 'http://juliemr.github.io/protractor-demo/';

    it('should have a title', () => {
        browser.get(url);

        expect(browser.getTitle()).toEqual('Super Calculator');
    });
});