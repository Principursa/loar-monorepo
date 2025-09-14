import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

export const DynamicProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID || "71c32f18-fd5d-4b01-8bfc-0c3be42ac705",
        walletConnectors: [
          EthereumWalletConnectors,
        ],
        overrides: {
          evmNetworks: [
            {
              blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              chainId: 11155111,
              chainName: 'Sepolia Testnet',
              iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
              name: 'Sepolia',
              nativeCurrency: {
                decimals: 18,
                name: 'Sepolia Ether',
                symbol: 'ETH',
              },
              networkId: 11155111,
              rpcUrls: [
                'https://rpc.sepolia.org',
                'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
                'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
              ],
              vanityName: 'Sepolia',
            },
          ],
        },
        events: {
          onAuthSuccess: (args: any) => {
            console.log("Auth success:", args);
          },
          onAuthFailure: (args: any) => {
            console.error("Auth error:", args);
          },
          onUserProfileUpdate: (args: any) => {
            console.log("User profile updated:", args);
          },
        },
      }}
    >
      {children}
      <DynamicWidget />
    </DynamicContextProvider>
  );
};
