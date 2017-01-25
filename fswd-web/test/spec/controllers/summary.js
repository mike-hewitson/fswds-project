'use strict';
var summaryFixture = [{ '_id': { 'date': '2016-04-26' }, 'count': 288, 'avgHum': 50.40173611376021, 'avgTemp': 23.17361119389534, 'maxTemp': 27.799999237060547, 'minTemp': 9.800000190734863, 'maxHum': 60.79999923706055, 'minHum': 35.400001525878906 },
    { '_id': { 'date': '2016-04-25' }, 'count': 288, 'avgHum': 52.63645839691162, 'avgTemp': 22.829513861073387, 'maxTemp': 26.600000381469727, 'minTemp': 19.299999237060547, 'maxHum': 64.69999694824219, 'minHum': 34.5 },
    { '_id': { 'date': '2016-04-23' }, 'count': 287, 'avgHum': 43.2665504827732, 'avgTemp': 22.418466800596654, 'maxTemp': 26.299999237060547, 'minTemp': 19.200000762939453, 'maxHum': 59.79999923706055, 'minHum': 28.700000762939453 },
    { '_id': { 'date': '2016-04-22' }, 'count': 288, 'avgHum': 55.28055561913384, 'avgTemp': 20.390972236792248, 'maxTemp': 24.5, 'minTemp': 16.5, 'maxHum': 72.80000305175781, 'minHum': 39.400001525878906 },
    { '_id': { 'date': '2016-04-08' }, 'count': 288, 'avgHum': 49.70208330949148, 'avgTemp': 18.337152815527386, 'maxTemp': 22, 'minTemp': 15, 'maxHum': 59.599998474121094, 'minHum': 40.79999923706055 },
    { '_id': { 'date': '2016-04-05' }, 'count': 288, 'avgHum': 54.66458331214057, 'avgTemp': 22.705208308166927, 'maxTemp': 24.600000381469727, 'minTemp': 21.100000381469727, 'maxHum': 60.5, 'minHum': 45.400001525878906 },
    { '_id': { 'date': '2016-03-30' }, 'count': 190, 'avgHum': 28.39210522300319, 'avgTemp': 25.748421046608374, 'maxTemp': 29, 'minTemp': 22.600000381469727, 'maxHum': 36.400001525878906, 'minHum': 21.200000762939453 },
    { '_id': { 'date': '2016-04-04' }, 'count': 288, 'avgHum': 50.326388796170555, 'avgTemp': 24.852083265781403, 'maxTemp': 28.299999237060547, 'minTemp': 22.399999618530273, 'maxHum': 57.79999923706055, 'minHum': 42.099998474121094 },
    { '_id': { 'date': '2016-04-24' }, 'count': 288, 'avgHum': 44.58576398425632, 'avgTemp': 22.932638896836174, 'maxTemp': 26.5, 'minTemp': 19.899999618530273, 'maxHum': 56.79999923706055, 'minHum': 28.5 },
    { '_id': { 'date': '2016-04-11' }, 'count': 288, 'avgHum': 50.37465278969871, 'avgTemp': 20.752430511845482, 'maxTemp': 23.5, 'minTemp': 17.5, 'maxHum': 61.20000076293945, 'minHum': 24.100000381469727 },
    { '_id': { 'date': '2016-04-03' }, 'count': 288, 'avgHum': 40.444791648123, 'avgTemp': 26.9482638835907, 'maxTemp': 31, 'minTemp': 24.200000762939453, 'maxHum': 50.79999923706055, 'minHum': 32.70000076293945 },
    { '_id': { 'date': '2016-04-01' }, 'count': 288, 'avgHum': 37.31597230169508, 'avgTemp': 25.022916628254784, 'maxTemp': 28.600000381469727, 'minTemp': 21.200000762939453, 'maxHum': 42.79999923706055, 'minHum': 26.799999237060547 }
];

describe('Controller: SummaryChartCtrl', function() {

    // load the controller's module
    beforeEach(module('fridgesApp'));

    var MainCtrl,
        scope, $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, _$httpBackend_, $rootScope, summaryFactory) {
        scope = $rootScope.$new();

        $httpBackend = _$httpBackend_;


        $httpBackend.expectGET('http://localhost:3000/summary/28').respond(summaryFixture);

        MainCtrl = $controller('SummaryChartCtrl', {
            $scope: scope,
            summaryFactory: summaryFactory
                // place here mocked dependencies
        });

        $httpBackend.flush();

    }));

    it('should show get the 3 summary records', function() {

        expect(scope.showData).toBe(true);
        expect(scope.message).toBe('');
        expect(scope.summary.length).toBe(12);

    });

    it('should create the chart objects', function() {

        expect(scope.chartObject).not.toBe(null);
        expect(scope.chartObject).toBeDefined();

    });
});
