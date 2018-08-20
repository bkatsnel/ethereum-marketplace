# Ehthereum Online Marketplace Project for EDP

# Avoid Common Attacks Approaches

## Emergency Stop

All contracts inherit from Pausable to implement emergency stop functionality 

## Reentrancy

msg.sender.call.value is not used and no state modifications are made after external contract function calls

## Withdrawal Pattern

Withdrawal pattern is used for store owners to get funds from sales as well as for customers to get back overpayments. The balances are first recorded and then can be transferred by the recipients using contract functions.

## Use SafeMath library

Use SafeMath library to avoid overflow conditions

## Use Explicit Function and Variable Visibility 

Use explicit public, private or internal visibility definitions

## Timestamp Dependence 

now function is used only for informational purposes to indicate approximate time of transaction

## Perform Analysis using Security Tool

Run SmartCheck analysis