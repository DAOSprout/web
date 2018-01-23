'use strict';

// angular.js main app initialization
var app = angular.module('DS',['ngRoute']);

// routes
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix('!');
    $routeProvider.
            when('wallet',{templateUrl: 'fragments/wallet.html', controller: 'mainController' }).
            when('register',{templateUrl: 'fragments/register.html', controller: 'mainController' }).
            otherwise({redirectTo: '/'})
    }]);

// controllers
app.controller('mainController', ['$scope', '$http', '$location', '$localStorage', function ($scope, $http, $location, $localStore) {
    $scope.currentPath = $location.path();
    $scope.selectClass = function (){
        if($location.path() === '/') {
            return "index";
        } else {
            return "no-sidebar";
        }
    };
    $scope.isHome = function(){
        return $location.path() === '/';
    };
}]);