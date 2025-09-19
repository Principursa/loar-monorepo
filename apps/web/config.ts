import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, sepolia } from 'wagmi/chains'

// Set Sepolia as the default chain
export const defaultChain = sepolia

export const config = getDefaultConfig({
  appName: 'LOAR - AI Video Generation',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'default-project-id',
  chains: [sepolia, mainnet],
  ssr: false,
})
