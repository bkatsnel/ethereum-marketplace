pragma solidity ^0.4.11;

import "./zeppelin/lifecycle/Destructible.sol";
import "./SecurityLibrary.sol";
import "./DataVerifiable.sol";
import "./EternalStorage.sol";

/**
 * @title Administerable
 * @dev Base contract which allows children to keep track of admins and to implement an emergency stop mechanism.
 */

contract Administerable is Destructible, DataVerifiable {
    
    enum State { Active, Locked }
    State private state = State.Active;
    uint private blockCreated = block.number;

    using SecurityLibrary for EternalStorage;
    EternalStorage public eternalStorage; 

    // Mapping And Array Variables
    
    mapping(address => uint) private administrators;
    
    // State Modifier
        
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
    
    modifier NotAdministrator(address admin) { 
        require(!eternalStorage.isAdministrator(admin), "This function can not be performed on an administrator user"); 
        _; 
    }
    
    // Events
    
    event LogAddAdministrator(address indexed admin, uint index);
    event LogLockUnlockAction(address indexed contractAddress, State state);
     
    // Contract Constructor
    
    constructor(EternalStorage _eternalStorage) public {
        eternalStorage = _eternalStorage;
        eternalStorage.transferOwnership(this);
        // eternalStorage.addAdministrator(msg.sender);
    }

    // Getters
    
    // function getState() public view OnlyAdministrator returns (State) {
    function getState() public view OnlyAdministrator returns (State) {
        return state;
    }

    function getAdminNo() public view Active OnlyAdministrator returns (uint) {
        return eternalStorage.getAdminsCount();
    }

    function getBlockCreated() public view Active returns (uint) {
        return blockCreated;
    }
    
    // Lock Functions
    
    function lock() public Active OnlyAdministrator {
        state = State.Locked;
        emit LogLockUnlockAction(msg.sender, state);
    }
    
    function unlock() public Locked OnlyAdministrator {
        state = State.Active;
        emit LogLockUnlockAction(msg.sender, state);
    }
    
    // Administrator Admin Functions
    
    function addAdministrator(address admin) public 
    Active OnlyAdministrator IsValidAddress(admin) NotAdministrator(admin) {
        eternalStorage.addAdministrator(admin);
    }
    
    function isAdministrator() public view Active returns (bool) {
        return eternalStorage.isAdministrator(msg.sender);
    }
    
    function getAdministrator(address admin) public view Active returns (uint) {
        return eternalStorage.getAdministrator(admin);
    }

}

    