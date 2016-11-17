// Module
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);


// Routes
weatherApp.config(function($routeProvider) {

    $routeProvider

        .when('/', {
        templateUrl: 'views/home.html',
        controller: 'homeCtrl'
    })

        .when('/forecast', {
        templateUrl: 'views/forecast.html',
        controller: 'forecastCtrl'
    })

});


// Services
weatherApp.service('cityService', function() {
    this.city = "Stockholm";
});


weatherApp.service('weatherService', ['$resource', function($resource) {

    this.GetWeather = function(city) {
        var weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?appid=e8175d7179677689b7c37881471bace3", {
            callback: "JSON_CALLBACK"
        }, {
            get: {
                method: "JSONP"
            }
        });

        return weatherAPI.get({
            q: city,
            cnt: 5,
        });
    };
}]);


// Controllers
weatherApp.controller('homeCtrl', ['$scope', '$location', 'cityService',
    function($scope, $location, cityService) {

        $scope.city = cityService.city;

        $scope.$watch('city', function() {
            cityService.city = $scope.city;
        });

        $scope.submit = function() {
            $location.path('/forecast');
        };

    }
]);

weatherApp.controller('forecastCtrl', ['$scope', 'cityService', 'weatherService',
    function($scope, cityService, weatherService) {

        $scope.city = cityService.city;

        $scope.weatherResult = weatherService.GetWeather($scope.city);

        $scope.convertToCelsius = function(degK) {

            return Math.round(degK - 273);

        }

        $scope.convertToDate = function(dt) {
            return new Date(dt * 1000);
        };

    }
]);


// Directives
weatherApp.directive('weatherReport', function() {
    return {
        restrict: 'E',
        templateUrl: 'directives/weatherReport.html',
        replace: true,
        scope: {
            weatherDay: "=",
            convertToStandard: "&",
            convertToDate: "&",
        }
    }
});