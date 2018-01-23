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
        //if($location.path() === '/') {
        if($localStore.currentPage === '' || $localStore.currentPage === 'index') {
            return "index";
        } else {
            return "no-sidebar";
        }
    };
    $scope.nextPage = function($page) {
        $localStore.currentPage = $page;
        $location.reload();
    };
    $scope.isHome = function(){
        //return $location.path() === '/';
        return $localStore.currentPage === '' || $localStore.currentPage === 'index';
    };
    $scope.showPage = function($page) {
        return $localStore.currentPage === $page;
    }
}]);