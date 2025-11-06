// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {LoarLpLockerMultiple} from "../src/lp-lockers/LoarLpLockerMultiple.sol";
import {LoarFeeLocker} from "../src/LoarFeeLocker.sol";
import {UniverseManager} from "../src/UniverseManager.sol";

/**
 * @title DeployLocker
 * @notice Deploys a new LP locker and optionally registers it with UniverseManager
 * @dev Before running, set these environment variables:
 *      - PRIVATE_KEY: Deployer private key
 *      - UNIVERSE_MANAGER: UniverseManager address
 *      - FEE_LOCKER: LoarFeeLocker address
 *      - POSITION_MANAGER: Uniswap v4 PositionManager address on Sepolia
 *      - PERMIT2: Permit2 address on Sepolia
 *      - HOOK_ADDRESS: Hook address to register locker with (optional)
 *      - REGISTER_LOCKER: Set to "true" to register with UniverseManager
 *      - ADD_AS_DEPOSITOR: Set to "true" to add as FeeLocker depositor
 *
 * Run with: forge script script/DeployLocker.s.sol --rpc-url sepolia --broadcast --verify
 */
contract DeployLockerScript is Script {
    LoarLpLockerMultiple public lpLocker;

    // Sepolia addresses - SET THESE BEFORE DEPLOYING
    address public universeManager = address(0); // TODO: Fill in UniverseManager
    address public feeLocker = address(0); // TODO: Fill in LoarFeeLocker
    address public positionManager = address(0); // TODO: Fill in Uniswap v4 PositionManager
    address public permit2 = address(0); // TODO: Fill in Permit2
    address public hookAddress = address(0); // Optional: Hook to register with

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
        if (vm.envOr("UNIVERSE_MANAGER", address(0)) != address(0)) {
            universeManager = vm.envAddress("UNIVERSE_MANAGER");
        }
        if (vm.envOr("FEE_LOCKER", address(0)) != address(0)) {
            feeLocker = vm.envAddress("FEE_LOCKER");
        }
        if (vm.envOr("POSITION_MANAGER", address(0)) != address(0)) {
            positionManager = vm.envAddress("POSITION_MANAGER");
        }
        if (vm.envOr("PERMIT2", address(0)) != address(0)) {
            permit2 = vm.envAddress("PERMIT2");
        }
        if (vm.envOr("HOOK_ADDRESS", address(0)) != address(0)) {
            hookAddress = vm.envAddress("HOOK_ADDRESS");
        }

        bool registerLocker = vm.envOr("REGISTER_LOCKER", false);
        bool addAsDepositor = vm.envOr("ADD_AS_DEPOSITOR", false);

        // Validate required addresses
        require(universeManager != address(0), "UNIVERSE_MANAGER not set");
        require(feeLocker != address(0), "FEE_LOCKER not set");
        require(positionManager != address(0), "POSITION_MANAGER not set");
        require(permit2 != address(0), "PERMIT2 not set");

        if (registerLocker) {
            require(hookAddress != address(0), "HOOK_ADDRESS not set for registration");
        }

        console.log("=== Locker Deployment Configuration ===");
        console.log("Deployer address:", deployerAddress);
        console.log("Deployer balance:", deployerAddress.balance);
        console.log("ChainId:", getChainId());
        console.log("UniverseManager:", universeManager);
        console.log("FeeLocker:", feeLocker);
        console.log("PositionManager:", positionManager);
        console.log("Permit2:", permit2);
        if (registerLocker) {
            console.log("Hook Address:", hookAddress);
            console.log("Will register locker: true");
        }
        if (addAsDepositor) {
            console.log("Will add as FeeLocker depositor: true");
        }
        console.log("\n=== Starting Deployment ===\n");

        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying LoarLpLockerMultiple...");
        lpLocker = new LoarLpLockerMultiple(
            deployerAddress, // owner
            universeManager, // factory
            feeLocker,
            positionManager,
            permit2
        );
        console.log("LoarLpLockerMultiple deployed at:", address(lpLocker));

        // Add locker as depositor to FeeLocker if requested
        if (addAsDepositor) {
            console.log("\nAdding locker as FeeLocker depositor...");
            LoarFeeLocker(feeLocker).addDepositor(address(lpLocker));
            console.log("Locker added as depositor successfully");
        }

        // Register locker with UniverseManager if requested
        if (registerLocker) {
            console.log("\nRegistering locker with UniverseManager for hook...");
            UniverseManager(universeManager).setLocker(address(lpLocker), hookAddress, true);
            console.log("Locker registered successfully");
        }

        vm.stopBroadcast();

        console.log("\n=== Deployment Complete ===\n");
        console.log("LoarLpLockerMultiple:", address(lpLocker));
        console.log("\n=== Next Steps ===");
        if (!addAsDepositor) {
            console.log("1. Add locker as depositor: FeeLocker.addDepositor()");
        }
        if (!registerLocker) {
            console.log("2. Register locker: UniverseManager.setLocker()");
        }
        console.log("3. Verify contract on Etherscan");
        console.log("4. Test locker functionality");
    }
}
