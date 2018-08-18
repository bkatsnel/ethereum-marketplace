pragma solidity ^0.4.21;

import "../installed_contracts/zeppelin/contracts/lifecycle/Destructible.sol";
import "../installed_contracts/zeppelin/contracts/lifecycle/Pausable.sol";

contract IStores is Destructible, Pausable {

    // Events

    event LogAddStore(bytes32 indexed name, address indexed owner, bytes32 descHash);
    event LogAddStoreProduct(bytes32 indexed name, uint indexed id, uint quantity, uint price, bytes32 indexed description);
    event LogAddStoreOrder(bytes32 indexed name, uint indexed id, uint quantity, uint cost);
    event LogWithdrawStoreFunds(bytes32 indexed name, uint amount);

    // Storage functions

    function getEternalStorageAddress() public view returns (address);
    function setEternalStorageAddress(address eternalStorage) public;

    // Store Owners Related Function

    // Store Owner Functions

    function setStoreOwnersContractAddress(address _storeOwners) public;
    function getStoreOwnersContractAddress() public view returns(address);

    // Virtual Functions

    function addStore(bytes32 name, bytes32 descHash) public;
    function addStoreProduct(bytes32 name, uint id, uint quantity, uint price, bytes32 description) public;
    function addStoreOrder(bytes32 name, uint id, uint quantity, uint cost) public;
    function withdrawStoreFunds(bytes32 name, uint funds) public;

    // Virtual Getters

    function getStore(bytes32 name) public view 
        returns (bytes32 _name, address _owner, uint _funds, bytes32 _descHash, uint _orders);
    function getStoreOwner(bytes32 name) public view returns(address);
    function existStore(bytes32 name) public view returns (bool);

    function getStoreProduct(bytes32 name, uint id) public view returns (uint, uint, uint, bytes32);
    function existStoreProduct(bytes32 name, uint id) public view returns (bool);
    
}