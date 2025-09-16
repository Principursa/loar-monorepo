import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Smartphone, QrCode, Shield, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface PortoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (address: string) => void;
}

export const PortoModal: React.FC<PortoModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'instructions' | 'connecting' | 'success' | 'error'>('instructions');
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('instructions');
      setError(null);
      setAddress(null);
    }
  }, [isOpen]);

  const handleConnect = async () => {
    setStep('connecting');
    setError(null);

    try {
      // Import Porto dynamically
      const { Porto } = await import('porto');
      
      // Create Porto instance
      const porto = Porto.create();
      
      // Request account access
      const accounts = await porto.provider.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setStep('success');
        onSuccess?.(accounts[0]);
        
        // Auto-close after success
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error('No accounts returned');
      }
    } catch (err: any) {
      console.error('Porto connection failed:', err);
      setError(err.message || 'Failed to connect wallet');
      setStep('error');
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'instructions':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
                <Smartphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-base font-semibold mb-1">Connect with Porto Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Use your phone to scan the QR code
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Open Porto on your phone</p>
                  <p className="text-xs text-muted-foreground">
                    Make sure you have the Porto app installed
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Scan the QR code</p>
                  <p className="text-xs text-muted-foreground">
                    Use your phone's camera to scan the QR code
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Approve the connection</p>
                  <p className="text-xs text-muted-foreground">
                    Confirm the connection on your phone
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Secure Connection</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Uses WebAuthn and passkeys. No passwords required.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleConnect} className="flex-1 text-sm">
                <QrCode className="w-4 h-4 mr-2" />
                Start Connection
              </Button>
              <Button variant="outline" onClick={onClose} className="text-sm">
                Cancel
              </Button>
            </div>
          </div>
        );

      case 'connecting':
        return (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-semibold mb-1">Connecting to Porto</h3>
              <p className="text-sm text-muted-foreground">
                Scan the QR code with your phone and approve the connection
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  Make sure your phone is connected to the internet
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose} className="text-sm">
              Cancel
            </Button>
          </div>
        );

      case 'success':
        return (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold mb-1">Successfully Connected!</h3>
              <p className="text-sm text-muted-foreground">
                Your Porto wallet is now connected
              </p>
              {address && (
                <p className="text-xs font-mono bg-muted px-2 py-1 rounded mt-2">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              )}
            </div>
            <Button onClick={onClose} className="w-full text-sm">
              Continue
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold mb-1">Connection Failed</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {error || 'Something went wrong while connecting to Porto'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleConnect} className="flex-1 text-sm">
                Try Again
              </Button>
              <Button variant="outline" onClick={onClose} className="text-sm">
                Cancel
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Porto Wallet</DialogTitle>
          <DialogDescription>
            Connect your wallet to get started
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
