import { usePorto } from "@/lib/porto-provider";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const PortoDebug = () => {
  const { porto, isConnected, address, error } = usePorto();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Porto Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <strong>Porto Instance:</strong> {porto ? '✅ Available' : '❌ Not Available'}
        </div>
        <div>
          <strong>Connection Status:</strong> {isConnected ? '✅ Connected' : '❌ Disconnected'}
        </div>
        {address && (
          <div>
            <strong>Address:</strong> {address}
          </div>
        )}
        {error && (
          <div>
            <strong>Error:</strong> <span className="text-red-500">{error}</span>
          </div>
        )}
        <div>
          <strong>Porto SDK:</strong> {typeof Porto !== 'undefined' ? '✅ Available' : '❌ Not Available'}
        </div>
        <div>
          <strong>Window Object:</strong> {typeof window !== 'undefined' ? '✅ Available' : '❌ Not Available'}
        </div>
      </CardContent>
    </Card>
  );
};


