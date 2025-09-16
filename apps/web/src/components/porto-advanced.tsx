import { usePorto } from "@/lib/porto-provider";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";

export const PortoAdvanced = () => {
  const { isConnected, address, porto } = usePorto();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAssets = async () => {
    if (!porto || !address) return;
    
    setLoading(true);
    try {
      const assets = await porto.provider.request({
        method: 'wallet_getAssets',
        params: [{
          account: address,
        }],
      });
      setResult({ type: 'assets', data: assets });
    } catch (err) {
      setResult({ type: 'error', data: err });
    } finally {
      setLoading(false);
    }
  };

  const handleGetBalance = async () => {
    if (!porto || !address) return;
    
    setLoading(true);
    try {
      const balance = await porto.provider.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      setResult({ type: 'balance', data: balance });
    } catch (err) {
      setResult({ type: 'error', data: err });
    } finally {
      setLoading(false);
    }
  };

  const handleGetChainId = async () => {
    if (!porto) return;
    
    setLoading(true);
    try {
      const chainId = await porto.provider.request({
        method: 'eth_chainId',
      });
      setResult({ type: 'chainId', data: chainId });
    } catch (err) {
      setResult({ type: 'error', data: err });
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Porto Advanced Features</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Connect your wallet to access advanced Porto features.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Porto Advanced Features</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Button 
            onClick={handleGetAssets} 
            disabled={loading}
            variant="outline"
          >
            Get Assets
          </Button>
          <Button 
            onClick={handleGetBalance} 
            disabled={loading}
            variant="outline"
          >
            Get Balance
          </Button>
          <Button 
            onClick={handleGetChainId} 
            disabled={loading}
            variant="outline"
          >
            Get Chain ID
          </Button>
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground">Loading...</p>
        )}

        {result && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">
              {result.type === 'error' ? 'Error' : `Result: ${result.type}`}
            </h4>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p><strong>Connected Address:</strong> {address}</p>
          <p><strong>Features:</strong> EIP-7811 Asset Discovery, Modern EIP Support, No Extensions Required</p>
        </div>
      </CardContent>
    </Card>
  );
};


