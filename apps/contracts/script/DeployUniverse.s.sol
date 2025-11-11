// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {UniverseManager} from "../src/UniverseManager.sol";
import {IUniverseManager} from "../src/interfaces/IUniverseManager.sol";
import {ILoarHookStaticFee} from "../src/interfaces/ILoarHookStaticFee.sol";
import {NodeCreationOptions, NodeVisibilityOptions} from "../src/libraries/NodeOptions.sol";

/**
 * @title DeployUniverse
 * @notice Creates a new universe with token deployment and liquidity
 * @dev Before running, set these environment variables:
 *      - PRIVATE_KEY: Deployer private key
 *      - UNIVERSE_MANAGER: UniverseManager address
 *      - HOOK_ADDRESS: Hook address to use
 *      - LOCKER_ADDRESS: Locker address to use
 *      - PAIRED_TOKEN: Address of paired token (e.g., WETH)
 *      - UNIVERSE_NAME: Name of the universe
 *      - UNIVERSE_IMAGE: Image URL for the universe
 *      - UNIVERSE_DESCRIPTION: Description of the universe
 *      - TOKEN_NAME: Name of the universe token
 *      - TOKEN_SYMBOL: Symbol of the universe token
 *      - TOKEN_IMAGE: Image URL for the token
 *      - STARTING_TICK: Starting tick for liquidity (default: -230400)
 *      - TICK_SPACING: Tick spacing (default: 200)
 *      - LOAR_FEE: Fee for loar token swaps in bps (default: 3000 = 0.3%)
 *      - PAIRED_FEE: Fee for paired token swaps in bps (default: 3000 = 0.3%)
 *
 * Run with: forge script script/DeployUniverse.s.sol --rpc-url sepolia --broadcast
 */
