# Ehthereum Online Marketplace Project for EDP

# Installaton Instructions for Virtual Box Ubuntu 16.04.4 (Ubuntu_16.04.4-VB-64bit)

* Create a machine with 3.5 GB RAM

* install nodejs 8.x and npm

* Install truffle: sudo npm install -g truffle@4.1.7

* Clone git repository: git clone -b upg-contracts https://github.com/bkatsnel/ethereum-marketplace.git

* Install node modules: npm install

* Set truffle.js: copy truffle-config.js to truffle.js

* Create secrets.js File and fill required info

  * Create secrets.js based on secrets-template.js file
  * As an alternative comment out ropsten network until ready to test with ropsten

* Start development network: truffle develop --network development

* Install Oraclize bridge: npm run inst_bridge

* install, init, config and start ipfs daemon

  * follow https://gist.github.com/MiguelBel/b3b5f711aa8d9362afa5f16e4e972461

  * ipfs init

  * use ipfs cat /ipfs/QmS4ustL54uo8FzR9455qaxZwuMiUhyvMcX9Ba8nUH4uVv/readme to verify 

  * allow cors
  
	   * ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
	   * ipfs config --json Gateway.HTTPHeaders.Access-Control-Allow-Origin '["*"]'

  * start ipfs daemon 

  * keep ipfs daemon runnning in a separate window

* Setup Metamask Accounts

  * import truffle develop first 3 accounts to MetaMask

* Start Oraclize Bridge in a seprate window and verify OAR address

  * npm run bridge 
	* check OAR Resolver address matches OraclizeGetPrice.sol address (line 21)
  * If resolver address is different, update that info

* Verify installation And Contracts

  * truffle compile
    * Ignore warnings for zeppelin and ensdomains contracts
  * truffle test --network development 
    * it takes a few minutes to start - many big contracts
    * Note: most tests are coded in JavaScript because it is not possible to deploy a contract that imports all DApp contracts due to block gas limit

* Deploy Contracts and Run DApp

  * truffle migrate --network development
  * npm run ens (for development network)
  * npm start

# Proceed to UnitTest.md 

  * UnitTest.md describes how to use the DApp

# Ropsten Test Notes

* deployed_addresses.txt has contract info

* Get ready for testing

  * Add Ropsten ether to first 3 wallet accounts
  * Update secrets.js with correct mnemonic and injura API information
  * Use test and migrate commands with --network ropsten parameter