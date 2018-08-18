pragma solidity ^0.4.21;

import "./EternalStorage.sol";
import "./SecurityLibrary.sol";
import "./IStoreOwners.sol";
import "./IMarketManager.sol";

contract StoreOwners is IStoreOwners {
    
    using SecurityLibrary for EternalStorage;
    EternalStorage private eStorage;

     // Administrators' Modifiers
    
    modifier OnlyAdministrator { 
        require(eStorage.isAdministrator(msg.sender), "Only administrator can perform this function"); 
        _; 
    }

    modifier OnlyStoresContract() {
        require(IMarketManager(owner).getDeployedStoresContract() == msg.sender, "Only customers contract.");
        _;
    }
    
    // Contract Constructor

    constructor(address manager) IStoreOwners(manager) public {
        transferOwnership(manager);
    }

    // Storage Funtions

    function getEternalStorageAddress() public view returns (address) {
        return eStorage;
    }

    function setEternalStorageAddress(address eternalStorage) public onlyOwner {
        eStorage = EternalStorage(eternalStorage);
    }

    // Virtual Functions Implementation

    function addStoreOwner(address owner, bytes32 name) public whenNotPaused OnlyAdministrator {

        // Check if User is already admin
        bool userIsOwner = eStorage.getBooleanValue(keccak256("storeowner:", owner));
        require(!userIsOwner,"User is already store owner.");
        // Record address as admnistrator
        eStorage.setBooleanValue(keccak256("storeowner:", owner), true);
        // Increment the admins count in storage
        uint256 ownerCount = eStorage.getUIntValue(keccak256("StoreOwnerCount"));
        eStorage.setUIntValue(keccak256("StoreOwnerCount"), ++ownerCount);
        // Assign StoreOwner Index
        uint256 ownerIndex = eStorage.getUIntValue(keccak256("StoreOwnerIndex"));
        // Save StoreOwner Index Info
        eStorage.setUIntValue(keccak256("StoreOwnerIndex"), ++ownerIndex);
        // Store Owner Info
        eStorage.setUIntValue(keccak256("StoreOwnerId", owner), ownerIndex);
        eStorage.setBytes32Value(keccak256("StoreOwnerName", ownerIndex), name);

        // eStorage.setUIntValue(keccak256("StoreOwnerBalance", ownerIndex), 0);
        // eStorage.setUIntValue(keccak256("StoreOwnerWithdrawals", ownerIndex), 0);
        // eStorage.setAddressValue(keccak256("StoreOwnerAccount", ownerIndex), owner);
        // eStorage.setAddressValue(keccak256("StoreOwnerOrders", ownerIndex), 0);

        // Emit Event
        emit LogAddStoreOwner(ownerIndex, owner, name);

    }

    function addStoreOwnerStore(address owner) public whenNotPaused OnlyStoresContract {

        uint id = eStorage.getUIntValue(keccak256("StoreOwnerId", owner));
        uint stores = eStorage.getUIntValue(keccak256("StoreOwnerStores", id));
        eStorage.setUIntValue(keccak256("StoreOwnerStores", id), ++stores);

    }

    function addStoreOwnerOrder(address owner, uint payment) public whenNotPaused OnlyStoresContract {

        uint id = eStorage.getUIntValue(keccak256("StoreOwnerId", owner));
        uint balance = eStorage.getUIntValue(keccak256("StoreOwnerBalance", id));
        uint orders = eStorage.getUIntValue(keccak256("StoreOwnerOrders", id));

        // Update Store Owners Info

        eStorage.setUIntValue(keccak256("StoreOwnerBalance", id), balance + payment);
        eStorage.setUIntValue(keccak256("StoreOwnerOrders", id), ++orders);

        // Emit Event 

        emit LogAddStoreOwnerOrder(owner, payment);   

    }

    function withdrawStoreOwnerFunds(address owner, uint amount) public whenNotPaused OnlyStoresContract {

        uint id = eStorage.getUIntValue(keccak256("StoreOwnerId", owner));
        uint balance = eStorage.getUIntValue(keccak256("StoreOwnerBalance", id));
        uint withdrawals = eStorage.getUIntValue(keccak256("StoreOwnerWithdrawals", id));

        // Update Store Owners Info
        require(balance >= amount, "Can not withdraw more than balance.");
        eStorage.setUIntValue(keccak256("StoreOwnerBalance", id), balance - amount);
        eStorage.setUIntValue(keccak256("StoreOwcnerWithdrawals", id), ++withdrawals);

        // Emit Event 

        emit LogWithdrawStoreOwnerFunds(owner, amount);   

    }
    // Getters

    function isStoreOwner() public view whenNotPaused returns (bool) {
        return eStorage.getBooleanValue(keccak256("storeowner:", msg.sender));
    }

    function isStoreOwner(address owner) public view whenNotPaused returns (bool) {
        return eStorage.getBooleanValue(keccak256("storeowner:", owner));
    }

    function getStoreOwner(address owner) public view whenNotPaused returns (uint, bytes32, uint, uint, uint) {

        uint id = eStorage.getUIntValue(keccak256("StoreOwnerId", owner));
        bytes32 name = eStorage.getBytes32Value(keccak256("StoreOwnerName", id));
        uint balance = eStorage.getUIntValue(keccak256("StoreOwnerBalance", id));
        uint orders = eStorage.getUIntValue(keccak256("StoreOwnerOrders", id));
        uint stores = eStorage.getUIntValue(keccak256("StoreOwnerStores", id));

        // Number of stores is 0 for now
        
        return  (id, name, balance, stores, orders);
    }

}