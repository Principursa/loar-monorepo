// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {LoarHookStaticFee} from "../src/hooks/LoarHookStaticFee.sol";
import {UniverseManager} from "../src/UniverseManager.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {HookMiner} from "@uniswap/v4-periphery/src/utils/HookMiner.sol";

/**
 * @title DeployHook
 * @notice Deploys a new Loar hook and optionally registers it with UniverseManager
 * @dev Before running, set these environment variables:
 *      - PRIVATE_KEY: Deployer private key
 *      - POOL_MANAGER: Uniswap v4 PoolManager address on Sepolia
 *      - UNIVERSE_MANAGER: UniverseManager address (if registering)
 *      - WETH: WETH9 address on Sepolia
 *      - REGISTER_HOOK: Set to "true" to register with UniverseManager
 *
 * Run with: forge script script/DeployHook.s.sol --rpc-url sepolia --broadcast --verify
 */
contract DeployHookScript is Script {
    LoarHookStaticFee public hook;

    // Sepolia addresses - SET THESE BEFORE DEPLOYING
    address public poolManager = address(0); // TODO: Fill in Uniswap v4 PoolManager
    address public universeManager = address(0); // Optional: Fill to register hook
    address public weth = address(0); // TODO: Fill in WETH9

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

        // Try to get addresses from env vars
        if (vm.envOr("POOL_MANAGER", address(0)) != address(0)) {
            poolManager = vm.envAddress("POOL_MANAGER");
        }
        if (vm.envOr("UNIVERSE_MANAGER", address(0)) != address(0)) {
            universeManager = vm.envAddress("UNIVERSE_MANAGER");
        }
        if (vm.envOr("WETH", address(0)) != address(0)) {
            weth = vm.envAddress("WETH");
        }

        bool registerHook = vm.envOr("REGISTER_HOOK", false);

        // Validate required addresses
        require(poolManager != address(0), "POOL_MANAGER not set");
        require(weth != address(0), "WETH not set");
        if (registerHook) {
            require(universeManager != address(0), "UNIVERSE_MANAGER not set for registration");
        }

        console.log("=== Hook Deployment Configuration ===");
        console.log("Deployer address:", deployerAddress);
        console.log("Deployer balance:", deployerAddress.balance);
        console.log("ChainId:", getChainId());
        console.log("PoolManager:", poolManager);
        console.log("WETH:", weth);
        if (registerHook) {
            console.log("UniverseManager:", universeManager);
            console.log("Will register hook: true");
        }
        console.log("\n=== Starting Deployment ===\n");

        vm.startBroadcast(deployerPrivateKey);

        // Calculate the required hook address flags
        uint160 flags = uint160(
            Hooks.BEFORE_INITIALIZE_FLAG |
            Hooks.BEFORE_ADD_LIQUIDITY_FLAG |
            Hooks.BEFORE_SWAP_FLAG |
            Hooks.AFTER_SWAP_FLAG |
            Hooks.BEFORE_SWAP_RETURNS_DELTA_FLAG |
            Hooks.AFTER_SWAP_RETURNS_DELTA_FLAG
        );

        console.log("Deploying LoarHookStaticFee...");
        console.log("Required hook flags:", uint256(flags));
        console.log("Mining for hook address with correct flags...");

        // Use HookMiner to find the correct salt for CREATE2 deployment
        bytes memory constructorArgs = abi.encode(poolManager, universeManager, weth);
        (address hookAddress, bytes32 salt) = HookMiner.find(
            0x4e59b44847b379578588920cA78FbF26c0B4956C, // CREATE2_DEPLOYER
            flags,
            type(LoarHookStaticFee).creationCode,
            constructorArgs
        );

        console.log("Found valid salt:", uint256(salt));
        console.log("Expected hook address:", hookAddress);

        // Deploy hook with the mined salt
        hook = new LoarHookStaticFee{salt: salt}(
            poolManager,
            universeManager,
            weth
        );

        require(address(hook) == hookAddress, "Hook address mismatch");
        console.log("LoarHookStaticFee deployed at:", address(hook));

        // Register hook with UniverseManager if requested
        if (registerHook) {
            console.log("\nRegistering hook with UniverseManager...");
            UniverseManager(universeManager).setHook(address(hook), true);
            console.log("Hook registered successfully");
        }

        vm.stopBroadcast();

        console.log("\n=== Deployment Complete ===\n");
        console.log("LoarHookStaticFee:", address(hook));
        console.log("\n=== Next Steps ===");
        if (!registerHook) {
            console.log("1. Register hook with UniverseManager.setHook()");
        }
        console.log("2. Enable lockers for this hook");
        console.log("3. Verify contract on Etherscan");
    }
}
