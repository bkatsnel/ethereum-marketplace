
var HDWalletProvider = require("truffle-hdwallet-provider")
var secrets = require("./secrets")

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*", // Match any network id
      gas: 6721975
    },
    ropsten: {
      provider:  new HDWalletProvider(secrets.mnemonic, "https://ropsten.infura.io/v3/" + secrets.infuraKey),
      network_id: 3,
      gas: 4712388
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  mocha: {
    useColors: true
  }
};
