import { Link } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { Button } from "@/components/ui/button";

import { ModeToggle } from "./mode-toggle";
// import { DynamicWalletButton } from "./dynamic-wallet-button";

export default function Header() {
  const { address: walletAddress, isConnected: isAuthenticated } = useAccount();
  const links = [
    { to: "/", label: "Home" },
    { to: "/universes", label: "Universes" },
    { to: "/wiki", label: "Characters" },
    { to: "/cinematicuniversecreate", label: "Create Universe" },
  ];

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          <div className="flex items-center gap-3">
            <img src="/loarlogo.svg" alt="LOAR Logo" className="h-10 w-50 object-contain" />
          </div>
          {links.map(({ to, label }) => {
            return (
              <Link
                key={to}
                to={to}
              >
                {label}
              </Link>
            );
          })}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <WalletConnectButton size="sm" />
              </div>
            ) : (
              <WalletConnectButton size="sm" />
            )}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {/* <DynamicWalletButton /> */}
        </div>
      </div>
      <hr />
    </div>
  );
}