contract DeployUniverseScript is Script {
    UniverseManager public universeManager;

    // Required addresses - SET THESE BEFORE DEPLOYING
    address public universeManagerAddress = address(0xAbDb2f18a4Fe97B105B221b8337C2Fa7F8DF9D5E); // TODO: Fill in UniverseManager
    address public hookAddress = address(0xd054f8C814A9F742A0ca003923d46a4895FdE8CC); // TODO: Fill in Hook
    address public lockerAddress = address(0x6a94ce65c55CC769FB0cA586677F8eCcF736b17E); // TODO: Fill in Locker
    address public pairedToken = address(0x4200000000000000000000000000000000000006); // TODO: Fill in WETH or other paired token

    // Configuration
    string public universeName = "Naruto";
    string public universeImage = "https://cdn.mos.cms.futurecdn.net/Hpq4NZjKWjHRRyH9bt3Z2e-1200-80.jpg.webp";
    string public universeDescription = "Naruto, born with a sealed demon fox, becomes a ninja alongside friend Sasuke";
    string public tokenName = "Naruto";
    string public tokenSymbol = "NTO";
    string public tokenImage = "https://cdn.mos.cms.futurecdn.net/Hpq4NZjKWjHRRyH9bt3Z2e-1200-80.jpg.webp";
    int24 public startingTick = -115000;
    int24 public tickSpacing = 200;
    uint24 public loarFee = 3000; // 0.3%
    uint24 public pairedFee = 3000; // 0.3%

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
            universeManagerAddress = vm.envAddress("UNIVERSE_MANAGER");
        }
        if (vm.envOr("HOOK_ADDRESS", address(0)) != address(0)) {
            hookAddress = vm.envAddress("HOOK_ADDRESS");
        }
        if (vm.envOr("LOCKER_ADDRESS", address(0)) != address(0)) {
            lockerAddress = vm.envAddress("LOCKER_ADDRESS");
        }
        if (vm.envOr("PAIRED_TOKEN", address(0)) != address(0)) {
            pairedToken = vm.envAddress("PAIRED_TOKEN");
        }

        // Get configuration from env vars if available
        if (bytes(vm.envOr("UNIVERSE_NAME", string(""))).length > 0) {
            universeName = vm.envString("UNIVERSE_NAME");
        }
        if (bytes(vm.envOr("UNIVERSE_IMAGE", string(""))).length > 0) {
            universeImage = vm.envString("UNIVERSE_IMAGE");
        }
        if (bytes(vm.envOr("UNIVERSE_DESCRIPTION", string(""))).length > 0) {
            universeDescription = vm.envString("UNIVERSE_DESCRIPTION");
        }
        if (bytes(vm.envOr("TOKEN_NAME", string(""))).length > 0) {
            tokenName = vm.envString("TOKEN_NAME");
        }
        if (bytes(vm.envOr("TOKEN_SYMBOL", string(""))).length > 0) {
            tokenSymbol = vm.envString("TOKEN_SYMBOL");
        }
        if (bytes(vm.envOr("TOKEN_IMAGE", string(""))).length > 0) {
            tokenImage = vm.envString("TOKEN_IMAGE");
        }
        if (vm.envOr("STARTING_TICK", int24(0)) != 0) {
            startingTick = int24(vm.envInt("STARTING_TICK"));
        }
        if (vm.envOr("TICK_SPACING", int24(0)) != 0) {
            tickSpacing = int24(vm.envInt("TICK_SPACING"));
        }
        if (vm.envOr("LOAR_FEE", uint24(0)) != 0) {
            loarFee = uint24(vm.envUint("LOAR_FEE"));
        }
        if (vm.envOr("PAIRED_FEE", uint24(0)) != 0) {
            pairedFee = uint24(vm.envUint("PAIRED_FEE"));
        }

        // Validate required addresses
        require(universeManagerAddress != address(0), "UNIVERSE_MANAGER not set");
        require(hookAddress != address(0), "HOOK_ADDRESS not set");
        require(lockerAddress != address(0), "LOCKER_ADDRESS not set");
        require(pairedToken != address(0), "PAIRED_TOKEN not set");

        universeManager = UniverseManager(universeManagerAddress);

        console.log("=== Universe Deployment Configuration ===");
        console.log("Deployer address:", deployerAddress);
        console.log("Deployer balance:", deployerAddress.balance);
        console.log("ChainId:", getChainId());
        console.log("UniverseManager:", universeManagerAddress);
        console.log("Hook:", hookAddress);
        console.log("Locker:", lockerAddress);
        console.log("Paired Token:", pairedToken);
        console.log("\n--- Universe Config ---");
        console.log("Name:", universeName);
        console.log("Description:", universeDescription);
        console.log("\n--- Token Config ---");
        console.log("Name:", tokenName);
        console.log("Symbol:", tokenSymbol);
        console.log("\n--- Pool Config ---");
        console.log("Starting Tick:", uint256(uint24(startingTick)));
        console.log("Tick Spacing:", uint256(uint24(tickSpacing)));
        console.log("Loar Fee (bps):", loarFee);
        console.log("Paired Fee (bps):", pairedFee);
        console.log("\n=== Starting Deployment ===\n");

        vm.startBroadcast(deployerPrivateKey);

        // 1. Create Universe
        console.log("1/2 Creating Universe...");
        (uint256 universeId, address universeAddress) = universeManager.createUniverse(
            universeName,
            universeImage,
            universeDescription,
            NodeCreationOptions.PUBLIC,
            NodeVisibilityOptions.PUBLIC,
            deployerAddress // Universe owner
        );
        console.log("   Universe created at:", universeAddress);
        console.log("   Universe ID:", universeId);

        // 2. Deploy Universe Token with liquidity
        console.log("2/2 Deploying Universe Token...");

        // Prepare token config
        IUniverseManager.TokenConfig memory tokenConfig = IUniverseManager.TokenConfig({
            tokenAdmin: deployerAddress,
            name: tokenName,
            symbol: tokenSymbol,
            imageURL: tokenImage,
            metadata: string(abi.encodePacked('{"description":"', universeDescription, '"}')),
            context: string(abi.encodePacked('{"interface":"loar.fun","platform":"","messageId":""}'))
        });

        // Prepare pool config with fee configuration
        bytes memory poolData = abi.encode(
            ILoarHookStaticFee.PoolStaticConfigVars({
                loarFee: loarFee,
                pairedFee: pairedFee
            })
        );

        IUniverseManager.PoolConfig memory poolConfig = IUniverseManager.PoolConfig({
            hook: hookAddress,
            pairedToken: pairedToken,
            tickIfToken0IsLoar: startingTick,
            tickSpacing: tickSpacing,
            poolData: poolData
        });

        // Prepare locker config (single position, 100% liquidity, 100% fees to creator)
        int24[] memory tickLowers = new int24[](1);
        int24[] memory tickUppers = new int24[](1);
        uint16[] memory positionBps = new uint16[](1);
        tickLowers[0] = startingTick;
        tickUppers[0] = 0; // Up to current price
        positionBps[0] = 10000; // 100% of tokens

        address[] memory rewardAdmins = new address[](1);
        address[] memory rewardRecipients = new address[](1);
        uint16[] memory rewardBps = new uint16[](1);
        rewardAdmins[0] = deployerAddress;
        rewardRecipients[0] = deployerAddress;
        rewardBps[0] = 10000; // 100% of fees

        IUniverseManager.LockerConfig memory lockerConfig = IUniverseManager.LockerConfig({
            locker: lockerAddress,
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

        address tokenAddress = universeManager.deployUniverseToken(deployConfig, universeId);
        console.log("   Token deployed at:", tokenAddress);

        vm.stopBroadcast();

        console.log("\n=== Deployment Complete ===\n");
        console.log("Universe ID:", universeId);
        console.log("Universe Address:", universeAddress);
        console.log("Token Address:", tokenAddress);
        console.log("\n=== Universe Details ===");
        console.log("Name:", universeName);
        console.log("Token:", tokenName);
        console.log("Symbol:", tokenSymbol);
        console.log("Owner:", deployerAddress);
        console.log("\n=== Next Steps ===");
        console.log("1. Verify token contract on Etherscan");
        console.log("2. Test swapping in the pool");
        console.log("3. Share universe with your community");
        console.log("4. Monitor trading fees accumulation");
    }
}
