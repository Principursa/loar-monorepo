import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

// Set Sepolia as the default chain
export const defaultChain = sepolia

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
export const config = createConfig({
  chains: [sepolia], // Only include Sepolia
  transports: {
    [sepolia.id]: http(),
  },
})
