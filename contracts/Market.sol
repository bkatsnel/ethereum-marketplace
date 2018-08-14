pragma solidity ^0.4.21;

import "./EternalStorage.sol";
import "./SecurityLibrary.sol";
import "./zeppelin/ownership/Ownable.sol";

contract Market is Ownable {

    using SecurityLibrary for address;
    address public eternalStorage;

    enum State { Active, Locked }
    State private state = State.Active;

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

    event LogAddAdministrator(address indexed admin, uint256 index);
    event LogRemoveAdministrator(address indexed admin, uint256 index);
    event LogLockContractAction(address indexed admin, address indexed contractAddress, State state);
    event LogUnLockContractAction(address indexed admin, address indexed contractAddress, State state);

    constructor(address _eternalStorage) public {
        eternalStorage = _eternalStorage;
    }

    function transferStorageOwnership(address market) public OnlyAdministrator {
        EternalStorage(eternalStorage).transferOwnership(market);
    }

    function addStorageOwner(address owner) public OnlyAdministrator {
        EternalStorage(eternalStorage).addOwner(owner);
    }

    // Login and Sign Up Functions

    function login() public view Active returns (bytes32) { 
        // Return Account Type
        if (isAdministrator()) return "admin"; 
        else if (isStoreOwner()) return "owner";
        else return "customer";
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

    function destroy(address _newMarket) public OnlyAdministrator {
        selfdestruct(_newMarket);
    }

    // Administrator Functions

    function addAdministrator(address admin) public {
        eternalStorage.addAdministrator(admin);
    }

    function isAdministrator() public view Active returns (bool) {
        return eternalStorage.isAdministrator(msg.sender);
    }
    
    function getAdministrator(address admin) public view Active returns (uint) {
        return eternalStorage.getAdministrator(admin);
    }

    // Store Owner Functions

    function isStoreOwner() public view Active returns (bool) {
        return false;
    }

    // Getters

    function getBlockCreated() public view Active returns (uint) {
        return EternalStorage(eternalStorage).getBlockCreated();
    }

    function getState() public view OnlyAdministrator returns (State) {
        return state;
    }

    function getEternalStorageAddress() public view Active OnlyAdministrator returns (address) {
        return eternalStorage;
    }

}