// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {UniverseManager} from "../src/UniverseManager.sol";
import {NodeCreationOptions, NodeVisibilityOptions} from "../src/libraries/NodeOptions.sol";

import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {Deployers} from "@uniswap/v4-core/test/utils/Deployers.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {PoolModifyLiquidityTest} from "@uniswap/v4-core/src/test/PoolModifyLiquidityTest.sol";
import {IPoolManager, PoolManager} from "@uniswap/v4-core/src/PoolManager.sol";
import {TickMath} from "@uniswap/v4-core/src/libraries/TickMath.sol";
import {WETH9} from "./tokens/WETH9.sol";
//import {LoarHook} from "../src/hooks/LoarHook.sol";
import {LoarHookStaticFee} from "../src/hooks/LoarHookStaticFee.sol";

contract UniverseManagerTest is Test, Deployers {
    UniverseManager public universeManager;
    PoolManager public poolManager;
    PoolModifyLiquidityTest public poolModifyPosition;
    LoarHookStaticFee public loarHook;

    WETH9 internal WETH;
    WETH9 internal lrWETH;

    //bytes internal constant UNAUTHORIZED = 0x82b42900;
    int24 TICK_SPACING = 60;

    address public constant DEPLOYER =
        0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;

    function setUp() public {
        poolManager = new PoolManager(address(this));
        console.log(address(poolManager), "PoolManager Address");
        poolModifyPosition = new PoolModifyLiquidityTest(poolManager);
        console.log(address(poolModifyPosition), "poolModifyPosition Address");
        universeManager = new UniverseManager(msg.sender);
        console.log(address(universeManager), "UniverseManager Address");
        WETH = WETH9(payable(address(123)));
        console.log(address(WETH), "WETH Address");
        loarHook = new LoarHookStaticFee(
            address(poolManager),
            address(universeManager),
            address(WETH)
        );
        console.log(address(loarHook), "HookStaticFee Address");
        lrWETH = WETH;
    }

    function test_CreateUniverse() public {
        (uint id, address universeAddress) = universeManager.createUniverse(
            "One Piece",
            "random.png",
            "one piece adventures",
            NodeCreationOptions.PUBLIC,
            NodeVisibilityOptions.PUBLIC,
            address(this)
        );
        assertNotEq(address(0), universeAddress);
    }

    function test_deployUniverseToken() public {}

    function test_claimFee() public {}
}
