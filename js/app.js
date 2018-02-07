'use strict';
/**
 * This file is part of DAOSprout.
 * DAOSprout is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License version 3.0 as published by
 * the Free Software Foundation.
 * DAOSprout is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with DAOSprout in its root folder. If not, see <http://www.gnu.org/licenses/>.
 */
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
    //when('/lists',{templateUrl: 'templates/lists.html', controller: 'mainController' }).
    //when('/sprouts',{templateUrl: 'templates/sprouts.html', controller: 'mainController' }).
    otherwise({redirectTo: '/'})
}]);

// controllers
app.controller('mainController', ['$scope', '$http', '$location', '$window', 'regService', function ($scope, $http, $location, win, regService) {
    console.log('initializing mainController...');

    $scope.currentPath = $location.path();
    $scope.reg = {
        name: 'Dgramz',
        address: '0xe6f74efb07d41f7223e0e4aa19a449857e128bd4',
        siteURL: 'https://dgramz.io/',
        whitepaperURL: 'https://dgramz.io/docs/sc-dgramz-wp.pdf',
        sourcecodeURL: 'https://github.com/SynapticCelerity/platform',
        icoURL: 'https://dgramz.io/#crowdsales',
        message: 'Dgramz Android app uses Synaptic Celerity platform which is about 40% completed in support of the Dgramz prototype.'
    };

    $scope.selectClass = function () {
        if($location.path() === '/' || $location.path() === '/home') {
            return "homepage";
        } else {
            return "no-sidebar";
        }
    };
    $scope.isHome = function() {
        return $location.path() === '/';
    };
    $scope.reset = function() {
        $scope.reg = {};
    };
    $scope.register = function(reg) {
        console.log('register dao called...');
        $scope.reg.error = '';
        $scope.reg.tx = '';
        reg.status = 'v';
        $scope.reg = angular.copy(reg);
        regService.register(reg.address, reg.name, reg, function(error, txHash) {
            if(error) {
                // notify UI of Error
                $scope.reg.error = 'Error';
            } else {
                // clear form
                $scope.reg = {};
                $scope.reg.tx = txHash;
            }
        });
    };
    $scope.testWeb3 = function() {
        var message = '';
        if(!web3.isConnected()) {
            // Provide a message that meta-mask not connected
            message = 'Meta-mask not connected.\n';
        } else {
            message = 'Meta-mask is connected.\n';
            message += 'Default Acct: ' + web3.eth.defaultAccount;

            web3.eth.getMining(function (error, result) {
               console.log('Is Mining: ' + result);
            });
            web3.eth.getAccounts(function (err, accounts) {
                web3.eth.getBalance(accounts[0], function (err, balance) {
                    console.log('My Eth balance is ' + web3.fromWei(balance, 'ether'));
                })
            });
            web3.net.getPeerCount(function (error, result) {
                console.log('Number of peers: ' + result);
            });
            web3.eth.getHashrate(function (error, result) {
                console.log('Hashrate: ' + result);
            });
            web3.eth.getGasPrice(function (error, result) {
                console.log('Gas Price: ' + result);
            });
            web3.version.getNetwork(function (err, netId) {
                var m = 'Network: ';
                switch (netId) {
                    case "1":
                        m += 'mainnet';
                        break;
                    case "2":
                        m += 'deprecated Morden test';
                        break;
                    case "3":
                        m += 'defunct Ropsten test';
                        break;
                    case "4":
                        m += 'Rinkeby test';
                        break;
                    case "42":
                        m += 'Kovan test';
                        break;
                    default:
                        m += 'Unknown';
                }
                console.log(m);
            });
        }
        win.alert(message);
    };
    $scope.registry = function(start, size) {
        // TODO: build entries list based on start index inclusive to start + size inclusive, e.g. 10, 3 = 10, 11, 12

    };

    $scope.explorerURL = function(address) {
        var url = web3.version.getNetwork(function (err, netId) {
            switch (netId) {
                case "1":
                    url = "https://etherscan.io/address/"+address;break;
                case "2":
                    console.log('deprecated Morden test network');
                    throw err;
                case "3":
                    url = "https://ropsten.etherscan.io/address/"+address;break;
                case "4":
                    url = "https://rinkeby.etherscan.io/address/"+address;break;
                case "42":
                    url = "https://kovan.etherscan.io/address/"+address;break;
                default:
                    throw err;
            }
        });
        return url;
    };

    console.log('mainController initialized.');
}]);

