const Web3 = require('web3')
const namehash = require('eth-ens-namehash')

const ENS = artifacts.require("@ensdomains/ens/contracts/ENSRegistry.sol");
const PublicResolver = artifacts.require("@ensdomains/ens/contracts/PublicResolver.sol");
const ReverseRegistrar = artifacts.require("@ensdomains/ens/contracts/ReverseRegistrar.sol");

module.exports = function(deployer, network, accounts) {

  let owner = accounts[0]
  let tld = "eth"

  let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));

  deployer.then(() => {

    if (network === "development") {

      return deployer.deploy(ENS)
        .then(() => {
          return deployer.deploy(PublicResolver, ENS.address)
        })
        .then(() => {
          return deployer.deploy(ReverseRegistrar, ENS.address, PublicResolver.address)
        })
        .then(() => {
          return ENS.at(ENS.address)
            // eth
            .setSubnodeOwner(0, web3.sha3(tld), owner, {from: owner})
        })
        .then(() => {
          return ENS.at(ENS.address)
          // reverse
          .setSubnodeOwner(0, web3.sha3('reverse'), owner, {from: owner})
        })
        .then(() => {
          return ENS.at(ENS.address)
          // addr.reverse
          .setSubnodeOwner(namehash.hash('reverse'), web3.sha3('addr'), ReverseRegistrar.address, {from: owner})
        })

    }

  })

}