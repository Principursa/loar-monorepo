import { createConfig, factory } from "ponder";
import { parseAbiItem } from "viem";
import { universeManagerAbi, universeAbi, universeGovernorAbi } from "@loar/abis/generated"
import { PoolManagerAbi } from "./abis/PoolManager";
import { ERC20Abi } from "./abis/ERC20Abi";
import { sepolia } from "viem/chains";
import UniverseManagerDeploy from "../contracts/broadcast/DeployProtocol.s.sol/11155111/run-latest.json"
import { getAddress, hexToNumber } from "viem/utils";

const address = getAddress(UniverseManagerDeploy.transactions[0]!.contractAddress);
const startBlock = hexToNumber(UniverseManagerDeploy.receipts[0]!.blockNumber);

const universeCreatedEvent = parseAbiItem(
  "event UniverseCreated(address universe, address creator)"
);

const tokenCreatedEvent = parseAbiItem(
  "event TokenCreated(address indexed msgSender, address indexed tokenAddress, address indexed tokenAdmin, string tokenImage, string tokenName, string tokenSymbol, string tokenMetadata, string tokenContext, int24 startingTick, address poolHook, bytes32 poolId, address pairedToken, address locker, address governor)"
);

export default createConfig({
  chains: {
    sepolia: {
      id: 11155111,
      rpc: process.env.PONDER_RPC_URL_2!,
      maxRequestsPerSecond: 5,
    }
  },
  contracts: {
    UniverseManager: {
      chain: "sepolia",
      abi: universeManagerAbi,
      address: address,
      startBlock: startBlock,
    },
    Universe: {
      chain: "sepolia",
      abi: universeAbi,
      address: factory({
        address: address,
        event: universeCreatedEvent,
        parameter: "universe",
      }),
      startBlock: startBlock,
    },
    UniverseGovernor: {
      chain: "sepolia",
      abi: universeGovernorAbi,
      address: factory({
        address: address,
        event: tokenCreatedEvent,
        parameter: "governor",
      }),
      startBlock: startBlock,
    },
    GovernanceToken: {
      chain: "sepolia",
      abi: ERC20Abi,
      address: factory({
        address: address,
        event: tokenCreatedEvent,
        parameter: "tokenAddress",
      }),
      startBlock: startBlock,
    },
    PoolManager: {
      chain: "sepolia",
      abi: PoolManagerAbi,
      address: "0xE03A1074c86CFeDd5C142C4F04F1a1536e203543",
      startBlock: startBlock,
    },
  },
});
