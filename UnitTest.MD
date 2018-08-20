# Ehthereum Online Marketplace Project for EDP

# Unit Test Instructions

## Test Administrative Functions

    * Login as Admin with Develop account 1

    * Deploy menu 

        * deply market, store owner, stores and customers contracts 

    * Check ipfs

    * Check ens - 4 lines

    * Check price (via oraclize)

    * Administrators

        * There should be 2 administrators defined after deploying Market and EternalStorage contracts 
        * Add administrator using Develop 10 account

    * Owners

        * add owner name Walter, account Develop 2(0xf17f52151ebef6c7334fad080c5704d77216b732)

    * Logout

## Test Store Owner Add Stores and Products Functions

    * Login as Store Owner with Develop 2 account 

    * Stores (store logos are saved as IPFS files)

        * Add store: Pet Store, Best pets at lowest prices

        * Add store: Animal World, Best pets on earth

        * Add store: Dog Planet, Best dogs on the planet

        * Add store: Bird's cornet, Birds are beautiful

    * Products 

        * Select Pet Store

            * Add product 1, 100, 5, Gold Fish

            * Add product 2, 10, 10, Turtle

        * Select Animal Planet

            * Add product 3, 2, 50, Tabby Cat

        * Select Dog Planet	

            *  Add product 4,2, 75, Golden Retriever

        * Select Bird's Corner

            * Add product 5,1,100, Amazon Parrot

    * Logout

## Test Customer Orders Functions

    * Login as Customer with Develop 3 account

    * Sign Up as Bob, 1 Main Street

    * Should redirect to Markeplace

        * Double-click on Pet Store

        * Double-click on Gold Fish

        * Order 10 Gold Fish, should see orders

    * Go to Marketplace

        * Double click on Animal Planet

        * Double click on Tabby Cat

        * Order 1 Cat

        * Should see 2 orders now

    * Logout

## Test Store Owner Store Funds Withdrawal

    * Login as Store Owner with Develop 2 account

	* Go to Stores

		* Double click on Pet Store 

		* Withdraw store balance

		* See withdrawals list

		* Go to to stores and verify 0 balance of Pet Store

    * Logout