pragma solidity ^0.4.21;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MarketManager.sol";
import "../contracts/IMarket.sol";
import "../contracts/StoreOwners.sol";
// import "../contracts/EternalStorage.sol";

contract TestMarket {

    MarketManager manager;
    IMarket market;
    address eternalStorage;

    // function beforeEach() public {
    //     administerable = new Administerable(myStorage);
    // }

    // function afterEach() public {
    //     administerable.destroy();
    // }

    function testInitMarketState() public {

        manager = new MarketManager();

        manager.deployMarketContract();
        market = IMarket(manager.getDeployedMarketContract());

        bool paused = market.paused();
        Assert.equal(paused, false, "Initial contract paused should be false.");

    }

    function testMarketPause() public {

        market.pause();
        bool paused = market.paused();
        Assert.equal(paused, true, "Paused contract paused should be true.");
    }

    function testMarketUnPause() public {

        market.unpause();
        bool paused = market.paused();
        Assert.equal(paused, false, "Paused contract paused should be true.");
    }

    function testMarketManagerStorage() public {

        eternalStorage = manager.getDeployedStorageContract();
        Assert.notEqual(eternalStorage, address(0), "Market Manager storage address should be set.");

    }

    function testMarketStorage() public {

        address mStorage = market.getEternalStorageAddress();
        Assert.equal(mStorage, eternalStorage, "Market storage address should be set.");

    }

    function testIsAdminsitrator() public {
        
        bool isAdmin = market.isAdministrator();
        Assert.equal(isAdmin, true, "This msg.sender should be adminstrator.");
    }

    function testGetAdminsitrator() public {

        uint id = market.getAdministrator(manager);
        Assert.equal(id, 1, "First administrator id should be 0.");

    }

    function testAddAdministrator() public {

        market.addAdministrator(eternalStorage);
        uint id = market.getAdministrator(eternalStorage);
        Assert.equal(id, 3, "Third administrator id should be 3.");

    }



    // function testLockContract() public {

    //     administerable.lock();  
    //     uint state = uint(administerable.getState());
    //     uint locked = uint(Administerable.State.Locked);

    //     Assert.equal(state, locked, "Locked contract state should be Locked.");

    // }

    // function testUnlockContract() public {

    //     administerable.lock();          
    //     administerable.unlock();  

    //     uint state = uint(administerable.getState());
    //     uint active = uint(Administerable.State.Active);

    //     Assert.equal(state, active, "Locked contract state should be Active.");

    // }

    // function testInitAdminNo() public {

    //     Assert.equal(administerable.getAdminNo(), 1, "Initial number of administrators should be 1.");

    // }

    // function testGetOwner() public {

    //     Assert.equal(administerable.owner(), this, "Owner addres is msg.sender");

    // }

    // function testGetAdmin() public {

    //     Assert.equal(administerable.getAdministrator(this), 1, "Owner's administrator id should be 1.");

    // }

    // function testFirstAdmin() public {

    //     Assert.equal(administerable.isAdministrator(), true, "Owner is added to administrators.");

    // }
  
    // function testAddAdministrator() public {
    //     Administerable administerable1 = new Administerable();
    //     Administerable administerable2 = new Administerable();

    //     administerable1.addAdministrator(administerable2);
    //     Assert.equal(administerable1.getAdministrator(administerable2), 2, "An address is added to administrators.");

    // }

}
