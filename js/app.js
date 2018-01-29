'use strict';

// angular.js main app initialization
var app = angular.module('SC',['ngRoute']);

// routes
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix('!');
    $routeProvider.
            when('/',{templateUrl: 'templates/home.html', controller: 'mainController' }).
            when('/home',{templateUrl: 'templates/home.html', controller: 'mainController' }).
            when('/registry',{templateUrl: 'templates/registry.html', controller: 'mainController' }).
            when('/lists',{templateUrl: 'templates/lists.html', controller: 'mainController' }).
            when('/sprouts',{templateUrl: 'templates/sprouts.html', controller: 'mainController' }).
            otherwise({redirectTo: '/'})
    }]);

// controllers
app.controller('mainController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.currentPath = $location.path();
    $scope.selectClass = function (){
        if($location.path() === '/' || $location.path() === '/home') {
            return "homepage";
        } else {
            return "no-sidebar";
        }
    };
    $scope.isHome = function(){
        return $location.path() === '/';
    }
}]);