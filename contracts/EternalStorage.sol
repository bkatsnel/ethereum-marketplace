pragma solidity ^0.4.21;

import "./zeppelin/ownership/Ownable.sol";

contract EternalStorage is Ownable {

    uint private blockCreated = block.number;
    mapping (address => bool) owners;

   

    // Modifiers

    modifier OnlyOwners {
        require(owners[msg.sender] || owner == msg.sender,"Only owners can perform this function.");
        _;
    }

    constructor() public {

    }

    ////////////
    // Add Owner
    ////////////

    function addOwner(address owner) public onlyOwner {
        owners[owner] = true;
    }
    
    ////////////
    //UInt
    ////////////

    mapping(bytes32 => uint) UIntStorage;

    function getUIntValue(bytes32 record) public view  returns (uint) {
        return UIntStorage[record];
    }

    function setUIntValue(bytes32 record, uint value) public OnlyOwners {
        UIntStorage[record] = value;
    }

    function deleteUIntValue(bytes32 record) public OnlyOwners {
        delete UIntStorage[record];
    }

    ////////////
    //Strings
    ////////////

    mapping(bytes32 => string) StringStorage;

    function getStringValue(bytes32 record) public view  returns (string) {
        return StringStorage[record];
    }

    function setStringValue(bytes32 record, string value) public OnlyOwners {
        StringStorage[record] = value;
    }

    function deleteStringValue(bytes32 record) public OnlyOwners {
        delete StringStorage[record];
    }

    ////////////
    //Address
    ////////////

    mapping(bytes32 => address) AddressStorage;

    function getAddressValue(bytes32 record) public view  returns (address) {
        return AddressStorage[record];
    }

    function setAddressValue(bytes32 record, address value) public OnlyOwners {
        AddressStorage[record] = value;
    }

    function deleteAddressValue(bytes32 record) public OnlyOwners {
        delete AddressStorage[record];
    }

    ////////////
    //Bytes
    ////////////

    mapping(bytes32 => bytes) BytesStorage;

    function getBytesValue(bytes32 record) public view  returns (bytes) {
        return BytesStorage[record];
    }

    function setBytesValue(bytes32 record, bytes value) public OnlyOwners {
        BytesStorage[record] = value;
    }

    function deleteBytesValue(bytes32 record) public OnlyOwners {
        delete BytesStorage[record];
    }

    ////////////
    //Bytes32
    ////////////

    mapping(bytes32 => bytes32) Bytes32Storage;

    function getBytes32Value(bytes32 record) public view  returns (bytes32) {
        return Bytes32Storage[record];
    }

    function setBytes32Value(bytes32 record, bytes32 value) public OnlyOwners {
        Bytes32Storage[record] = value;
    }

    function deleteBytes32Value(bytes32 record) public OnlyOwners {
        delete Bytes32Storage[record];
    }

    ////////////
    //Boolean
    ////////////

    mapping(bytes32 => bool) BooleanStorage;

    function getBooleanValue(bytes32 record) public view  returns (bool) {
        return BooleanStorage[record];
    }

    function setBooleanValue(bytes32 record, bool value) public OnlyOwners {
        BooleanStorage[record] = value;
    }

    function deleteBooleanValue(bytes32 record) public OnlyOwners {
        delete BooleanStorage[record];
    }

    ////////////
    //Int
    ////////////
    mapping(bytes32 => int) IntStorage;

    function getIntValue(bytes32 record) public view  returns (int) {
        return IntStorage[record];
    }

    function setIntValue(bytes32 record, int value) public OnlyOwners {
        IntStorage[record] = value;
    }

    function deleteIntValue(bytes32 record) public OnlyOwners {
        delete IntStorage[record];
    }

    // Block Created Getter

    function getBlockCreated() public view returns (uint) {
        return blockCreated;
    }

    function isStorageOwner(address owner) public view returns (bool) {
        return owners[owner];
    }
   
}
