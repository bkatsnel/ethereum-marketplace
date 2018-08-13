var Ownable = artifacts.require("./zeppelin/ownership/Ownable.sol")
var Destructible = artifacts.require("./zeppelin/lifecycle/Destructible.sol")
// var SafeMath = artifacts.require("./zeppelin/math/SafeMath.sol")
var DataVerifiable = artifacts.require("./DataVerifiable.sol")
var SecurityLibrary = artifacts.require("./SecurityLibrary.sol")
var DataVerifiable = artifacts.require("./DataVerifiable.sol")
var EternalStorage = artifacts.require("./EternalStorage.sol")
var Market = artifacts.require("./Market.sol")
var MarketManager = artifacts.require("./MarketManager.sol")
// var Administerable = artifacts.require("./Administerable.sol")
// var OnlineMarketplace = artifacts.require("./OnlineMarketplace.sol")

module.exports = function(deployer, network, accounts) {

  deployer.then(() => {
    return deployer.deploy(Ownable)
  })
  .then(() => {
    return deployer.deploy(Destructible)
  })
  .then(() => {
    return deployer.deploy(DataVerifiable)
  })
  .then(() => {
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
    return deployer.link(SecurityLibrary, MarketManager)
  })
  .then(() => {
    return deployer.deploy(MarketManager)
  })
  // .then(() => {
  //   return deployer.deploy(SafeMath)
  // })
  // .then(() => {
  //   return deployer.link(SafeMath,OnlineMarketplace)
  // })
  // .then(() => {
  //   return deployer.deploy(OnlineMarketplace)
  // })

}
