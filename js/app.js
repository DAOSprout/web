'use strict';

//window.addEventListener('load', function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    //if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        //web3js = new Web3(web3.currentProvider);
    //} else {
    //    console.log('No web3? You should consider trying MetaMask!')
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        //web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    //}

    // Now you can start your app & access web3 freely:
    //startApp()

//});

// angular.js main app initialization
var app = angular.module('DS',['ngRoute']);

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

// services


// filters


// directives