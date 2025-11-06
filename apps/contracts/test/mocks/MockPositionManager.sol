// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract MockPositionManager {
    uint256 private _nextTokenId = 1;

    function nextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    function modifyLiquidities(bytes calldata, uint256) external payable returns (uint256) {
        // Mock implementation - just increment token ID and return
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        return tokenId;
    }

    function modifyLiquiditiesWithoutUnlock(bytes calldata, bytes[] calldata) external payable {
        // Mock implementation for fee collection
        // In a real implementation this would collect fees and send them to the locker
    }
}
