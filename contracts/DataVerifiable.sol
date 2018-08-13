pragma solidity ^0.4.21;

contract DataVerifiable {

  /// @notice throws if ether was sent accidentally
    modifier RefundEtherSentByAccident() {
        require(msg.value == 0, "Do not accept ether.");
        _;
    }

    /// @notice throw if an address is invalid
    /// @param _target the address to check
    modifier IsValidAddress(address _target) {
        require(_target != 0x0, "Address can not be null.");
        _;
    }

    /// @notice throw if the id is invalid
    /// @param _id the ID to validate
    modifier IsNonEmptyString(string _id) {
        require(bytes(_id).length > 0, "String should not be empty.");
        _;
    }

    /// @notice throw if the uint is equal to zero
    /// @param _id the ID to validate
    modifier NotEqualToZero(uint _id) {
        require(_id != 0, "Uint should not be zero.");
        _;
    }

    /// @notice throw if the id is invalid
    /// @param _id the ID to validate
    modifier IsNotEmptyBytes32(bytes32 _id) {
        require(_id != "", "Bytes32 should not be empty.");
        _;
    }

}
