# Ehthereum Online Marketplace Project for EDP

# Installaton Instructions

* install nodejs and npm

* Install truffle: sudo npm install -g truffle@4.1.7

* Clone git repository: git clone -b upg-contracts https://github.com/bkatsnel/ethereum-marketplace.git

* Install node modules: npm install

* Set truffle.js: copy truffele-confihjs to truffle.js

* Start developement network: truffle develop

* Install Oraclize bridge: npm run inst_bridge

* install, init and start ipfs daemon

  * allow cors
  
	* ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
	* ipfs config --json Gateway.HTTPHeaders.Access-Control-Allow-Origin '["*"]'

* Setup Metamask Accounts

  * import truffle develop first 3 accounts to metamask

* Start Oraclize Bridge and verify OAR address

    * npm run bridge
	* check OAR Resolver address matches OraclizeGetPrice.sol address (line 21)

* Verify and Deploy installation

  * truffle compile
  * truffle test
  * truffle migrate
  * npm run ens
  * npm start