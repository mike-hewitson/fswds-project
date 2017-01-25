angular.module('starter.services', [])
    // .constant("baseURL", "http://localhost:3000/")
    .constant("baseURL", "https://guarded-reef-92599.herokuapp.com/")

.factory('latestFactory', ['$http', 'baseURL', function($http, baseURL) {
    return {
        get: function() {
            return $http.get(baseURL + 'recordings/currentstate/MainGeyser');
        }
    };
}])

.factory('tempFactory', ['$http', 'baseURL', function($http, baseURL) {
    return {
        getToday: function() {
            return $http.get(baseURL + 'recordings/today/MainGeyser');
        },
        getAtDate: function(_day) {
            return $http.get(baseURL + 'recordings/byday/' + _day);
        }
    };
}])

.factory('energyFactory', ['$http', 'baseURL', function($http, baseURL) {
    return {
        getLast30: function() {
            return $http.get(baseURL + 'energy/daily/MainGeyser');
        },
        getWeekly: function() {
            return $http.get(baseURL + 'energy/weekly/MainGeyser');
        }
    };
}])

.factory('settingFactory', ['$http', 'baseURL', function($http, baseURL) {
    return {
        get: function(_id) {
            return $http.get(baseURL + 'settings/' + _id);
        },
        update: function(_id) {
            return $http.put(baseURL + 'settings/' + _id);
        }
    };

}]);