// services
app.service('regService', function () {
    console.log('initializing regService...');
    // Init web3
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No web3? You should consider trying MetaMask!');
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    }
    web3.eth.defaultAccount = web3.eth.accounts[0];
    var accountInterval = setInterval(function () {
        if (web3.eth.accounts[0] !== web3.eth.defaultAccount) {
            web3.eth.defaultAccount = web3.eth.accounts[0];
            //updateInterface();
        }
    }, 100);

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

    //var cleanAscii = function (str) {
    //    web3.toAscii(str).replace(/\u0000/g, '');
    //};

    var registry = RegistryContract.at(regContractAddress);
    //registry.defaults({
    //    gasLimit: 100000
    //});
    console.log('registry: '+registry);

    /**
     * Get Entry
     *
     * function getEntry(address _entry) constant public returns (address, bytes32, bytes32);
     *
     */
    this.getEntry = function (entryAddress) {
        console.log('calling regService.getEntry(entryAddress)');
        return registry.getEntry(entryAddress);
    };

    /**
     * Register
     *
     * function register(address _entry, bytes32 _name, bytes32 _info) mustPayFee public payable;
     *
     */
    this.register = function (entryAddress, name, info) {
        console.log('calling regService.register(entryAddress, name, info)');
        registry.feeInWei(function(error, fee) {
            if(error) {
                console.log(error);
                throw error;
            } else {
                registry.register(entryAddress, web3.toHex(name), web3.toHex(info), {
                    gas: 150000,
                    value: fee
                }, function (error, txHash) {
                    if (error) {
                        console.log(error);
                        throw error;
                    } else {
                        console.log(txHash);
                        return txHash;
                    }
                });
            }
        });
    };

    /**
     * Set Name
     *
     * function setName(address _entry, bytes32 _newName) onlyEntryOwner(_entry) public;
     *
     */
    this.setName = function (entryAddress, newName) {
        console.log('calling regService.setName(entryAddress, newName)');
        registry.setName(entryAddress, web3.toHex(newName));
    };

    /**
     * Set Info
     *
     * function setInfo(address _entry, bytes32 _info) onlyEntryOwner(_entry) public;
     *
     */
    this.setInfo = function (entryAddress, newInfo) {
        console.log('calling regService.setInfo(entryAddress, newInfo)');
        registry.setInfo(entryAddress, web3.toHex(newInfo));
    };

    /**
     * Transfer Entry Ownership
     *
     * transferEntryOwnership(address _entry, address _newOwner) onlyEntryOwner(_entry) public;
     *
     */
    this.transferEntryOwnership = function (entryAddress, newOwnerAddress) {
        console.log('calling regService.transferEntryOwnership(entryAddress, newOwnerAddress)');
        registry.transferOwnership(entryAddress, newOwnerAddress);
    };

    console.log('regService initialized.');

});

// filters

// directives

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
        web3.eth.getHashrate(function(error, result) {
            console.log('Hashrate: '+result);
        });
        web3.eth.getGasPrice(function(error, result) {
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



        // Test
        //var daoAddress = '0xe6f74efb07d41f7223e0e4aa19a449857e128bd4';
        //var daoName = web3.toHex('Dgramz', 32);
        //var daoInfo = web3.toHex({
        //    sitURL: 'https://dgramz.io/',
        //    whitepaperURL: 'https://dgramz.io/docs/sc-dgramz-wp.pdf',
        //    sourcecodeURL: 'https://github.com/SynapticCelerity/platform',
        //    icoURL: 'https://dgramz.io/#crowdsales',
        //    message: 'Dgramz Android app uses Synaptic Celerity platform which is about 40% completed in support of the Dgramz prototype.'
        //}, 32);

        //var data = {
        //    entry: daoAddress,
        //    name: daoName,
        //    info: daoInfo
        //};
        //var dataHx = web3.toHex(data);
        //var result = web3.eth.call({
        //    to: regContractAddress,
        //    data: dataHx,
        //    value: fee
        //}, function(error,result) {
        //    if (error) {
        //        console.log(error);
        //        return 0;
        //    } else {
        //        return result;
        //    }
        //});

        //registry.register('0xe6f74efb07d41f7223e0e4aa19a449857e128bd4', 'temp-name', 'temp-info', function(error, result) {
        //    if(error)
        //        console.log(error);
        //    else
        //        console.log(result);
        //});

    }
}

//window.addEventListener('load', function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    //if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        //web3 = new Web3(web3.currentProvider);
    //} else {
    //    console.log('No web3? You should consider trying MetaMask!');
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        //web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    //}

    // Now you can start your app & access web3 freely:
    //init();

//});