var SecurityLibrary = artifacts.require("./SecurityLibrary")
var EternalStorage = artifacts.require("./EternalStorage")
var Market = artifacts.require("./Market")
var StoreOwners = artifacts.require("./StoreOwners")
var Stores = artifacts.require("./Stores")
var SafeMath = artifacts.require("./SafeMath")
var Customers = artifacts.require("./Customers")
var MarketManager = artifacts.require("./MarketManager")

module.exports = function(deployer, network, accounts) {

  deployer.then(() => {
    return deployer.deploy(EternalStorage)
  })
  .then(() => {
    return deployer.deploy(SecurityLibrary)
  })
  .then(() => {
    return deployer.link(SecurityLibrary, Market)
  })
  .then(() => {
    return deployer.deploy(Market, EternalStorage.address)    
  })
  .then(() => {
    return deployer.deploy(SafeMath)
  })
  .then(() => {
    return deployer.link(SecurityLibrary, MarketManager)
  })
  .then(() => {
    return deployer.deploy(MarketManager)
  })
  .then(() => {
    return deployer.link(SecurityLibrary, StoreOwners)
  })
  .then(() => {
    return deployer.deploy(StoreOwners, MarketManager.address)    
  })
  .then(() => {
    return deployer.deploy(Stores, MarketManager.address)    
  })
  .then(() => {
    return deployer.deploy(SafeMath)
  })
  .then(() => {
    return deployer.link(SafeMath, Customers)
  })
  .then(() => {
    return deployer.deploy(Customers, MarketManager.address)
  })
}
