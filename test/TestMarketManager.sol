pragma solidity ^0.4.21;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MarketManager.sol";
import "../contracts/Market.sol";
import "../contracts/EternalStorage.sol";

contract TestMarketManager {

    MarketManager manager;
    Market market;
    Market new_market;
    EternalStorage eternalStorage;

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
        market = Market(manager.getDeployedMarketContract());

        uint state = uint(market.getState());
        uint active = uint(Market.State.Active);

        Assert.equal(state, active, "Initial contract state should be active.");

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

    function testUpgradeMarketContract() public {

        new_market = new Market(eternalStorage);
        manager.upgradeMarketContact(new_market);

        Assert.equal(new_market, manager.getDeployedMarketContract(), "Uprgaded contract should be set correctly.");
    }

}