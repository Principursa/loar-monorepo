// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {UniverseManager} from "../src/UniverseManager.sol";
import {UniverseTokenDeployer} from "../src/UniverseTokenDeployer.sol";
import {NodeCreationOptions, NodeVisibilityOptions} from "../src/libraries/NodeOptions.sol";
import {LoarLpLockerMultiple} from "../src/lp-lockers/LoarLpLockerMultiple.sol";
import {LoarFeeLocker} from "../src/LoarFeeLocker.sol";
import {Hooks, IHooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {MockPositionManager} from "./mocks/MockPositionManager.sol";
import {MockPermit2} from "./mocks/MockPermit2.sol";
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
    UniverseTokenDeployer public tokenDeployer;
    PoolManager public poolManager;
    LoarHookStaticFee public loarHook;
    LoarFeeLocker public feeLocker;
    LoarLpLockerMultiple public lpLocker;
    MockPositionManager public mockPositionManager;
    MockPermit2 public mockPermit2;

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

        tokenDeployer = new UniverseTokenDeployer(address(universeManager));
        console.log(address(tokenDeployer), "UniverseTokenDeployer Address");

        universeManager.setTokenDeployer(address(tokenDeployer));

        WETH = WETH9(payable(address(123)));
        console.log(address(WETH), "WETH Address");

        // Deploy mocks for PositionManager and Permit2
        mockPositionManager = new MockPositionManager();
        mockPermit2 = new MockPermit2();
        console.log(address(mockPositionManager), "MockPositionManager Address");
        console.log(address(mockPermit2), "MockPermit2 Address");

        feeLocker = new LoarFeeLocker(address(this));
        console.log(address(feeLocker), "FeeLocker Address");

        lpLocker = new LoarLpLockerMultiple(
            address(this), // owner
            address(universeManager), // factory
            address(feeLocker),
            address(mockPositionManager),
            address(mockPermit2)
        );
        console.log(address(lpLocker), "LpLocker Address");

        // Whitelist the lpLocker as a depositor in feeLocker
        feeLocker.addDepositor(address(lpLocker));

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

      // Create locker config with single position
      int24[] memory tickLowers = new int24[](1);
      int24[] memory tickUppers = new int24[](1);
      uint16[] memory positionBps = new uint16[](1);
      tickLowers[0] = -230400;
      tickUppers[0] = 0;
      positionBps[0] = 10000; // 100% of tokens in this position

      address[] memory rewardAdmins = new address[](1);
      address[] memory rewardRecipients = new address[](1);
      uint16[] memory rewardBps = new uint16[](1);
      rewardAdmins[0] = msg.sender;
      rewardRecipients[0] = msg.sender;
      rewardBps[0] = 10000; // 100% of fees to creator

      IUniverseManager.LockerConfig memory lockerConfig = IUniverseManager.LockerConfig({
        locker: address(lpLocker),
        rewardAdmins: rewardAdmins,
        rewardRecipients: rewardRecipients,
        rewardBps: rewardBps,
        tickLower: tickLowers,
        tickUpper: tickUppers,
        positionBps: positionBps,
        lockerData: ""
      });

      IUniverseManager.DeploymentConfig memory deployConfig = IUniverseManager.DeploymentConfig({
        tokenConfig: tokenConfig,
        poolConfig: poolConfig,
        lockerConfig: lockerConfig
      });

      universeManager.setHook(address(loarHook), true);
      universeManager.setLocker(address(lpLocker), address(loarHook), true);
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

        // Create locker config with single position
        int24[] memory tickLowers = new int24[](1);
        int24[] memory tickUppers = new int24[](1);
        uint16[] memory positionBps = new uint16[](1);
        tickLowers[0] = -230400;
        tickUppers[0] = 0;
        positionBps[0] = 10000; // 100% of tokens in this position

        address[] memory rewardAdmins = new address[](1);
        address[] memory rewardRecipients = new address[](1);
        uint16[] memory rewardBps = new uint16[](1);
        rewardAdmins[0] = msg.sender;
        rewardRecipients[0] = msg.sender;
        rewardBps[0] = 10000; // 100% of fees to creator

        IUniverseManager.LockerConfig memory lockerConfig = IUniverseManager.LockerConfig({
            locker: address(lpLocker),
            rewardAdmins: rewardAdmins,
            rewardRecipients: rewardRecipients,
            rewardBps: rewardBps,
            tickLower: tickLowers,
            tickUpper: tickUppers,
            positionBps: positionBps,
            lockerData: ""
        });

        IUniverseManager.DeploymentConfig memory deployConfig = IUniverseManager.DeploymentConfig({
            tokenConfig: tokenConfig,
            poolConfig: poolConfig,
            lockerConfig: lockerConfig
        });

        universeManager.setHook(address(loarHook), true);
        universeManager.setLocker(address(lpLocker), address(loarHook), true);
        (uint id, ) = createUniverse();
        address tokenAddress = universeManager.deployUniverseToken(deployConfig, id);

        // NOTE: Liquidity is now automatically added by the lpLocker during deployUniverseToken
        // The test would require proper PositionManager and Permit2 setup to test swaps
        // For now, just verify token deployment succeeds
        assertNotEq(tokenAddress, address(0));

        // TODO: Add proper integration test with real PositionManager and Permit2
        // to test the full swap functionality with automatic liquidity provision
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
