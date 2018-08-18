pragma solidity ^0.4.21;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MarketManager.sol";
import "../contracts/IMarketManager.sol";
import "../contracts/IMarket.sol";
import "../contracts/StoreOwners.sol";
// import "../contracts/Stores.sol";
// import "../contracts/Customers.sol";
import "../contracts/EternalStorage.sol";

contract TestMarketManager {

    MarketManager manager;
    IMarket market;
    Market new_market;
    EternalStorage eternalStorage;
    // StoreOwners owners;
    // Stores stores;
    // Customers customers;

    // function beforeEach() public {
    //     manager = new MarketManager();
    // }

    // function afterEach() public {
    //     manager.selfdestruct();
    // }

    function testInitState() public {

        manager = new MarketManager();

        address mgr_owner = manager.owner();
        Assert.equal(mgr_owner, this, "Manage owner should be this");

    }

    function testInitialMarketDeploy() public {


        manager.deployMarketContract();
        market = IMarket(manager.getDeployedMarketContract());

        bool paused = market.paused();

        Assert.equal(paused, false, "Initial contract paused should be false.");

    }

    function testGetMarketStorageAddress() public {

        address manager_storage_address = manager.getDeployedStorageContract();
        address market_storage_address = market.getEternalStorageAddress();

        Assert.equal(manager_storage_address, market_storage_address, "Market storage address should be set correctly.");

    }

    function testStorageOwnerSettings() public {

        eternalStorage = EternalStorage(manager.getDeployedStorageContract());
        address storage_owner = eternalStorage.owner();
        Assert.equal(storage_owner, market, "Storage owner should be market contract.");

    }

    // function testStoreOwnersDeployment() public {

    //     owners = new StoreOwners(manager);
    //     manager.deployStoreOwnersContract(owners);
    //     address owners_address = manager.getDeployedStoreOwnersContract();
    //     Assert.equal(owners_address, owners, "Store owners contract should be deployed.");

    // }

    // function testStoresDeployment() public {

    //     stores = new Stores(manager);
    //     manager.deployStoresContract(stores);
    //     address stores_address = manager.getDeployedStoresContract();
    //     Assert.equal(stores_address, stores, "Stores contract should be deployed.");

    // }

    // function testCustomersDeployment() public {

    //     customers = new Customers(manager);
    //     manager.deployCustomersContract(customers);
    //     address customers_address = manager.getDeployedCustomersContract();
    //     Assert.equal(customers_address, customers, "Customers contract should be deployed.");

    // }

    // function testUpgradeMarketContract() public {

    //     new_market = new Market(eternalStorage);
    //     manager.upgradeMarketContact(new_market);

    //     Assert.equal(new_market, manager.getDeployedMarketContract(), "Uprgaded contract should be set correctly.");
    // }

}