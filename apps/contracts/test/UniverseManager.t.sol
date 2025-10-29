// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {UniverseManager} from "../src/UniverseManager.sol";

import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {Deployers} from "@uniswap/v4-core/test/utils/Deployers.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {PoolModifyLiquidityTest} from "@uniswap/v4-core/src/test/PoolModifyLiquidityTest.sol";
import {IPoolManager, PoolManager} from "@uniswap/v4-core/src/PoolManager.sol";
import {TickMath} from "@uniswap/v4-core/src/libraries/TickMath.sol";
import {WETH9} from "./tokens/WETH9.sol";

contract UniverseManagerTest is Test, Deployers {

    UniverseManager public universeManager;
    PoolManager internal poolManager;
    PoolModifyLiquidityTest internal poolModifyPosition;

    bytes internal constant UNAUTHORIZED = 0x82b42900;
    int24 TICK_SPACING = 60;

    address public constant DEPLOYER =
        0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;

    function setUp() public {
        poolManager = new PoolManager(address(this));
        poolModifyPosition = new PoolModifyLiquidityTest(poolManager);
        universeManager = new UniverseManager(msg.sender);
    }
}
