
pragma solidity ^0.4.21;

import "../installed_contracts/zeppelin/contracts/lifecycle/Destructible.sol";
import "../installed_contracts/zeppelin/contracts/lifecycle/Pausable.sol";

contract ICustomers is Destructible, Pausable {

    uint internal orderNo;

    // Events

    event LogAddCustomer(address indexed customer, bytes32 indexed name, bytes32 indexed homeAddress);
    event LogCustomerOrder(bytes32 indexed name, address indexed customer, address indexed owner, uint id, uint quantity,
          uint price, uint payment, uint timestamp, uint order);
    event LogCustomerWithdrawal(address indexed customer, uint amount, uint timestamp);
    event LogOwnerWithdrawal(address indexed owner, bytes32 indexed name, uint amount, uint timestamp);

    // Storage functions

    function getEternalStorageAddress() public view returns (address);
    function setEternalStorageAddress(address eternalStorage) public;

    // Stores Functions

    function setStoresContractAddress(address _Stores) public;
    function getStoresContractAddress() public view returns(address);

    // Customer Virtual Funcyions

    function signUp(bytes32 name, bytes32 homeAddress) public;
    function placeOrder(bytes32 name, uint id, uint quantity, uint price) public payable;
    function withdrawCustomerBalance() public payable;

    // Store Owner Virtual Function

    function withdrawStoreFunds(bytes32 name) public payable;
    
    // Customer Virtual Geetters

    function getCustomerInfo() public view returns (bytes32, bytes32, uint, uint, uint);
    function isCustomer() public view returns (bool);

    // Contract Getter

    function getBalance() public view returns (uint);

}