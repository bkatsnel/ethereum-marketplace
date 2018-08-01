pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/OnlineMarketplace.sol";

contract TestOnlineMarketplace {

    OnlineMarketplace marketplace;

    // Constants Used for Multiple Tests
    bytes32 storeOwnerName = "Walter";

    // Before And After Test Functions to Initialize and Cleanup 
    function beforeEach() public {
        marketplace = new OnlineMarketplace();
    }

    function afterEach() public {
        marketplace.destroy();
    }

    //
    //  Test Functions
    //

    function testInitState() public {

        Assert.equal(marketplace.getOwnerNo(), 0, "Initial store owner number should be 0.");

    }

    function testGetBlockCreated() public {

        Assert.notEqual(marketplace.getBlockCreated(), 0, "Initial store owner number should Not be 0.");

    }

    function testAdminLogin() public {
        bytes32 account_type = marketplace.login();
        Assert.equal(account_type, "admin", "Administrator's account type should be admin.");
    }

    function testIsStoreOwner() public {
        Assert.equal(marketplace.isStoreOwner(), false, "Administrator should not be storeowner.");
    }

    function testAddStoreOwner() public {
        
        address storeOwner = new Ownable();
        marketplace.addStoreOwner(storeOwner,storeOwnerName);
        Assert.equal(marketplace.getOwnerNo(), 1, "Number of Owners should one after first add stroe owner call.");

    }

    function testGetStoreOwner() public {

        uint id;
        bytes32 name;
        uint balance;
        uint stores;
        uint orders;
        //Get Additional Address
        address storeOwner = new Ownable();

        marketplace.addStoreOwner(storeOwner, storeOwnerName);
        (id, name, balance, stores, orders) = marketplace.getStoreOwner(storeOwner);

        Assert.equal(id, 1, "Test store owner id after Add Store Owner call.");
        Assert.equal(name, storeOwnerName, "Test store owner name after Add Store Owner call.");
        Assert.equal(balance, 0, "Test store owner balance after Add Store Owner call.");
        Assert.equal(stores, 0, "Test store owner store number after Add Store Owner call.");
        Assert.equal(orders, 0, "Test store owner order number after Add Store Owner call.");

    }

    // function testAddStore() public {

    //     string memory storeName = "Pet Store";
    //     // Variables for getStore Call
    //     string memory name; 
    //     address owner;
    //     uint funds; 
    //     uint products;

    //     marketplace.addStoreOwner(marketplace);
    //     marketplace.addStore(storeName);
    //     // Get Store Info And Check
    //     (name,  owner,  funds,  products) = marketplace.getStore(storeName);
    //     Assert.equal(name, storeName, "Verify added store has correct name.");
     
    // }

}
