pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Administerable.sol";

contract TestAdministerable {

    Administerable administerable;

    function beforeEach() public {
        administerable = new Administerable();
    }

    function afterEach() public {
        administerable.destroy();
    }

    function testInitState() public {

        uint state = uint(administerable.getState());
        uint active = uint(Administerable.State.Active);

        Assert.equal(state, active, "Initial contract state should be active.");

    }

    function testLockContract() public {

        administerable.lock();  
        uint state = uint(administerable.getState());
        uint locked = uint(Administerable.State.Locked);

        Assert.equal(state, locked, "Locked contract state should be Locked.");

    }

    function testUnlockContract() public {

        administerable.lock();          
        administerable.unlock();  

        uint state = uint(administerable.getState());
        uint active = uint(Administerable.State.Active);

        Assert.equal(state, active, "Locked contract state should be Active.");

    }

    function testInitAdminNo() public {

        Assert.equal(administerable.getAdminNo(), 1, "Initial number of administrators should be 1.");

    }

    function testGetOwner() public {

        Assert.equal(administerable.owner(), this, "Owner addres is msg.sender");

    }

    function testGetAdmin() public {

        Assert.equal(administerable.getAdministrator(this), 1, "Owner's administrator id should be 1.");

    }

    function testFirstAdmin() public {

        Assert.equal(administerable.isAdministrator(), true, "Owner is added to administrators.");

    }
  
    function testAddAdministrator() public {
        Administerable administerable1 = new Administerable();
        Administerable administerable2 = new Administerable();

        administerable1.addAdministrator(administerable2);
        Assert.equal(administerable1.getAdministrator(administerable2), 2, "An address is added to administrators.");

    }

}
