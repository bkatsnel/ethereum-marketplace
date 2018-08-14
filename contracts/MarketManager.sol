pragma solidity ^0.4.21;

import "./Market.sol";
import "./EternalStorage.sol";
import "./SecurityLibrary.sol";
import "./StoreOwners.sol";
import "./zeppelin/ownership/Ownable.sol";

contract MarketManager is Ownable {

    uint private blockCreated = block.number;   

    Market private market;
    EternalStorage private eternalStorage;
    StoreOwners private owners;

    struct History {
        address market;
        address owner;
    }

    History[] private contract_history;

    modifier OnlyFirstDeployment() {
        require(market == address(0), "Only first deploymnet");
        _;
    }

    modifier MarketDeployed() {
        require(market != address(0), "Market contract must be deployed first.");
        _;
    }

    event MarketContractDeployed(address indexed market, address indexed estorage, uint when, uint block);
    event MarketContractUpgraded(address indexed market, address indexed old_market, uint when);
    event StoreOwnersContractDeployed(address indexed owners, address indexed estorage, uint when, uint block);
    
    function deployMarketContract() public onlyOwner {

        if (market == address(0)) {

            eternalStorage = new EternalStorage();
            // Create first market contract
            market = new Market(eternalStorage);
            // Transfer ownership to msg.sender
            market.transferOwnership(msg.sender);
            // Set the market as the storage owner
            eternalStorage.transferOwnership(market);
             // Set this contract and the calling user as the first/second admin
            market.addAdministrator(this);
            market.addAdministrator(msg.sender);
            // Update block Number to First Market Contract Deployment
            blockCreated = block.number;   

            emit MarketContractDeployed(market, eternalStorage, now, block.number);

        }
     
    }

    function deployStoreOwnersContract() public onlyOwner {

        if (owners == address(0)) {

            // Create first market contract
            owners = new StoreOwners(eternalStorage);
            // Set the market as the storage owner
            owners.transferOwnership(market.owner());
            // Add Store Owners Contract to Storage Owners
            market.addStorageOwner(owners);

            emit StoreOwnersContractDeployed(owners, eternalStorage, now, block.number);

        }
    }

    function upgradeMarketContact(address _market) public onlyOwner {

        History memory old_contract = History({market: market, owner: Market(market).owner()});
        // Save old contract info
        contract_history.push(old_contract);
        // Set the market as the storage owner
        market.transferStorageOwnership(_market);
        // Assign new market to current market variable
        market = Market(_market);

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

    function getBlockCreated() public view returns (uint) {
        return blockCreated;
    }


}