// wagmi.config.ts
import { defineConfig } from '@wagmi/cli'
import type {Abi} from 'viem'
import { etherscan, react, foundry } from '@wagmi/cli/plugins'
import { mainnet, sepolia } from 'wagmi/chains'

import UniverseTokenDeployer from './apps/contracts/out/UniverseTokenDeployer.sol/UniverseTokenDeployer.json'
import UniverseManagerAbi from './apps/contracts/out/UniverseManager.sol/UniverseManager.json'
import LoarLpLockerMultiple from './apps/contracts/out/LoarLpLockerMultiple.sol/LoarLpLockerMultiple.json'
import Universe from './apps/contracts/out/Universe.sol/Universe.json'
import GovernanceERC20 from './apps/contracts/out/GovernanceERC20.sol/GovernanceERC20.json'
import UniverseGovernor from './apps/contracts/out/UniverseGovernor.sol/UniverseGovernor.json'
import LoarFeeLocker from './apps/contracts/out/LoarFeeLocker.sol/LoarFeeLocker.json'
import LoarHookStaticFee from './apps/contracts/out/LoarHookStaticFee.sol/LoarHookStaticFee.json'

export default defineConfig({
  out: 'packages/abis/src/generated.ts',
  contracts: [
    {
      name: 'UniverseTokenDeployer',
      abi: UniverseTokenDeployer.abi as Abi
    },
    {
      name: 'UniverseManager',
      abi: UniverseManagerAbi.abi as Abi
    },
    {
      name: 'LoarLpLockerMultiple',
      abi: LoarLpLockerMultiple.abi as Abi
    },
    {
      name: 'Universe',
      abi: Universe.abi as Abi
    },
    {
      name: 'GovernanceERC20',
      abi: GovernanceERC20.abi as Abi
    },
    {
      name: 'UniverseGovernor',
      abi: UniverseGovernor.abi as Abi
    },
    {
      name: 'LoarFeeLocker',
      abi: LoarFeeLocker.abi as Abi
    },
    {
      name: 'LoarHookStaticFee',
      abi: LoarHookStaticFee.abi as Abi
    }
  ],
  plugins:　[react({
    getHookName({contractName, itemName, type}){
      return `use${contractName}_${itemName}_${type}`
    }
  })]
})

