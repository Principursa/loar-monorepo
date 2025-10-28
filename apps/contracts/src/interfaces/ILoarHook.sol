// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IUniverseManager} from "./IUniverseManager.sol";

import {PoolId} from "@uniswap/v4-core/src/types/PoolId.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";

interface ILoarHook {
    error ETHPoolNotAllowed();
    error OnlyFactory();
    error UnsupportedInitializePath();
    error PastCreationTimestamp();
    error MevModuleEnabled();
    error WethCannotBeLoar();

    event PoolCreatedOpen(
        address indexed pairedToken,
        address indexed clanker,
        PoolId poolId,
        int24 tickIfToken0IsClanker,
        int24 tickSpacing
    );

    event PoolCreatedFactory(
        address indexed pairedToken,
        address indexed clanker,
        PoolId poolId,
        int24 tickIfToken0IsClanker,
        int24 tickSpacing,
        address locker,
        address mevModule
    );

    event ClaimProtocolFees(address indexed token, uint256 amount);

    // initialize a pool on the hook for a token
    function initializePool(
        address loar,
        address pairedToken,
        int24 tickIfToken0Isloar,
        int24 tickSpacing,
        bytes calldata poolData
    ) external returns (PoolKey memory);

    // initialize a pool not via the factory
    function initializePoolOpen(
        address clanker,
        address pairedToken,
        int24 tickIfToken0IsClanker,
        int24 tickSpacing,
        bytes calldata poolData
    ) external returns (PoolKey memory);

    function poolCreationTimestamp(
        PoolId poolId
    ) external view returns (uint256);

    function MAX_MEV_MODULE_DELAY() external view returns (uint256);

    function supportsInterface(bytes4 interfaceId) external pure returns (bool);
}
