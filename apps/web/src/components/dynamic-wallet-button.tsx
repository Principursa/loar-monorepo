import { useDynamicContext } from "@dynamic-labs/sdk-react";
import { Button } from "./ui/button";
import { Wallet, LogOut } from "lucide-react";

export const DynamicWalletButton = () => {
  const { handleConnect, handleDisconnect, user, isConnecting } = useDynamicContext();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {user.wallets?.[0]?.address?.slice(0, 6)}...{user.wallets?.[0]?.address?.slice(-4)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex items-center gap-2"
    >
      <Wallet className="h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
};

