
pragma solidity ^0.4.21;

import "./EternalStorage.sol";
import "./IStores.sol";
import "./ICustomers.sol";
import "../installed_contracts/zeppelin/contracts/math/SafeMath.sol";

contract Customers is ICustomers {

    EternalStorage internal eStorage;
    IStores internal Stores;

    using SafeMath for uint;

    // Modifiers 

    modifier NotCustomer() {
        require(!eStorage.getBooleanValue(keccak256("customer:", msg.sender)), "Should not be an exisiting customer.");
        _;
    }

    modifier ValidCustomer() {
        require(eStorage.getBooleanValue(keccak256("customer:", msg.sender)), "Should not be an exisiting customer.");
        _;
    }

    modifier ValidStore(bytes32 name) {
        require(Stores.existStore(name), "Store should exist.");
        _;
    }

    modifier OnlyStoreOwner(bytes32 name) {
        require(Stores.getStoreOwner(name) == msg.sender, "Account should be store's owner.");
        _;
    }

    modifier ValidStoreProduct(bytes32 name, uint id) {
        require(Stores.existStoreProduct(name, id), "Store product should exist.");
        _;
    }

    // Events are Inherited


     // Contract Constructor

    constructor(address manager) public {
        transferOwnership(manager);
    }

    // Eternal Storage Functions
    
    function getEternalStorageAddress() public view returns (address) {
        return eStorage;
    }

    function setEternalStorageAddress(address eternalStorage) public whenNotPaused onlyOwner {
        eStorage = EternalStorage(eternalStorage);
    }
     // Stores Functions

    function setStoresContractAddress(address _Stores) public whenNotPaused onlyOwner {
        Stores = IStores(_Stores);
    }

    function getStoresContractAddress() public view returns(address) {
        return Stores;
    }

    // Customer Functions

    function signUp(bytes32 name, bytes32 homeAddress) public whenNotPaused NotCustomer {

        eStorage.setBooleanValue(keccak256("customer:", msg.sender), true);
        eStorage.setBytes32Value(keccak256("customer_name:", msg.sender), name);
        eStorage.setBytes32Value(keccak256("customer_address:", msg.sender), homeAddress);

        // No need to initialize if not used

        // eStorage.setUIntValue(keccak256("customer_balance:", msg.sender), 0);
        // eStorage.setUIntValue(keccak256("customer_orders:", msg.sender), 0);
        // eStorage.setUIntValue(keccak256("customer_withdrawals:", msg.sender), 0);

        emit LogAddCustomer(msg.sender, name, homeAddress);

    }

    function placeOrder(bytes32 name, uint id, uint quantity, uint price) public payable 
       whenNotPaused ValidStore(name) ValidCustomer ValidStoreProduct(name, id) {

        uint _id;
        uint _quantity;
        uint _price;
        bytes32 _description;

        uint cost = quantity.mul(price);

        (_id, _quantity, _price, _description) = Stores.getStoreProduct(name, id);

        require(_quantity >= quantity, "Order quantity should not exceed available quanity.");
        require(_price == price, "Order price should match store price.");
        require(msg.value >= cost, "Insufficient funds provided.");
        
        // Update Store Info
        Stores.addStoreOrder(name, id, quantity, cost);

        // Chck if more money was send and update balance if required

        if (msg.value > cost) { 
            uint customer_balance = eStorage.getUIntValue(keccak256("customer_balance:", msg.sender));
            customer_balance += msg.value - cost;
            eStorage.setUIntValue(keccak256("customer_balance:", msg.sender), customer_balance);
        }

        // Log Purchase
        emit LogCustomerOrder(name, msg.sender, owner, id, quantity, price, msg.value, now, ++orderNo);

    }

    function withdrawCustomerBalance() public payable whenNotPaused ValidCustomer {

        uint balance = eStorage.getUIntValue(keccak256("customer_balance:", msg.sender));
        uint withdrawals = eStorage.getUIntValue(keccak256("customer_withdrawals:", msg.sender));

        if (balance > 0) {
            // Update balances before transfer
            eStorage.setUIntValue(keccak256("customer_balance:", msg.sender), 0);
            eStorage.setUIntValue(keccak256("customer_withdrawals:", msg.sender), ++withdrawals);
            // Emit Event
            emit LogCustomerWithdrawal(msg.sender, balance, now);
            // Transfer Funds to the customer
            msg.sender.transfer(balance);
        }
    }

    function withdrawStoreFunds(bytes32 name) public payable whenNotPaused ValidStore(name) OnlyStoreOwner(name) {

        bytes32 _name;
        address _owner;
        uint _funds;
        bytes32 _descHash;
        uint _orders;

        // Get Store Information

        (_name, _owner, _funds, _descHash, _orders) = Stores.getStore(name);

        // Transfer Funds If Avaialble

        if (_funds > 0) {
            // Update Store Info
            Stores.withdrawStoreFunds(name, _funds);
            // Log Owner Withdrawal Transaction
            emit LogOwnerWithdrawal(msg.sender, name, _funds, now); 
            // Transfer Funds to store owner
            msg.sender.transfer(_funds);
           
        }
    }

    // Getters

    function getCustomerInfo() public view ValidCustomer returns (bytes32, bytes32, uint, uint, uint) {

        bytes32 name = eStorage.getBytes32Value(keccak256("customer_name:", msg.sender));
        bytes32 homeAddress = eStorage.getBytes32Value(keccak256("customer_address:", msg.sender));
        uint balance = eStorage.getUIntValue(keccak256("customer_balance:", msg.sender));
        uint orders = eStorage.getUIntValue(keccak256("customer_orders:", msg.sender));
        uint withdrawals = eStorage.getUIntValue(keccak256("customer_withdrawals:", msg.sender));

        return (name, homeAddress, balance, orders, withdrawals);

    }

    function isCustomer() public view returns (bool) {
        return eStorage.getBooleanValue(keccak256("customer:", msg.sender));
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

}