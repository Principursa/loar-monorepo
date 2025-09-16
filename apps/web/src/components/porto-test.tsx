import { usePorto } from "@/lib/porto-provider";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const PortoTest = () => {
  const { isConnected, address, connect, getAssets, error } = usePorto();

  const handleGetAssets = async () => {
    try {
      const assets = await getAssets();
      console.log('Assets:', assets);
      alert(`Found ${assets?.length || 0} assets`);
    } catch (err) {
      console.error('Error getting assets:', err);
      alert('Error getting assets: ' + (err as Error).message);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Porto Wallet Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p><strong>Status:</strong> {isConnected ? 'Connected' : 'Disconnected'}</p>
          {address && <p><strong>Address:</strong> {address}</p>}
          {error && <p className="text-red-500"><strong>Error:</strong> {error}</p>}
          {!isConnected && !error && (
            <p className="text-sm text-muted-foreground">
              Porto wallet works without extensions. Click connect to get started.
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          {!isConnected ? (
            <Button onClick={connect}>Connect Porto Wallet</Button>
          ) : (
            <Button onClick={handleGetAssets}>Get Assets</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
