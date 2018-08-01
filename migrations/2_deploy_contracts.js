var Ownable = artifacts.require("./zeppelin/ownership/Ownable.sol");
var Destructible = artifacts.require("./zeppelin/lifecycle/Destructible.sol");
var SafeMath = artifacts.require("./zeppelin/math/SafeMath.sol");
var Administerable = artifacts.require("./Administerable.sol");
var OnlineMarketplace = artifacts.require("./OnlineMarketplace.sol");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(Destructible);
  deployer.deploy(Administerable);
  deployer.deploy(SafeMath);
  deployer.link(SafeMath,OnlineMarketplace)
  deployer.deploy(OnlineMarketplace);
};
