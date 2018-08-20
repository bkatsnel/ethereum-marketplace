var SecurityLibrary = artifacts.require("./SecurityLibrary")
var EternalStorage = artifacts.require("./EternalStorage")
var Market = artifacts.require("./Market")

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
}
