import { useDynamicContext } from "@dynamic-labs/sdk-react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, isConnecting, handleConnect } = useDynamicContext();
  const navigate = Route.useNavigate();

  useEffect(() => {
    if (!user && !isConnecting) {
      navigate({
        to: "/",
      });
    }
  }, [user, isConnecting, navigate]);

  const copyAddress = () => {
    if (user?.wallets?.[0]?.address) {
      navigator.clipboard.writeText(user.wallets[0].address);
    }
  };

  const openExplorer = () => {
    if (user?.wallets?.[0]?.address) {
      window.open(`https://etherscan.io/address/${user.wallets[0].address}`, '_blank');
    }
  };

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Connecting wallet...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleConnect} className="w-full">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Information
            </CardTitle>
            <CardDescription>
              Your connected wallet details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Address</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {user.wallets?.[0]?.address}
                </code>
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={openExplorer}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {user.wallets?.[0]?.chain && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Network</label>
                <p className="text-sm mt-1">{user.wallets[0].chain}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Your Dynamic account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.email && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm mt-1">{user.email}</p>
              </div>
            )}
            
            {user.username && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <p className="text-sm mt-1">{user.username}</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">User ID</label>
              <p className="text-sm mt-1">{user.id}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
