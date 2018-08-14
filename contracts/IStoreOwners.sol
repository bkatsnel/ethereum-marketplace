pragma solidity ^0.4.21;

import "./EternalStorage.sol";
import "./SecurityLibrary.sol";
import "./zeppelin/ownership/Ownable.sol";

contract IStoreOwners is Ownable {

    using SecurityLibrary for EternalStorage;
    EternalStorage public eternalStorage; 
    
    enum State { Active, Locked }
    State private state = State.Active;

    // State Modifiers
        
    modifier Active { 
        require(state == State.Active, "The contract is locked - can not perform function");
        _; 
    }
    
    modifier Locked { 
        require(state == State.Locked, "The contract is active - can not perform function");
        _; 
    }

    // Administrators' Modifiers
    
    modifier OnlyAdministrator { 
        require(eternalStorage.isAdministrator(msg.sender), "Only administrator can perform this function"); 
        _; 
    }

    // Events

    event LogAddStoreOwner(uint indexed id, address indexed owner, bytes32 indexed name);   
    event LogLockContractAction(address indexed admin, address indexed contractAddress, State state);
    event LogUnLockContractAction(address indexed admin, address indexed contractAddress, State state);

    // Contract Constructor

    constructor(address _eternalStorage) public {
        eternalStorage = EternalStorage(_eternalStorage);
    }
    
    // Lock Functions
    
    function lock() public Active OnlyAdministrator {
        state = State.Locked;
        emit LogLockContractAction(msg.sender, this, state);
    }
    
    function unlock() public Locked OnlyAdministrator {
        state = State.Active;
        emit LogUnLockContractAction(msg.sender, this, state);
    }

    function destroy(address _newStoreOwners) public OnlyAdministrator {
        selfdestruct(_newStoreOwners);
    }

    // Gettters

    function getEternalStorageAddress() public view returns (address) {
        return eternalStorage;
    }

    // Virtual Functions

    function addStoreOwner(address owner, bytes32 name) public;

    // Virtual Getters

    function isStoreOwner() public view returns (bool);
    function getStoreOwner(address owner) public view returns (uint, bytes32, uint, uint, uint);

}