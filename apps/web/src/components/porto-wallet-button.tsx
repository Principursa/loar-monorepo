import { useState } from 'react';
import { Button } from "./ui/button";
import { Wallet, LogOut, Loader2, AlertCircle, Smartphone } from "lucide-react";
import { usePorto } from '../lib/porto-provider';
import { PortoModal } from './porto-modal';

interface PortoWalletButtonProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

export const PortoWalletButton = ({ onConnect, onDisconnect }: PortoWalletButtonProps) => {
  const { porto, isConnected, address, connect, disconnect, error } = usePorto();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleConnect = () => {
    setShowModal(true);
  };

  const handleModalSuccess = (connectedAddress: string) => {
    onConnect?.(connectedAddress);
    setShowModal(false);
  };

  const handleDisconnect = () => {
    disconnect();
    onDisconnect?.();
  };

  const getAssets = async () => {
    if (!porto || !address) return;

    try {
      const assets = await porto.provider.request({
        method: 'wallet_getAssets',
        params: [{
          account: address,
        }],
      });
      
      console.log('Assets:', assets);
      return assets;
    } catch (err) {
      console.error('Failed to get assets:', err);
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={getAssets}
          className="flex items-center gap-2"
        >
          <Wallet className="h-4 w-4" />
          Assets
        </Button>
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
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleConnect}
        disabled={isLoading || !porto}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Smartphone className="h-4 w-4" />
        )}
        {isLoading ? 'Connecting...' : 'Connect Porto Wallet'}
      </Button>
      
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      
      {!porto && !error && (
        <p className="text-sm text-muted-foreground">
          Initializing Porto wallet...
        </p>
      )}
      
      {porto && !error && (
        <div className="text-xs text-muted-foreground">
          <p>• Use your phone to scan QR code</p>
          <p>• No browser extension required</p>
          <p>• Works with passkeys & security keys</p>
        </div>
      )}

      <PortoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};