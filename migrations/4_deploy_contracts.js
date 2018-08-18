var OraclizeGetPrice = artifacts.require("./OraclizeGetPrice.sol");

module.exports = function(deployer, network, accounts) {
  // Deploys the OraclizeGetPrice contract and funds it with 0.5 ETH
  // The contract needs a balance > 0 to communicate with Oraclize
  if (network === "development") {

      deployer.deploy(
        OraclizeGetPrice,
        { from: accounts[9], gas:6721975, value: 500000000000000000 });
        
  }

};
