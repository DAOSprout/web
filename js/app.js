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

function init() {

    if(!web3.isConnected()) {
        // Provide a message that meta-mask not connected
        console.log('Meta-mask not connected.');
    } else {
        web3.eth.defaultAccount = web3.eth.accounts[0];
        var accountInterval = setInterval(function() {
            if (web3.eth.accounts[0] !== web3.eth.defaultAccount) {
                web3.eth.defaultAccount = web3.eth.accounts[0];
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

        var regContractAddress = '0x1b7569f94a4fba9ec9aab7d49ad2ef0beba669aa';
        var RegistryContract = web3.eth.contract([
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_entry",
                        "type": "address"
                    },
                    {
                        "name": "_newName",
                        "type": "bytes32"
                    }
                ],
                "name": "setName",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "feeInWei",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "withdrawFees",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_entry",
                        "type": "address"
                    },
                    {
                        "name": "_info",
                        "type": "bytes32"
                    }
                ],
                "name": "setInfo",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_entry",
                        "type": "address"
                    }
                ],
                "name": "getEntry",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    },
                    {
                        "name": "",
                        "type": "bytes32"
                    },
                    {
                        "name": "",
                        "type": "bytes32"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_newFeeInWei",
                        "type": "uint256"
                    }
                ],
                "name": "updateFee",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_entry",
                        "type": "address"
                    },
                    {
                        "name": "_newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferEntryOwnership",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "entries",
                "outputs": [
                    {
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "name": "name",
                        "type": "bytes32"
                    },
                    {
                        "name": "info",
                        "type": "bytes32"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_entry",
                        "type": "address"
                    },
                    {
                        "name": "_name",
                        "type": "bytes32"
                    },
                    {
                        "name": "_info",
                        "type": "bytes32"
                    }
                ],
                "name": "register",
                "outputs": [],
                "payable": true,
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "name": "_feeInWei",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "entryAddress",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "name",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "name": "info",
                        "type": "bytes32"
                    },
                    {
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "name": "AddedEntry",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "entryAddress",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "newOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "oldOwner",
                        "type": "address"
                    }
                ],
                "name": "UpdatedOwnership",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "entryAddress",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "name",
                        "type": "bytes32"
                    },
                    {
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "name": "UpdatedName",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "entryAddress",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "info",
                        "type": "bytes32"
                    },
                    {
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "name": "UpdatedInfo",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "newFee",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "name": "UpdatedFee",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "name": "CollectedFee",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            }
        ]);
        var Registry = RegistryContract.at(regContractAddress);
        console.log(Registry);

        // Test
        Registry.feeInWei(function(error,fee) {
            if (error) {
                console.log(error);
                return 0;
            } else {
                //var callD = Registry.register.getData();
                var callData = {_entry: '0xe6f74efb07d41f7223e0e4aa19a449857e128bd4', _name: 'temp-name', _info: 'temp-info'};
                var result = web3.eth.call({
                    to: regContractAddress,
                    data: callData,
                    value: fee
                }, function(error,result) {
                    if (error) {
                        console.log(error);
                        return 0;
                    } else {
                        return result;
                    }
                });
                //Registry.register('0xe6f74efb07d41f7223e0e4aa19a449857e128bd4', 'temp-name', 'temp-info', function(error, result) {
                //    if(error)
                //        console.log(error);
                //    else
                //        console.log(result);
                //});
            }
        });



        // services
        app.service('regService', function () {
            console.log('initializing regService...');

            /**
             * Get Entry
             *
             * function getEntry(address _entry) constant public returns (address, bytes32, bytes32);
             *
             */
            var getEntry = function (entryAddress) {
                return Registry.getEntry(entryAddress);
            };

            /**
             * Register
             *
             * function register(address _entry, bytes32 _name, bytes32 _info) mustPayFee public payable;
             *
             */
            var register = function (entryAddress, name, info) {
                // TODO: Add account balance check
                Registry.register(entryAddress, name, info);
            };

            /**
             * Set Name
             *
             * function setName(address _entry, bytes32 _newName) onlyEntryOwner(_entry) public;
             *
             */
            var setName = function (entryAddress, newName) {
                Registry.setName(entryAddress, newName);
            };

            /**
             * Set Info
             *
             * function setInfo(address _entry, bytes32 _info) onlyEntryOwner(_entry) public;
             *
             */
            var setInfo = function (entryAddress, newInfo) {
                Registry.setInfo(entryAddress, newInfo);
            };

            /**
             * Transfer Entry Ownership
             *
             * transferEntryOwnership(address _entry, address _newOwner) onlyEntryOwner(_entry) public;
             *
             */
            var transferEntryOwnership = function (entryAddress, newOwnerAddress) {
                Registry.transferOwnership(entryAddress, newOwnerAddress);
            };

        });

        // filters

        // directives

    }
}

window.addEventListener('load', function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No web3? You should consider trying MetaMask!');
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    }

    // Now you can start your app & access web3 freely:
    init();

});