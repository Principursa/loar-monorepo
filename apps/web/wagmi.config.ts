import { defineConfig } from '@wagmi/cli'
import { etherscan, react ,foundry} from '@wagmi/cli/plugins'
import { erc20Abi } from 'viem'
import { mainnet, sepolia } from 'wagmi/chains'

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [],
  plugins: [react({
    getHookName({contractName,itemName, type}){
      return `use${contractName}__${itemName}__${type}`
    }
  }), foundry({
    project: "../contracts"
  })],
})

