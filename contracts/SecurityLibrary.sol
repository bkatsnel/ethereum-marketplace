pragma solidity ^0.4.21;

import "./EternalStorage.sol";

library SecurityLibrary {

    // Events

    event LogAddAdministrator(address indexed admin, uint256 index);
    event LogRemoveAdministrator(address indexed admin, uint256 index);

    // Manages records for admins stored in the format:
    // keccak256('admin:', address) -> bool isUserAdmin , e.g. 0xd91cf6dac04d456edc5fcb6659dd8ddedbb26661 -> true

    function getAdminsCount(address _storageContract) public view returns(uint256) {
        return EternalStorage(_storageContract).getUIntValue(keccak256("AdminsCount"));
    }

    function getadminIndex(address _storageContract) public view returns(uint256) {
        return EternalStorage(_storageContract).getUIntValue(keccak256("adminIndex"));
    }

    function addAdministrator(address _storageContract, address _user) public {
        // Check if User is already admin
        bool userIsAdmin = EternalStorage(_storageContract).getBooleanValue(keccak256('admin:', _user));
        require(!userIsAdmin,"User is already administrator.");
        // Record address as admnistrator
        EternalStorage(_storageContract).setBooleanValue(keccak256("admin:", _user), true);
        // Increment the admins count in storage
        uint256 adminsCount = EternalStorage(_storageContract).getUIntValue(keccak256("AdminsCount"));
        EternalStorage(_storageContract).setUIntValue(keccak256("AdminsCount"), ++adminsCount);
        // Assign Admin Index
        uint256 adminIndex = EternalStorage(_storageContract).getUIntValue(keccak256("AdminIndex"));
        // Save Admin Index Info
        EternalStorage(_storageContract).setUIntValue(keccak256("AdminIndex"), ++adminIndex);
        EternalStorage(_storageContract).setUIntValue(keccak256(_user,"AdminIndex"), adminIndex);
        // Emit Event
        emit LogAddAdministrator(_user, adminIndex);
    }

    function removeAdmininistrator(address _storageContract, address _user) public {
        // Check if the user is administrator
        bool userIsAdmin = EternalStorage(_storageContract).getBooleanValue(keccak256('admin:', _user));
        require(userIsAdmin,"User is not an administrator.");

        uint256 adminsCount = EternalStorage(_storageContract).getUIntValue(keccak256("AdminsCount"));
        require(adminsCount > 1, "Can not remove last adminstrator");
        uint256 adminIndex = EternalStorage(_storageContract).getUIntValue(keccak256(_user,"AdminIndex"));

        EternalStorage(_storageContract).deleteBooleanValue(keccak256("admin:", _user));
        EternalStorage(_storageContract).deleteUIntValue(keccak256(_user,"AdminIndex"));

        // Decrement the admins count in storage
        EternalStorage(_storageContract).setUIntValue(keccak256("AdminsCount"), --adminsCount);
        // Emit Event
        emit LogRemoveAdministrator(_user, adminIndex);
    }

    function isAdministrator(address _storageContract, address _user) public view returns (bool) {
        return EternalStorage(_storageContract).getBooleanValue(keccak256('admin:', _user));
    }

    function getAdministrator(address _storageContract, address _user) public view returns (uint256) {
        return EternalStorage(_storageContract).getUIntValue(keccak256(_user,"AdminIndex"));
    }

}
