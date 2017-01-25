'use strict';

describe('Fridge App E2E Testing', function() {

    it('should automatically redirect to / when location hash/fragment is empty', function() {

        browser.get('index.html');
        expect(browser.getLocationAbsUrl()).toMatch("/");

    });
});

describe('index', function() {
    beforeEach(function() {
        browser.get('index.html#/');
    });

    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Mikes Storeroom');
    });

    it('should show three sensors', function() {
        expect(element.all(by.repeater('sensor in reading.sensors'))
            .count()).toEqual(3);

    });

    it('should have ambient first', function() {
        var author = element.all(by.repeater('sensor in reading.sensors'))
            .first().element(by.binding('sensor.sensor'));

        expect(author.getText()).toContain('Ambient');
    });

    it('should have curing last', function() {
        var author = element.all(by.repeater('sensor in reading.sensors'))
            .last().element(by.binding('sensor.sensor'));

        expect(author.getText()).toContain('Curing');
    });

    it('The date should be should have a name', function() {
        var time = element(by.binding('reading.date'));
        expect(time.getText()).toEqual('@ 2016-03-22 10:31:13');
    });

});

describe('history', function() {
    beforeEach(function() {
        browser.get('/#/history');
    });

    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Mikes Storeroom');
    });

});

