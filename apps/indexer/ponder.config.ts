import { createConfig, factory } from "ponder";
import { parseAbiItem } from "viem";
import { universeManagerAbi, universeAbi, universeGovernorAbi } from "@loar/abis/generated"
import { PoolManagerAbi } from "./abis/PoolManager";
import { ERC20Abi } from "./abis/ERC20Abi";
import { sepolia, baseSepolia } from "viem/chains";
import UniverseManagerDeploySepolia from "../contracts/broadcast/DeployProtocol.s.sol/11155111/run-latest.json"
import UniverseManagerDeployBaseSepolia from "../contracts/broadcast/DeployProtocol.s.sol/84532/run-latest.json"
import { getAddress, hexToNumber } from "viem/utils";

// Sepolia config
const sepoliaAddress = getAddress(UniverseManagerDeploySepolia.transactions[0]!.contractAddress);
const sepoliaStartBlock = hexToNumber(UniverseManagerDeploySepolia.receipts[0]!.blockNumber);

// Base Sepolia config
const baseSepoliaAddress = getAddress(UniverseManagerDeployBaseSepolia.transactions[0]!.contractAddress);
const baseSepoliaStartBlock = hexToNumber(UniverseManagerDeployBaseSepolia.receipts[0]!.blockNumber);

const universeCreatedEvent = parseAbiItem(
  "event UniverseCreated(address universe, address creator)"
);

const tokenCreatedEvent = parseAbiItem(
  "event TokenCreated(address indexed msgSender, address indexed tokenAddress, address indexed tokenAdmin, string tokenImage, string tokenName, string tokenSymbol, string tokenMetadata, string tokenContext, int24 startingTick, address poolHook, bytes32 poolId, address pairedToken, address locker, address governor)"
);

export default createConfig({
  chains: {
    baseSepolia: {
      id: 84532,
      rpc: process.env.BASE_SEPOLIA_RPC_URL!,
      maxRequestsPerSecond: 10,
    },
    sepolia: {
      id: 11155111,
      rpc: process.env.PONDER_RPC_URL_2!,
      maxRequestsPerSecond: 2,
    }
  },
  contracts: {
    UniverseManager: {
      chain: {
        baseSepolia: {
          address: baseSepoliaAddress,
          startBlock: baseSepoliaStartBlock,
        },
        sepolia: {
          address: sepoliaAddress,
          startBlock: sepoliaStartBlock,
        },
      },
      abi: universeManagerAbi,
    },
    Universe: {
      chain: {
        baseSepolia: {
          address: factory({
            address: baseSepoliaAddress,
            event: universeCreatedEvent,
            parameter: "universe",
            startBlock: baseSepoliaStartBlock,
          }),
          startBlock: baseSepoliaStartBlock,
        },
        sepolia: {
          address: factory({
            address: sepoliaAddress,
            event: universeCreatedEvent,
            parameter: "universe",
            startBlock: sepoliaStartBlock,
          }),
          startBlock: sepoliaStartBlock,
        },
      },
      abi: universeAbi,
    },
    UniverseGovernor: {
      chain: {
        baseSepolia: {
          address: factory({
            address: baseSepoliaAddress,
            event: tokenCreatedEvent,
            parameter: "governor",
            startBlock: baseSepoliaStartBlock,
          }),
          startBlock: baseSepoliaStartBlock,
        },
        sepolia: {
          address: factory({
            address: sepoliaAddress,
            event: tokenCreatedEvent,
            parameter: "governor",
            startBlock: sepoliaStartBlock,
          }),
          startBlock: sepoliaStartBlock,
        },
      },
      abi: universeGovernorAbi,
    },
    GovernanceToken: {
      chain: {
        baseSepolia: {
          address: factory({
            address: baseSepoliaAddress,
            event: tokenCreatedEvent,
            parameter: "tokenAddress",
            startBlock: baseSepoliaStartBlock,
          }),
          startBlock: baseSepoliaStartBlock,
        },
        sepolia: {
          address: factory({
            address: sepoliaAddress,
            event: tokenCreatedEvent,
            parameter: "tokenAddress",
            startBlock: sepoliaStartBlock,
          }),
          startBlock: sepoliaStartBlock,
        },
      },
      abi: ERC20Abi,
    },
    PoolManager: {
      chain: {
        baseSepolia: {
          address: "0x7Da1D65F8B249183667cdE74C5CBD46dD38AA829", // Base Sepolia PoolManager
          startBlock: baseSepoliaStartBlock,
        },
        sepolia: {
          address: "0xE03A1074c86CFeDd5C142C4F04F1a1536e203543",
          startBlock: sepoliaStartBlock,
        },
      },
      abi: PoolManagerAbi,
    },
  },
});
