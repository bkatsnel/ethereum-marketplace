# Ehthereum Online Marketplace Project for EDP

# Design pattern decisions

The design imitates container pattern to split functionality into 4 contracts dealing with specific category, ie administrators,
store owners, stores and customers/orders. All contracts access the same storage using EternalStorage contract.

## Withdrawal Pattern

Withdrawal pattern is used for store owners to get funds from sales as well as for customers to get back overpayments. The balances are first recorded and then can be transferred by the recipients using contract functions.

## Restricting Function Access

Modifiers are used extensively to limit what accounts or contracts can execute contract function

## Use require to Validate Inputs

All contracts use require statements to validate conditions before making changes

## Use ethPM Libraries

Open Zeppelin contracts, Ownable, Destructible and Pausable as well as SafeMath library are used by the project. Oraclize-api package is also used.

## Emergency Stop

Emergency stop functionality is implemented by inheriting from Pausable open zeppelin contract

## Destructible Inheritance

All contracts inherit from Destructible to simplify trasferring balances to new version of contracts if required. This is particularly important for Customers contract that holds store funds until they are withdrawn by store owners.

## Upgradable Contracts

The contracts are designed for MarketManager to allocate and upgrade component contracts, Market, StoreOwners, Stores and Customers. All contracts use EternalStorage to store on-chain data. 

## Libraries

Security library is used by Market contract. SafeMath library is used by Customers contract as a simple example.

## Abstract Contracts

All contracts inherit from abstract contracts to enhance upgradability and to keep contract deployment cost under block gas limit

