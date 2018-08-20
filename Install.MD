# Ehthereum Online Marketplace Project for EDP

# Installaton Instructions

* install nodejs and npm

* Install truffle: sudo npm install -g truffle@4.1.7

* Clone git repository: git clone -b upg-contracts https://github.com/bkatsnel/ethereum-marketplace.git

* Install node modules: npm install

* Set truffle.js: copy truffele-confihjs to truffle.js

* Start development network: truffle develop

* Install Oraclize bridge: npm run inst_bridge

* install, init and start ipfs daemon

  * allow cors
  
	* ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
	* ipfs config --json Gateway.HTTPHeaders.Access-Control-Allow-Origin '["*"]'

* Setup Metamask Accounts

  * import truffle develop first 3 accounts to MetaMask

* Start Oraclize Bridge and verify OAR address

  * npm run bridge
	* check OAR Resolver address matches OraclizeGetPrice.sol address (line 21)

* Verify installation And Contracts

  * truffle compile
  * truffle test
    * Note: most tests are coded in JavaScript because it is not possible to deploy a contract that imports all Dapp contracts due to block gas limit

* Deploy Contracts and Run DApp

  * truffle migrate
  * npm run ens (for development network)
  * npm start