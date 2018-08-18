pragma solidity ^0.4.21;

import "./EternalStorage.sol";
import "./IStores.sol";
import "./IStoreOwners.sol";
import "./IMarketManager.sol";

contract Stores is IStores {

    EternalStorage private eStorage;
    IStoreOwners private owners;

    // Modifiers

    modifier OnlyStoreOwner() {
        require(owners.isStoreOwner(msg.sender), "Only store owners can perform this function.");
        _;
    }

    modifier OnlyNewName(bytes32 name) {
        require(!existStore(name), "Store name is already used.");
        _;
    }

    modifier StoreExist(bytes32 name) {
        require(existStore(name), "Store name must exist.");
        _;
    }

    modifier OnlyCustomersContract() {
        require(IMarketManager(owner).getDeployedCustomersContract() == msg.sender, "Only customers contract.");
        _;
    }
    
    // Class Constructor 

    constructor(address  manager)  public payable {
        transferOwnership(manager);
    }

    function getEternalStorageAddress() public view returns (address) {
        return eStorage;
    }

    function setEternalStorageAddress(address eternalStorage) public onlyOwner {
        eStorage = EternalStorage(eternalStorage);
    }

    // Store Owner Functions

    function setStoreOwnersContractAddress(address _storeOwners) public onlyOwner {
        owners = IStoreOwners(_storeOwners);
    }

    function getStoreOwnersContractAddress() public view returns(address) {
        return owners;
    }

    // Store Functions

    function addStore(bytes32 name, bytes32 descHash) public whenNotPaused OnlyStoreOwner OnlyNewName(name) {

        eStorage.setBooleanValue(keccak256("store_name:", name), true);
        eStorage.setAddressValue(keccak256("store_owner:", name), msg.sender);
        eStorage.setBytes32Value(keccak256("store_desc_hash:", name), descHash);

        // eStorage.setUIntValue(keccak256("store_funds:", name), 0);
        // eStorage.setUIntValue(keccak256("store_orders:", name), 0);
        // eStorage.setUIntValue(keccak256("store_withdrawals:", name), 0);
      
        // Log Add Store Event
        emit LogAddStore(name, msg.sender, descHash);

        // Update Store Owner Info
        address owner = getStoreOwner(name);
        owners.addStoreOwnerStore(owner);
        
    }
    
    function addStoreProduct(bytes32 name, uint id, uint quantity, uint price, bytes32 description) public 
       whenNotPaused StoreExist(name) OnlyStoreOwner {

        eStorage.setUIntValue(keccak256("store_product_id:", name, id), id);
        eStorage.setUIntValue(keccak256("store_product_quantity:", name, id), quantity);
        eStorage.setUIntValue(keccak256("store_product_price:", name, id), price);
        eStorage.setBytes32Value(keccak256("store_product_description:", name, id), description);

        // Log Add Store Prodict Event
        emit LogAddStoreProduct(name, id, quantity, price, description);
        
    }

    function addStoreOrder(bytes32 name, uint id, uint quantity, uint cost) public 
       whenNotPaused StoreExist(name) OnlyCustomersContract {

        // Update Store Product Quantity 
        uint store_quantity = eStorage.getUIntValue(keccak256("store_product_quantity:", name, id));
        eStorage.setUIntValue(keccak256("store_product_quantity:", name, id), store_quantity - quantity);

        // Update Store Information

        uint store_funds = eStorage.getUIntValue(keccak256("store_funds:", name));
        eStorage.setUIntValue(keccak256("store_funds:", name), store_funds + cost);

        uint store_orders = eStorage.getUIntValue(keccak256("store_orders:", name));
        eStorage.setUIntValue(keccak256("store_orders:", name), ++store_orders);

        // Add Order Info to Store Owner 
        address storeOwner = getStoreOwner(name);
        owners.addStoreOwnerOrder(storeOwner, cost);

        // EMit Event
        emit LogAddStoreOrder(name, id, quantity, cost);

    }

    function withdrawStoreFunds(bytes32 name, uint funds) public 
      whenNotPaused StoreExist(name) OnlyCustomersContract {

        uint store_funds = eStorage.getUIntValue(keccak256("store_funds:", name));
        eStorage.setUIntValue(keccak256("store_funds:", name), store_funds - funds);

        uint store_withdrawals = eStorage.getUIntValue(keccak256("store_withdrawals:", name));
        eStorage.setUIntValue(keccak256("store_withdrawals:", name), ++store_withdrawals);

        emit LogWithdrawStoreFunds(name, funds);

        address owner_address = eStorage.getAddressValue(keccak256("store_owner:", name));
        owners.withdrawStoreOwnerFunds(owner_address, funds);

    }

    //  Getters

    function getStore(bytes32 name) public view StoreExist(name)
        returns (bytes32 _name, address _owner, uint _funds, bytes32 _descHash, uint _orders) {

        _owner = eStorage.getAddressValue(keccak256("store_owner:", name));
        _funds = eStorage.getUIntValue(keccak256("store_funds:", name));
        _orders = eStorage.getUIntValue(keccak256("store_orders:", name));
        _descHash = eStorage.getBytes32Value(keccak256("store_desc_hash:", name));

        return (name, _owner, _funds, _descHash, _orders);

    }

    function getStoreOwner(bytes32 name) public view StoreExist(name) returns(address) {
        return eStorage.getAddressValue(keccak256("store_owner:", name));
    }

    function existStore(bytes32 name) public view returns (bool) {
        return eStorage.getBooleanValue(keccak256("store_name:", name));
    }

    function existStoreProduct(bytes32 name, uint id) public view returns (bool) {
        return id == eStorage.getUIntValue(keccak256("store_product_id:", name, id));
    }

    function getStoreProduct(bytes32 name, uint id) public view StoreExist(name) returns (uint, uint, uint, bytes32) {

        uint quantity = eStorage.getUIntValue(keccak256("store_product_quantity:", name, id));
        uint price = eStorage.getUIntValue(keccak256("store_product_price:", name, id));
        bytes32 description = eStorage.getBytes32Value(keccak256("store_product_description:", name, id));

        return (id, quantity, price, description);

    }
    
}
