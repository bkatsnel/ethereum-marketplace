pragma solidity ^0.4.21;

import "./EternalStorage.sol";
import "./IStoreOwners.sol";

contract StoreOwners is IStoreOwners {

    struct StoreOwner {
        uint id;
        bytes32 name;
        uint balance;
        uint withdrawals;
        bytes32[] storeNames;
        address account;
        uint orders;
    }

    constructor(address _eternalStorage) IStoreOwners(_eternalStorage) public {
    }

    // Virtual Functions Implementation

    function addStoreOwner(address owner, bytes32 name) public Active OnlyAdministrator {

        // Check if User is already admin
        bool userIsOwner = eternalStorage.getBooleanValue(keccak256("storeowner:", owner));
        require(!userIsOwner,"User is already store owner.");
        // Record address as admnistrator
        eternalStorage.setBooleanValue(keccak256("storeowner:", owner), true);
        // Increment the admins count in storage
        uint256 ownerCount = eternalStorage.getUIntValue(keccak256("StoreOwnerCount"));
        eternalStorage.setUIntValue(keccak256("StoreOwnerCount"), ++ownerCount);
        // Assign StoreOwner Index
        uint256 ownerIndex = eternalStorage.getUIntValue(keccak256("StoreOwnerIndex"));
        // Save StoreOwner Index Info
        eternalStorage.setUIntValue(keccak256("StoreOwnerIndex"), ++ownerIndex);
        // Store Owner Info
        eternalStorage.setUIntValue(keccak256("StoreOwnerId", owner), ownerIndex);
        eternalStorage.setBytes32Value(keccak256("StoreOwnerName", ownerIndex), name);
        eternalStorage.setUIntValue(keccak256("StoreOwnerBalance", ownerIndex), 0);
        eternalStorage.setUIntValue(keccak256("StoreOwnerWithdrawals", ownerIndex), 0);
        eternalStorage.setAddressValue(keccak256("StoreOwnerAccount", ownerIndex), owner);
        eternalStorage.setAddressValue(keccak256("StoreOwnerOrders", ownerIndex), 0);
        // Emit Event
        emit LogAddStoreOwner(1, owner, name);

    }

    // Getters

    function isStoreOwner() public view Active returns (bool) {
        return eternalStorage.getBooleanValue(keccak256("storeowner:", msg.sender));
    }

    function getStoreOwner(address owner) public view Active returns (uint, bytes32, uint, uint, uint) {
        uint id = eternalStorage.getUIntValue(keccak256("StoreOwnerId", owner));
        bytes32 name = eternalStorage.getBytes32Value(keccak256("StoreOwnerName", id));
        uint balance = eternalStorage.getUIntValue(keccak256("StoreOwnerBalance", id));
        uint orders = eternalStorage.getUIntValue(keccak256("StoreOwnerOrders", id));

        return  (id, name, balance, 0, orders);
    }

}