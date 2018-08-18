pragma solidity ^0.4.21;

import "./EternalStorage.sol";
import "./SecurityLibrary.sol";
import "./IMarket.sol";
import "./IStoreOwners.sol";

contract Market is IMarket {

    using SecurityLibrary for address;

    // Administrators' Modifiers
    
    modifier OnlyAdministrator { 
        require(eternalStorage.isAdministrator(msg.sender), "Only administrator can perform this function"); 
        _; 
    }
    
    modifier NotAdministrator(address admin) { 
        require(!eternalStorage.isAdministrator(admin), "This function can not be performed on an administrator user"); 
        _; 
    }

    // Events Are Inherited

    // Contract Constructor

    constructor(address _eternalStorage) public {
        eternalStorage = _eternalStorage;
    }

    function transferStorageOwnership(address market) public whenNotPaused OnlyAdministrator {
        EternalStorage(eternalStorage).transferOwnership(market);
    }

    function addStorageOwner(address owner) public whenNotPaused OnlyAdministrator {
        EternalStorage(eternalStorage).addOwner(owner);
    }

    // Login and Sign Up Functions

    function login() public view whenNotPaused returns (bytes32) { 
        // Return Account Type
        if (isAdministrator()) return "admin"; 
        else if (isStoreOwner()) return "owner";
        else return "customer";
    }

    // Store Owner Contract Info

    function setStoreOwnersContractAddress(address _storeOwners) public OnlyAdministrator {
        storeOwners = _storeOwners;
    }

    function getStoreOwnersContractAddress() public view returns(address) {
        return storeOwners;
    }

    // Administrator Functions

    function addFirstAdministrator(address admin) public whenNotPaused onlyOwner {
        eternalStorage.addAdministrator(admin);
    }

    function addAdministrator(address admin) public whenNotPaused OnlyAdministrator {
        eternalStorage.addAdministrator(admin);
    }

    function isAdministrator() public view whenNotPaused returns (bool) {
        return eternalStorage.isAdministrator(msg.sender);
    }
    
    function getAdministrator(address admin) public view whenNotPaused OnlyAdministrator returns (uint) {
        return eternalStorage.getAdministrator(admin);
    }

    // Store Owner Functions

    function isStoreOwner() public view whenNotPaused returns (bool) {
        return IStoreOwners(storeOwners).isStoreOwner(msg.sender);
    }

    // Getters

    function getBlockCreated() public view whenNotPaused returns (uint) {
        return EternalStorage(eternalStorage).getBlockCreated();
    }

    function getEternalStorageAddress() public view whenNotPaused OnlyAdministrator returns (address) {
        return eternalStorage;
    }

}