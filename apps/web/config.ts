import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, sepolia, baseSepolia } from 'wagmi/chains'

// Set Base Sepolia as the default chain (better Uniswap V4 support than Sepolia)
export const defaultChain = baseSepolia

export const config = getDefaultConfig({
  appName: 'LOAR - AI Video Generation',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'default-project-id',
  chains: [baseSepolia, sepolia, mainnet],
  ssr: false,
})
