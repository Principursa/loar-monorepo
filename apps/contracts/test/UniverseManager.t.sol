// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {UniverseManager} from "../src/UniverseManager.sol";
import {NodeCreationOptions, NodeVisibilityOptions} from "../src/libraries/NodeOptions.sol";
import {LoarLpLockerMultiple} from "../src/lp-lockers/LoarLpLockerMultiple.sol";
import {Hooks, IHooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {Deployers} from "@uniswap/v4-core/test/utils/Deployers.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {PoolModifyLiquidityTest} from "@uniswap/v4-core/src/test/PoolModifyLiquidityTest.sol";
import {IPoolManager, PoolManager} from "@uniswap/v4-core/src/PoolManager.sol";
import {TickMath} from "@uniswap/v4-core/src/libraries/TickMath.sol";
import {BalanceDelta} from "@uniswap/v4-core/src/types/BalanceDelta.sol";
import {IERC20} from "@openzeppelin/interfaces/IERC20.sol";
import {WETH9} from "./tokens/WETH9.sol";
//import {LoarHook} from "../src/hooks/LoarHook.sol";
import {LoarHookStaticFee} from "../src/hooks/LoarHookStaticFee.sol";
import {HookTest} from "./HookTest.sol";
import {IUniverseManager} from "../src/interfaces/IUniverseManager.sol";
import {ILoarHookStaticFee} from "../src/interfaces/ILoarHookStaticFee.sol";

contract UniverseManagerTest is HookTest {
    UniverseManager public universeManager;
    PoolManager public poolManager;
    LoarHookStaticFee public loarHook;

    WETH9 internal WETH;
    WETH9 internal lrWETH;

    //bytes internal constant UNAUTHORIZED = 0x82b42900;
    int24 TICK_SPACING = 60;

    address public constant DEPLOYER =
        0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;

    function setUp() public {
        deployFreshManagerAndRouters();
        poolManager = PoolManager(address(manager)); // Use the manager from parent Deployers class
        console.log(address(poolManager), "PoolManager Address");
        console.log(address(modifyLiquidityRouter), "modifyLiquidityRouter Address");
        universeManager = new UniverseManager(msg.sender);
        console.log(address(universeManager), "UniverseManager Address");
        WETH = WETH9(payable(address(123)));
        console.log(address(WETH), "WETH Address");
        //loarHook = new LoarHookStaticFee(
        //    address(poolManager),
        //    address(universeManager),
        //   address(WETH)
        //);

        loarHook = LoarHookStaticFee(
            address(
                uint160(
                    Hooks.BEFORE_INITIALIZE_FLAG |
                        Hooks.BEFORE_ADD_LIQUIDITY_FLAG |
                        Hooks.BEFORE_SWAP_FLAG |
                        Hooks.AFTER_SWAP_FLAG |
                        Hooks.BEFORE_SWAP_RETURNS_DELTA_FLAG |
                        Hooks.AFTER_SWAP_RETURNS_DELTA_FLAG
                )
            )
        );
        deployCodeTo(
            "src/hooks/LoarHookStaticFee.sol:LoarHookStaticFee",
            abi.encode(
                address(poolManager),
                address(universeManager),
                address(WETH)
            ),
            address(loarHook)
        );
        console.log(address(loarHook), "HookStaticFee Address");
        lrWETH = WETH;
    }

    function test_CreateUniverse() public {
        (,address universeAddress) = createUniverse();
        assertNotEq(address(0), universeAddress);
    }

    function test_deployUniverseToken() public {
      int24 tickIfToken0IsLoar = -230400;
      int24 tickSpacing = 200;

      // Encode the pool data with fee configuration
      ILoarHookStaticFee.PoolStaticConfigVars memory poolConfigVars = ILoarHookStaticFee.PoolStaticConfigVars({
        loarFee: 3000,    // 0.3% fee
        pairedFee: 3000   // 0.3% fee
      });
      bytes memory poolData = abi.encode(poolConfigVars);

      IUniverseManager.TokenConfig memory tokenConfig = IUniverseManager.TokenConfig({
        tokenAdmin: msg.sender,
        name: "Test Token",
        symbol:"TT",
        imageURL: "testimage.org",
        metadata: "{'description':'testdescription}",
        context: "{'interface':'loar.fun, 'platform':'','messageId':''}"
      });
      IUniverseManager.PoolConfig memory poolConfig = IUniverseManager.PoolConfig({
        hook:address(loarHook),
        pairedToken: address(WETH),
        tickIfToken0IsLoar: tickIfToken0IsLoar,
        tickSpacing:tickSpacing,
        poolData: poolData

      });
      IUniverseManager.DeploymentConfig memory deployConfig = IUniverseManager.DeploymentConfig({
        tokenConfig: tokenConfig,
        poolConfig: poolConfig
      });
      universeManager.setHook(address(loarHook),true);
      (uint id, address universeAddress) = createUniverse();
      address tokenAddress = universeManager.deployUniverseToken(deployConfig, id);
      assertNotEq(tokenAddress, address(0));
    }

    function test_claimFee() public {}

    function test_swapInDeployedPool() public {
        // Deploy a real WETH contract for testing
        WETH9 realWETH = new WETH9();

        // Setup pool data with fees
        int24 tickIfToken0IsLoar = -230400;
        int24 tickSpacing = 200;

        ILoarHookStaticFee.PoolStaticConfigVars memory poolConfigVars = ILoarHookStaticFee.PoolStaticConfigVars({
            loarFee: 3000,
            pairedFee: 3000
        });
        bytes memory poolData = abi.encode(poolConfigVars);

        IUniverseManager.TokenConfig memory tokenConfig = IUniverseManager.TokenConfig({
            tokenAdmin: msg.sender,
            name: "Swap Test Token",
            symbol: "STT",
            imageURL: "swaptest.org",
            metadata: "{'description':'swap test'}",
            context: "{'interface':'loar.fun', 'platform':'', 'messageId':''}"
        });

        IUniverseManager.PoolConfig memory poolConfig = IUniverseManager.PoolConfig({
            hook: address(loarHook),
            pairedToken: address(realWETH),
            tickIfToken0IsLoar: tickIfToken0IsLoar,
            tickSpacing: tickSpacing,
            poolData: poolData
        });

        IUniverseManager.DeploymentConfig memory deployConfig = IUniverseManager.DeploymentConfig({
            tokenConfig: tokenConfig,
            poolConfig: poolConfig
        });

        universeManager.setHook(address(loarHook), true);
        (uint id, ) = createUniverse();
        address tokenAddress = universeManager.deployUniverseToken(deployConfig, id);

        // Get the pool key for swapping - order currencies by address
        bool wethIsToken0 = address(realWETH) < tokenAddress;
        PoolKey memory poolKey = PoolKey({
            currency0: Currency.wrap(wethIsToken0 ? address(realWETH) : tokenAddress),
            currency1: Currency.wrap(wethIsToken0 ? tokenAddress : address(realWETH)),
            fee: 8388608, // DYNAMIC_FEE_FLAG
            tickSpacing: tickSpacing,
            hooks: IHooks(address(loarHook))
        });

        // Mint some WETH to this test contract
        vm.deal(address(this), 100 ether);
        realWETH.deposit{value: 10 ether}();

        // Transfer all universe tokens from UniverseManager to test contract
        IERC20 universeToken = IERC20(tokenAddress);
        uint256 managerBalance = universeToken.balanceOf(address(universeManager));
        vm.prank(address(universeManager));
        universeToken.transfer(address(this), managerBalance); // Transfer all tokens

        // Approve the modifyLiquidityRouter to spend tokens
        realWETH.approve(address(modifyLiquidityRouter), type(uint256).max);
        universeToken.approve(address(modifyLiquidityRouter), type(uint256).max);

        // Also approve for swap router
        realWETH.approve(address(swapRouter), type(uint256).max);
        universeToken.approve(address(swapRouter), type(uint256).max);

        // Add liquidity to the pool - use a narrower range around the current price
        // Ticks must be multiples of tickSpacing (200)
        int24 tickLower = 220000; // Below current price
        int24 tickUpper = 240000; // Above current price

        modifyPoolLiquidity(
            poolKey,
            tickLower,
            tickUpper,
            10e18, // Smaller liquidity amount
            bytes32(0)
        );

        // Record balances before swap
        uint256 wethBalanceBefore = realWETH.balanceOf(address(this));
        uint256 tokenBalanceBefore = universeToken.balanceOf(address(this));

        console.log("WETH balance before swap:", wethBalanceBefore);
        console.log("Universe token balance before swap:", tokenBalanceBefore);

        // Test swap: WETH -> Universe Token (exact input)
        // zeroForOne depends on which token is currency0
        bool swappingWethForToken = wethIsToken0;
        int256 swapAmount = -1e17; // Sell 0.1 WETH (negative = exact input)
        swap(poolKey, swappingWethForToken, swapAmount, ZERO_BYTES);

        uint256 wethBalanceAfterSwap1 = realWETH.balanceOf(address(this));
        uint256 tokenBalanceAfterSwap1 = universeToken.balanceOf(address(this));

        console.log("WETH balance after swap 1:", wethBalanceAfterSwap1);
        console.log("Universe token balance after swap 1:", tokenBalanceAfterSwap1);

        // Verify WETH decreased
        assertLt(wethBalanceAfterSwap1, wethBalanceBefore, "WETH should decrease after swap");
        // Verify universe token increased
        assertGt(tokenBalanceAfterSwap1, tokenBalanceBefore, "Universe token should increase after swap");

        // Test swap: Universe Token -> WETH (exact input)
        int256 swapAmount2 = -1000e18; // Sell 1000 universe tokens
        swap(poolKey, !swappingWethForToken, swapAmount2, ZERO_BYTES);

        uint256 wethBalanceAfterSwap2 = realWETH.balanceOf(address(this));
        uint256 tokenBalanceAfterSwap2 = universeToken.balanceOf(address(this));

        console.log("WETH balance after swap 2:", wethBalanceAfterSwap2);
        console.log("Universe token balance after swap 2:", tokenBalanceAfterSwap2);

        // Verify universe token decreased
        assertLt(tokenBalanceAfterSwap2, tokenBalanceAfterSwap1, "Universe token should decrease after swap");
        // Verify WETH increased
        assertGt(wethBalanceAfterSwap2, wethBalanceAfterSwap1, "WETH should increase after swap");
    }

    function createUniverse() public returns (uint, address) {
        (uint id, address universeAddress) = universeManager.createUniverse(
            "One Piece",
            "random.png",
            "one piece adventures",
            NodeCreationOptions.PUBLIC,
            NodeVisibilityOptions.PUBLIC,
            address(this)
        );
        return (id, universeAddress);
    }
}
