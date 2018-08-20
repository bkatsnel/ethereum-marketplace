var SecurityLibrary = artifacts.require("./SecurityLibrary")
var StoreOwners = artifacts.require("./StoreOwners")
var Stores = artifacts.require("./Stores")
var SafeMath = artifacts.require("./SafeMath")
var Customers = artifacts.require("./Customers")
var MarketManager = artifacts.require("./MarketManager")

module.exports = function(deployer, network, accounts) {

  deployer.then(() => {
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
