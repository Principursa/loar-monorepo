import { DynamicContextProvider } from "@dynamic-labs/sdk-react";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

export const DynamicProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID || "REPLACE_WITH_YOUR_ENVIRONMENT_ID",
        walletConnectors: [EthereumWalletConnectors],
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
    </DynamicContextProvider>
  );
};
