import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "./ui/button";
import { Wallet, LogOut } from "lucide-react";

export const DynamicWalletButton = () => {
  const { user, setShowDynamicUserProfile } = useDynamicContext();

  // Debug logging
  console.log("DynamicWalletButton render:", { user });

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {user.username || "Connected"}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("Show profile clicked");
            setShowDynamicUserProfile?.(true);
          }}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Profile
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => {
        console.log("Connect clicked - opening Dynamic widget");
        // The DynamicWidget should handle the connection
      }}
      className="flex items-center gap-2"
    >
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
};

