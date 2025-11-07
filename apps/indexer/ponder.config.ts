import { createConfig } from "ponder";
import {universeManagerAbi} from "@loar/abis/generated"
import {UniverseManager} from "@loar/abis/addresses"
import { sepolia } from "viem/chains";
import UniverseManagerDeploy from "../contracts/broadcast/DeployProtocol.s.sol/11155111/run-latest.json"
import { getAddress, hexToNumber } from "viem/utils";

const address = getAddress(UniverseManagerDeploy.transactions[0]!.contractAddress);
const startBlock = hexToNumber(UniverseManagerDeploy.receipts[0]!.blockNumber); 

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
  },
});
