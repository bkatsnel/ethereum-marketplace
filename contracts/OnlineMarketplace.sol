pragma solidity ^0.4.11;

import "./Administerable.sol";
import "./zeppelin/math/SafeMath.sol";

contract OnlineMarketplace is Administerable {
    
    uint ownerNo;
    uint orderNo;

    // Define Contract's Structs
    
    struct Product {
        uint id;
        uint quantity;
        uint price;
        bytes32 description;
    }
    
    struct Store {
        bytes32 name;
        address owner;
        uint funds;
        uint productNo;
        bytes32 descHash;
        uint orders;
        mapping (uint => Product) products;
    }
    
    struct StoreOwner {
        uint id;
        bytes32 name;
        uint balance;
        uint withdrawals;
        bytes32[] storeNames;
        address account;
        uint orders;
    }

    struct Customer {
        address customer;
        bytes32 name;
        bytes32 homeAddress;
        uint balance;
        uint orders;
        uint withdrawals;
    }

    // Define Contract's Mappings
    
    mapping(address => StoreOwner) storeOwners;
    mapping(bytes32 => Store) stores;
    mapping (address => Customer) customers;

    // Store Owner Modifiers
    
    modifier OnlyOwner {require(storeOwners[msg.sender].id != 0, "Only owner."); _;}
    modifier NotOwner(address owner) {require(storeOwners[owner].id == 0, "Only not yet owner."); _;}

    modifier OnlyStoreOwner(bytes32 name) {require(stores[name].owner == msg.sender, "Only store owner."); _;}
    modifier OnlyNewName(bytes32 name) {require(stores[name].owner == address(0),  "Only unused store name."); _;}
    modifier ValidStoreName(bytes32 name) {require(stores[name].owner != address(0), "Invalid store name."); _;}
    modifier NewProduct(bytes32 name, uint id) {require(stores[name].products[id].id == 0, "Only new product."); _;}

    modifier OnlyCustomer() {require(customers[msg.sender].customer != address(0), "Only new customer."); _;}
    modifier NewCustomer() {require(customers[msg.sender].customer == address(0), "Customer only function."); _;}
    
    // Events
    
    event LogAddStoreOwner(uint indexed id, address indexed owner, bytes32 indexed name);
    event LogAddStore(bytes32 indexed name, address indexed owner, bytes32 descHash);
    event LogAddStoreProduct(bytes32 indexed name, uint id, uint quantity, uint price, bytes32 indexed description);
    event LogAddCustomer(address indexed customer, bytes32 indexed name, bytes32 indexed homeAddress);
    event LogCustomerOrder(bytes32 indexed name, address indexed customer, address indexed owner, uint id, uint quantity,
          uint price, uint payment, uint timestamp, uint order);
    event LogOwnerWithdrawal(address indexed owner, bytes32 indexed name, uint amount, uint timestamp);
    event LogCustomerWithdrawal(address indexed customer, uint amount, uint timestamp);

    // Login Function

    function login() public view Active returns (bytes32) {
        // Return Account Type
        if (isAdministrator()) return "admin"; 
        else if (isStoreOwner()) return "owner";
        else return "customer";
    }

    function signUp(bytes32 name, bytes32 homeAddress) public Active NewCustomer {
        customers[msg.sender].customer = msg.sender; 
        customers[msg.sender].name = name; 
        customers[msg.sender].homeAddress = homeAddress; 
        customers[msg.sender].balance = 0; 
        // Log Event
        emit LogAddCustomer(msg.sender, name, homeAddress);
    }
    
    // Store Owner Admin Functions
    
    function getOwnerNo() public view Active OnlyAdministrator returns (uint) {
        return ownerNo;
    }
    
    function addStoreOwner(address owner, bytes32 name) public Active OnlyAdministrator NotOwner(owner) NotAdministrator(owner) {
        // Save Store OWner Info
        storeOwners[owner].id = ++ownerNo;
        storeOwners[owner].name = name;
        storeOwners[owner].balance = 0;
        storeOwners[owner].account = owner;
        // Log Add Store Owner Event
        emit LogAddStoreOwner(ownerNo, owner, name);
    }
    
    function isStoreOwner() public view Active returns (bool) {
        return storeOwners[msg.sender].id != 0;
    }
    
    function getOwnerInfo() public view Active OnlyOwner returns (uint, bytes32, uint, uint, uint, uint) {
        StoreOwner storage _owner = storeOwners[msg.sender];
        return  (_owner.id, _owner.name, _owner.balance, _owner.withdrawals, _owner.storeNames.length, _owner.orders);
    }
    
    function getStoreOwner(address owner) public view Active OnlyAdministrator returns (uint, bytes32, uint, uint, uint) {
        StoreOwner storage _owner = storeOwners[owner];
        return  (_owner.id, _owner.name, _owner.balance, _owner.storeNames.length, _owner.orders);
    }
    
    function getOwnerStoreName(address owner, uint index) public view Active OnlyOwner returns (bytes32) {
        bytes32[] storage names = storeOwners[owner].storeNames;
        require(index >= 0 && index < names.length, "Invalid store names array index value");
        return  (names[index]);
    }
    
    // Store Owner Store Functions
    
    function addStore(bytes32 name, bytes32 descHash) public Active OnlyOwner OnlyNewName(name) {   
        // Save Store Info
        stores[name].name = name;
        stores[name].owner = msg.sender;
        stores[name].funds = 0;
        stores[name].productNo = 0;
        stores[name].descHash = descHash;
        // Keep Track of stores
        storeOwners[msg.sender].storeNames.push(name);
        // Log Add Store Event
        emit LogAddStore(name, msg.sender, descHash);
    }
    
    function getStore(bytes32 name) public view Active OnlyOwner ValidStoreName(name) 
    returns (bytes32 _name, address _owner, uint _funds, uint _products, bytes32 descHash, uint orders) {
        Store storage store = stores[name];
        return (store.name, store.owner, store.funds, store.productNo, store.descHash, store.orders);
    }
    
    function addStoreProduct(bytes32 name, uint id, uint quantity, uint price, bytes32 description) public
    Active OnlyOwner ValidStoreName(name) NewProduct(name, id) {
        Store storage store = stores[name];
        Product storage product = store.products[id];
        // Update Product Info
        product.id = id;
        product.quantity = quantity;
        product.price = price;
        product.description = description;
        // Update Store Info
        store.productNo++;
        // Log Add Store Prodict Event
        emit LogAddStoreProduct(name, id, quantity, price, description);
    }
    
    function getStoreProduct(bytes32 name, uint id) public view
    Active OnlyOwner ValidStoreName(name) returns (uint, uint, uint, bytes32) {
        require(id > 0 && id <= stores[name].productNo, "Invalid store product id.");
        Product storage product = stores[name].products[id];
        return (product.id, product.quantity, product.price, product.description);
    }

    function getCustomerInfo() public view Active OnlyCustomer returns (bytes32, bytes32, uint, uint, uint) {
        Customer memory customer = customers[msg.sender];
        return (customer.name, customer.homeAddress, customer.balance, customer.orders, customer.withdrawals);
    }

    function placeOrder(bytes32 name, uint id, uint quantity, uint price) public payable Active OnlyCustomer ValidStoreName(name) {
        // Create Pointer for Required Info
        Store storage store = stores[name];
        Product storage product = store.products[id];
        Customer storage customer = customers[msg.sender];
        StoreOwner storage owner = storeOwners[store.owner];
        // Calculate cost
        uint cost = SafeMath.mul(quantity, price);
        // Check available quantity
        require(product.quantity >= quantity, "Insufficient product quantity available.");
        require(msg.value >= cost, "Insufficient funds provided.");
        // Update State Variables
        product.quantity = product.quantity - quantity;
        // Update Store Info
        store.funds += cost;
        store.orders++;
        // Update Owner Info
        owner.balance += cost;
        owner.orders++;
        // Update Customer Info
        customer.orders++;
        // Update Order No
        orderNo++;
        // Chck if more money was send and update balance if required
        if (msg.value > cost) { 
            customer.balance += msg.value - cost;
        }
        // Log Purchase
        emit LogCustomerOrder(name, msg.sender, owner.account, id, quantity, price, msg.value, now, orderNo);
    } 

    function withdrawStoreFunds(bytes32 name) public payable Active ValidStoreName(name) OnlyStoreOwner(name) {
        Store storage store = stores[name];
        StoreOwner storage owner = storeOwners[msg.sender];
        // Save Avaialable Funds Before Transfer
        uint availableFunds = store.funds;
        // Transfer Funds If Avaialble
        if (availableFunds > 0) {
            // Update balances before transfer
            store.funds = 0;
            owner.balance -= availableFunds;
            owner.withdrawals++;
            // Transfer Funds to store owner
            msg.sender.transfer(availableFunds);
            // Log Owner Withdrawal Transaction
            emit LogOwnerWithdrawal(msg.sender, name, availableFunds, now);
        }
    }

    function withdrawCustomerBalance() public payable Active OnlyCustomer {
        Customer storage customer = customers[msg.sender];
        uint availableBalance = customer.balance;

        if (availableBalance > 0) {
            // Update balances before transfer
            customer.balance = 0;
            customer.withdrawals++;
            // Transfer Funds to the customer
            msg.sender.transfer(availableBalance);
            emit LogCustomerWithdrawal(msg.sender, availableBalance, now);
        }
    }
}