import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";

import { AlgorandWalletConnectors } from "@dynamic-labs/algorand";
import { BitcoinWalletConnectors } from "@dynamic-labs/bitcoin";
import { CosmosWalletConnectors } from "@dynamic-labs/cosmos";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { FlowWalletConnectors } from "@dynamic-labs/flow";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { StarknetWalletConnectors } from "@dynamic-labs/starknet";
import { SuiWalletConnectors } from "@dynamic-labs/sui";

export const DynamicProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID || "71c32f18-fd5d-4b01-8bfc-0c3be42ac705",
        walletConnectors: [
          AlgorandWalletConnectors,
          BitcoinWalletConnectors,
          CosmosWalletConnectors,
          EthereumWalletConnectors,
          FlowWalletConnectors,
          SolanaWalletConnectors,
          StarknetWalletConnectors,
          SuiWalletConnectors,
        ],
        eventsCallbacks: {
          onAuthSuccess: (args) => {
            console.log("Auth success:", args);
          },
          onAuthError: (args) => {
            console.error("Auth error:", args);
          },
          onUserProfileUpdate: (args) => {
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
