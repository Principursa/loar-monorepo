import { Link } from "@tanstack/react-router";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/universes", label: "Universes" },
    { to: "/cinematicuniversecreate", label: "Create Universe" },
  ];

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <img src="/loarlogo.svg" alt="LOAR Logo" className="h-10 w-auto object-contain" />
            </div>
            <nav className="hidden md:flex items-center gap-6">
              {links.map(({ to, label }) => {
                return (
                  <Link
                    key={to}
                    to={to}
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side - Wallet and Theme Toggle */}
          <div className="flex items-center gap-3">
            <WalletConnectButton size="sm" />
            <ModeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex flex-wrap gap-4">
          {links.map(({ to, label }) => {
            return (
              <Link
                key={to}
                to={to}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
