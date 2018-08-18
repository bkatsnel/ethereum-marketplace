pragma solidity ^0.4.21;

import "./Market.sol";
import "./EternalStorage.sol";
import "./IStoreOwners.sol";
import "./IStores.sol";
import "./ICustomers.sol";
import "./IMarketManager.sol";

contract MarketManager is IMarketManager {

    // Modifier Definitions

    modifier OnlyFirstDeployment() {
        require(market == address(0), "Only first deploymnet");
        _;
    }

    modifier MarketDeployed() {
        require(market != address(0), "Market contract must be deployed first.");
        _;
    }

    modifier ValidAddress(address contract_addresss) {
        require(contract_addresss != address(0), "Non-zero address is required.");
        _;
    }
 
    // Events Ar Inherited

    //  Function Bodies

    function deployMarketContract() public onlyOwner whenNotPaused {

        if (market == address(0)) {

            eternalStorage = new EternalStorage();
            // Create first market contract
            market = new Market(eternalStorage);
            // Set the market as the storage owner
            EternalStorage(eternalStorage).transferOwnership(market);
            // Make this contract administrator
            Market(market).addFirstAdministrator(this);
            // Transfer ownership to msg.sender
            Market(market).transferOwnership(msg.sender);
             // Set this contract and the calling user as the first/second admin
            Market(market).addAdministrator(msg.sender);
            // Update block Number to First Market Contract Deployment
            blockCreated = block.number;   

            emit MarketContractDeployed(market, eternalStorage, now, block.number);

        }
     
    }

    function deployStoreOwnersContract(address _owners) public onlyOwner whenNotPaused ValidAddress(_owners) {

        if (owners == address(0)) {

            owners = _owners;
            // Initialize onwers EternalStorage Contract Addresss
            IStoreOwners(owners).setEternalStorageAddress(eternalStorage);
            // Add Store Owners Contract to Storage Owners
            Market(market).addStorageOwner(owners);
            Market(market).setStoreOwnersContractAddress(owners);

            emit StoreOwnersContractDeployed(owners, eternalStorage, now, block.number);

        }

    }

    function deployStoresContract(address _stores) public onlyOwner whenNotPaused {

        if (stores == address(0)) {

            // Create first market contract
            stores = _stores;
            // Initialize onwers EternalStorage Contract Addresss
            IStores(stores).setEternalStorageAddress(eternalStorage);
            // Set the market as the storage owner
            IStores(stores).setStoreOwnersContractAddress(owners);
            // Add Store Owners Contract to Storage Owners
            Market(market).addStorageOwner(stores);

            emit StoresContractDeployed(stores, eternalStorage, now, block.number);

        }
    }

    function deployCustomersContract(address _customers) public onlyOwner whenNotPaused {

        if (customers == address(0)) {

            // Create first market contract
            customers = _customers;
            // Initialize onwers EternalStorage Contract Addresss
            ICustomers(customers).setEternalStorageAddress(eternalStorage);
            // Set the customers stores contract addreess
            ICustomers(customers).setStoresContractAddress(stores);
            // Add Store Owners Contract to Storage Owners
            Market(market).addStorageOwner(customers);

            emit CustomersContractDeployed(customers, eternalStorage, now, block.number);

        }
    }

    function upgradeMarketContact(address _market) public onlyOwner whenNotPaused {

        History memory old_contract = History({market: market, owner: Market(market).owner()});
        // Save old contract info
        contract_history.push(old_contract);
        // Set the market as the storage owner
        Market(market).transferStorageOwnership(_market);
        // Assign new market to current market variable
        market = _market;
        // Add Store Owners Address if Deployed
        require(owners != address(0), "StoreOwners contract must deployed befor upgrading");
        Market(market).setStoreOwnersContractAddress(owners);

        emit MarketContractUpgraded(market, old_contract.market, now);

    }

    // Getters

    function getDeployedMarketContract() public view returns(address) {
        return market;
    }

    function getDeployedStorageContract() public view returns(address) {
        return eternalStorage;
    }

    function getDeployedStoreOwnersContract() public view returns(address) {
        return owners;
    }

    function getDeployedStoresContract() public view returns(address) {
        return stores;
    }

    function getDeployedCustomersContract() public view returns(address) {
        return customers;
    }

    function getBlockCreated() public view returns (uint) {
        return blockCreated;
    }


}