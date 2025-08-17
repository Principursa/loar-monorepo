import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight, Shield, Zap, Globe } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});


function HomeComponent() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());
  const { user, handleConnect } = useDynamicContext();

  console.log("HomeComponent render:", { user, hasHandleConnect: !!handleConnect });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="LOAR Logo"
            className="h-72 w-auto object-contain"
            onError={(e) => {
              // Fallback to text if logo doesn't load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <div className="hidden">
            <h1 className="text-6xl font-bold text-primary">LOAR</h1>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Welcome to LOAR</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Decentralized narrative control through NFT ownership and community governance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Authentication
            </CardTitle>
            <CardDescription>
              Connect with MetaMask, WalletConnect, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Connected: {user.wallets?.[0]?.address?.slice(0, 6)}...{user.wallets?.[0]?.address?.slice(-4)}
                </p>
                <Button asChild className="w-full">
                  <a href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            ) : (
              <Button onClick={handleConnect} className="w-full">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Secure & Reliable
            </CardTitle>
            <CardDescription>
              Built with modern security practices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Dynamic provides enterprise-grade wallet infrastructure with MPC technology and smart account support.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Lightning Fast
            </CardTitle>
            <CardDescription>
              Optimized for performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Built with Vite, React 19, and TanStack Router for the best developer and user experience.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            API Status
          </CardTitle>
          <CardDescription>
            Backend connection status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
            />
            <span className="text-sm text-muted-foreground">
              {healthCheck.isLoading
                ? "Checking connection..."
                : healthCheck.data
                  ? "Backend connected and ready"
                  : "Backend disconnected"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
