pragma solidity ^0.4.21;

import "../installed_contracts/zeppelin/contracts/lifecycle/Destructible.sol";
import "../installed_contracts/zeppelin/contracts/lifecycle/Pausable.sol";

contract IMarketManager is Destructible, Pausable {

    uint internal blockCreated = block.number;   

    address internal market;
    address internal eternalStorage;
    address internal owners;
    address internal stores;
    address internal customers;

    struct History {
        address market;
        address owner;
    }

    History[] internal contract_history;

    // Event Definitions

    event MarketContractDeployed(address indexed market, address indexed estorage, uint when, uint block);
    event MarketContractUpgraded(address indexed market, address indexed old_market, uint when);
    event StoreOwnersContractDeployed(address indexed owners, address indexed estorage, uint when, uint block);
    event StoresContractDeployed(address indexed stores, address indexed estorage, uint when, uint block);
    event CustomersContractDeployed(address indexed customers, address indexed estorage, uint when, uint block);

    // Virtual Getters 

    function deployMarketContract() public;
    function deployStoreOwnersContract(address _owners) public;
    function deployStoresContract(address _stores) public;
    function deployCustomersContract(address _customers) public;
    function upgradeMarketContact(address _market) public;

    // Getters

    function getDeployedMarketContract() public view returns(address);
    function getDeployedStorageContract() public view returns(address);
    function getDeployedStoreOwnersContract() public view returns(address);
    function getDeployedStoresContract() public view returns(address);
    function getDeployedCustomersContract() public view returns(address);
    function getBlockCreated() public view returns (uint);

}