// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract MockPermit2 {
    function approve(address, address, uint160, uint48) external {
        // Mock implementation - just accept the approval
    }
}
