import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import Loader from "./components/loader";
import { routeTree } from "./routeTree.gen";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient, trpc } from "./utils/trpc";

import {
  DynamicContextProvider,
} from "@dynamic-labs/sdk-react-core";

import { AlgorandWalletConnectors } from "@dynamic-labs/algorand";
import { BitcoinWalletConnectors } from "@dynamic-labs/bitcoin";
import { CosmosWalletConnectors } from "@dynamic-labs/cosmos";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { FlowWalletConnectors } from "@dynamic-labs/flow";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { StarknetWalletConnectors } from "@dynamic-labs/starknet";
import { SuiWalletConnectors } from "@dynamic-labs/sui";
import { WagmiProvider } from "wagmi";
import {config, defaultChain} from "../config"

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPendingComponent: () => <Loader />,
  context: { trpc, queryClient },
  Wrap: function WrapComponent({ children }: { children: React.ReactNode }) {
    return (
      <DynamicContextProvider
        settings={{
          environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID || "71c32f18-fd5d-4b01-8bfc-0c3be42ac705",
          walletConnectors: [
            EthereumWalletConnectors, // Only include the connectors we need
          ],
          overrides: {
            evmNetworks: [
              // ONLY Sepolia - no mainnet!
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
          // Basic settings for local development
          debugError: true
        }}
      >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        </WagmiProvider>
      </DynamicContextProvider>
    );
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element not found");
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
