// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {UniverseManager} from "../src/UniverseManager.sol";
import {UniverseTokenDeployer} from "../src/UniverseTokenDeployer.sol";
import {LoarFeeLocker} from "../src/LoarFeeLocker.sol";
import {LoarLpLockerMultiple} from "../src/lp-lockers/LoarLpLockerMultiple.sol";
import {LoarHookStaticFee} from "../src/hooks/LoarHookStaticFee.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {HookMiner} from "@uniswap/v4-periphery/src/utils/HookMiner.sol";

/**
 * @title DeployProtocol
 * @notice Deploys the entire Loar protocol infrastructure
 * @dev Before running, set these environment variables:
 *      - PRIVATE_KEY: Deployer private key
 *      - POOL_MANAGER: Uniswap v4 PoolManager address on Sepolia
 *      - POSITION_MANAGER: Uniswap v4 PositionManager address on Sepolia
 *      - PERMIT2: Permit2 address on Sepolia
 *      - WETH: WETH9 address on Sepolia
 *      - TEAM_FEE_RECIPIENT: Address to receive team fees
 *
 * Run with: forge script script/DeployProtocol.s.sol --rpc-url sepolia --broadcast --verify
 */
contract DeployProtocolScript is Script {
    UniverseManager public universeManager;
    UniverseTokenDeployer public tokenDeployer;
    LoarFeeLocker public feeLocker;
    LoarLpLockerMultiple public lpLocker;
    LoarHookStaticFee public hook;

    // Sepolia addresses - SET THESE BEFORE DEPLOYING
    address public poolManager = address(0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408);
    address public positionManager = address(0x4B2C77d209D3405F41a037Ec6c77F7F5b8e2ca80);
    address public permit2 = address(0x000000000022D473030F116dDEE9F6B43aC78BA3);
    address public weth = address(0x4200000000000000000000000000000000000006); 

    function setUp() public {}

    function getChainId() public view returns (uint256) {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        return chainId;
    }

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        address teamFeeRecipient = deployerAddress; // Default to deployer, can be changed later

        // Try to get addresses from env vars, fallback to hardcoded
        if (vm.envOr("POOL_MANAGER", address(0)) != address(0)) {
            poolManager = vm.envAddress("POOL_MANAGER");
        }
        if (vm.envOr("POSITION_MANAGER", address(0)) != address(0)) {
            positionManager = vm.envAddress("POSITION_MANAGER");
        }
        if (vm.envOr("PERMIT2", address(0)) != address(0)) {
            permit2 = vm.envAddress("PERMIT2");
        }
        if (vm.envOr("WETH", address(0)) != address(0)) {
            weth = vm.envAddress("WETH");
        }
        if (vm.envOr("TEAM_FEE_RECIPIENT", address(0)) != address(0)) {
            teamFeeRecipient = vm.envAddress("TEAM_FEE_RECIPIENT");
        }

        // Validate required addresses
        require(poolManager != address(0), "POOL_MANAGER not set");
        require(positionManager != address(0), "POSITION_MANAGER not set");
        require(permit2 != address(0), "PERMIT2 not set");
        require(weth != address(0), "WETH not set");

        console.log("=== Deployment Configuration ===");
        console.log("Deployer address:", deployerAddress);
        console.log("Deployer balance:", deployerAddress.balance);
        console.log("ChainId:", getChainId());
        console.log("PoolManager:", poolManager);
        console.log("PositionManager:", positionManager);
        console.log("Permit2:", permit2);
        console.log("WETH:", weth);
        console.log("Team Fee Recipient:", teamFeeRecipient);
        console.log("\n=== Starting Deployment ===\n");

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy UniverseManager
        console.log("1/6 Deploying UniverseManager...");
        universeManager = new UniverseManager(teamFeeRecipient);
        console.log("   UniverseManager deployed at:", address(universeManager));

        // 2. Deploy UniverseTokenDeployer
        console.log("2/6 Deploying UniverseTokenDeployer...");
        tokenDeployer = new UniverseTokenDeployer(address(universeManager));
        console.log("   UniverseTokenDeployer deployed at:", address(tokenDeployer));

        // 3. Set TokenDeployer on UniverseManager
        console.log("3/6 Setting TokenDeployer on UniverseManager...");
        universeManager.setTokenDeployer(address(tokenDeployer));
        console.log("   TokenDeployer set successfully");

        // 4. Deploy FeeLocker
        console.log("4/6 Deploying LoarFeeLocker...");
        feeLocker = new LoarFeeLocker(deployerAddress);
        console.log("   LoarFeeLocker deployed at:", address(feeLocker));

        // 5. Deploy LpLocker
        console.log("5/6 Deploying LoarLpLockerMultiple...");
        lpLocker = new LoarLpLockerMultiple(
            deployerAddress, // owner
            address(universeManager), // factory
            address(feeLocker),
            positionManager,
            permit2
        );
        console.log("   LoarLpLockerMultiple deployed at:", address(lpLocker));

        // 6. Deploy Hook with deterministic address using CREATE2
        console.log("6/6 Deploying LoarHookStaticFee...");

        // Calculate the required hook address flags
        uint160 flags = uint160(
            Hooks.BEFORE_INITIALIZE_FLAG |
            Hooks.BEFORE_ADD_LIQUIDITY_FLAG |
            Hooks.BEFORE_SWAP_FLAG |
            Hooks.AFTER_SWAP_FLAG |
            Hooks.BEFORE_SWAP_RETURNS_DELTA_FLAG |
            Hooks.AFTER_SWAP_RETURNS_DELTA_FLAG
        );

        console.log("   Mining for hook address with correct flags...");
        console.log("   Required flags:", uint256(flags));

        // Use HookMiner to find the correct salt for CREATE2 deployment
        bytes memory constructorArgs = abi.encode(poolManager, address(universeManager), weth);
        (address hookAddress, bytes32 salt) = HookMiner.find(
            0x4e59b44847b379578588920cA78FbF26c0B4956C, // CREATE2_DEPLOYER
            flags,
            type(LoarHookStaticFee).creationCode,
            constructorArgs
        );

        console.log("   Found valid salt:", uint256(salt));
        console.log("   Expected hook address:", hookAddress);

        // Deploy hook with the mined salt
        hook = new LoarHookStaticFee{salt: salt}(
            poolManager,
            address(universeManager),
            weth
        );

        require(address(hook) == hookAddress, "Hook address mismatch");
        console.log("   LoarHookStaticFee deployed at:", address(hook));

        // 5. Configure protocol relationships
        console.log("\n=== Configuring Protocol ===\n");

        console.log("Adding lpLocker as depositor in feeLocker...");
        feeLocker.addDepositor(address(lpLocker));

        console.log("Enabling hook in universeManager...");
        universeManager.setHook(address(hook), true);

        console.log("Enabling locker for hook in universeManager...");
        universeManager.setLocker(address(lpLocker), address(hook), true);

        vm.stopBroadcast();

        console.log("\n=== Deployment Complete ===\n");
        console.log("UniverseManager:", address(universeManager));
        console.log("UniverseTokenDeployer:", address(tokenDeployer));
        console.log("LoarFeeLocker:", address(feeLocker));
        console.log("LoarLpLockerMultiple:", address(lpLocker));
        console.log("LoarHookStaticFee:", address(hook));
        console.log("\n=== Next Steps ===");
        console.log("1. Verify contracts on Etherscan");
        console.log("2. Transfer ownership if needed");
        console.log("3. Deploy additional hooks/lockers if needed");
        console.log("4. Test universe creation");
    }
}
