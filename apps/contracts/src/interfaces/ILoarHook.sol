// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IUniverseManager} from "./IUniverseManager.sol";

import {PoolId} from "../../dependencies/uniswap-v4-core-4/src/types/PoolId.sol";
import {PoolKey} from "../../dependencies/uniswap-v4-core-4/src/types/PoolKey.sol";

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

    // note: is not emitted when a mev module expires
    event MevModuleDisabled(PoolId);
    event ClaimProtocolFees(address indexed token, uint256 amount);

    // initialize a pool on the hook for a token
    function initializePool(
        address clanker,
        address pairedToken,
        int24 tickIfToken0IsClanker,
        int24 tickSpacing,
        address locker,
        address mevModule,
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

    // turn a pool's mev module on if it exists
    function initializeMevModule(
        PoolKey calldata poolKey,
        bytes calldata mevModuleData
    ) external;

    // note: original base IClankerHook deployment is missing these functions but
    // the IClankerLpFeeConversion locker needs them
    function mevModuleEnabled(PoolId poolId) external view returns (bool);

    function poolCreationTimestamp(
        PoolId poolId
    ) external view returns (uint256);

    function MAX_MEV_MODULE_DELAY() external view returns (uint256);

    function supportsInterface(bytes4 interfaceId) external pure returns (bool);
}
