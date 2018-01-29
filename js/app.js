'use strict';

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


window.addEventListener('load', function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No web3? You should consider trying MetaMask!');
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    // Now you can start your app & access web3 freely:
    if(!web3.isConnected()) {
        // Provide a message that meta-mask not connected
        console.log('Meta-mask not connected.');
    } else {
        var account = web3.eth.accounts[0];
        var accountInterval = setInterval(function() {
            if (web3.eth.accounts[0] !== account) {
                account = web3.eth.accounts[0];
                //updateInterface();
            }
        }, 100);
        console.log('Meta-mask is connected.');
        console.log('Default Acct: '+web3.eth.defaultAccount);
        console.log('Accounts: '+web3.eth.accounts);
        web3.eth.getMining(function (error,result){
            console.log('Is Mining: '+result);
        });
        web3.eth.getAccounts(function (err, accounts) {
                web3.eth.getBalance(accounts[0], function (err, balance) {
                    console.log('My Eth balance is ' + web3.fromWei(balance, 'ether'))
                })
            });
        web3.net.getPeerCount(function(error, result){
            console.log('Number of peers: '+result);
        });
        web3.eth.getHashrate(function(error, result){
            console.log('Hashrate: '+result);
        });
        web3.eth.getGasPrice(function(error, result){
            console.log('Gas Price: '+result);
        });
        web3.version.getNetwork(function(err, netId) {
            switch (netId) {
            case "1":
                console.log('This is mainnet');
                break;
            case "2":
                console.log('This is the deprecated Morden test network.');
                break;
            case "3":
                console.log('This is the ropsten test network.');
                break;
            case "4":
                console.log('This is the Rinkeby test network.');
                break;
            case "42":
                console.log('This is the Kovan test network.');
                break;
            default:
                console.log('This is an unknown network.');
            }
        });
    }

});