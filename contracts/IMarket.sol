pragma solidity ^0.4.21;

import "../installed_contracts/zeppelin/contracts/lifecycle/Destructible.sol";
import "../installed_contracts/zeppelin/contracts/lifecycle/Pausable.sol";

contract IMarket is Destructible, Pausable {

    address public eternalStorage;
    address internal storeOwners;

    // Events 

    event LogAddAdministrator(address indexed admin, uint256 index);
    event LogRemoveAdministrator(address indexed admin, uint256 index);

    // Eternal Storage related functions

    function transferStorageOwnership(address market) public;
    function addStorageOwner(address owner) public;

    // Login and Sign Up Functions

    function login() public view returns (bytes32);

    // Administrator Functions

    function addFirstAdministrator(address admin) public;
    function addAdministrator(address admin) public;

    // Virtual Administrator Getters

    function isAdministrator() public view returns (bool);
    function getAdministrator(address admin) public view returns (uint);

    // Store Owner Functions

    function setStoreOwnersContractAddress(address _storeOwners) public;
    function getStoreOwnersContractAddress() public view returns(address);

    // Getters

    function getBlockCreated() public view returns (uint);
    function getEternalStorageAddress() public view returns (address); 

}