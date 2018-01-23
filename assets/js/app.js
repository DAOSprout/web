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
app.controller('mainController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.currentPage = 'index';
    $scope.currentPath = $location.path();
    $scope.selectClass = function (){
        if($location.path() === '/') {
            return "index";
        } else {
            return "no-sidebar";
        }
    };
    $scope.nextPage = function($page) {
        $scope.currentPage = $page;
        $location.reload();
    };
    $scope.isHome = function(){
        return $location.path() === '/';
    };
    $scope.showPage = function($page) {
        return $scope.currentPage === $page;
    }
}]);