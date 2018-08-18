pragma solidity ^0.4.21;

import "../installed_contracts/zeppelin/contracts/lifecycle/Destructible.sol";
import "../installed_contracts/zeppelin/contracts/lifecycle/Pausable.sol";

contract IStoreOwners is Destructible, Pausable {

    // Events

    event LogAddStoreOwner(uint indexed id, address indexed owner, bytes32 indexed name);   
    event LogAddStoreOwnerOrder(address indexed owner, uint indexed payment);   
    event LogWithdrawStoreOwnerFunds(address indexed owner, uint indexed amount);   

    // Contract Constructor

    constructor(address) public {

    }
    
    // Storage functions

    function getEternalStorageAddress() public view returns (address);
    function setEternalStorageAddress(address eternalStorage) public;

    // Virtual Functions

    function addStoreOwner(address owner, bytes32 name)  public;
    function addStoreOwnerOrder(address owner, uint payment) public;
    function addStoreOwnerStore(address owner) public;
    function withdrawStoreOwnerFunds(address owner, uint amount) public;

    // Virtual Getters

    function isStoreOwner() public view returns (bool);
    function isStoreOwner(address owner) public view returns (bool);
    function getStoreOwner(address owner) public view returns (uint, bytes32, uint, uint, uint);

}