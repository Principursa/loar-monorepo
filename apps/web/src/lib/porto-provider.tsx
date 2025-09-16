import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Porto } from 'porto';

interface PortoContextType {
  porto: Porto | null;
  isConnected: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  getAssets: () => Promise<any>;
  error: string | null;
}

const PortoContext = createContext<PortoContextType | undefined>(undefined);

interface PortoProviderProps {
  children: ReactNode;
}

export const PortoProvider: React.FC<PortoProviderProps> = ({ children }) => {
  const [porto, setPorto] = useState<Porto | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializePorto = async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          console.log('Not in browser environment, skipping Porto initialization');
          return;
        }

        console.log('Initializing Porto wallet...');
        
        // Check if we're on HTTPS
        const isSecure = window.location.protocol === 'https:';
        
        if (!isSecure) {
          console.warn('Porto requires HTTPS for WebAuthn support. Running on HTTP will have limited functionality.');
          // Don't return early - allow initialization but show warning
          setError('Porto requires HTTPS for full functionality. Some features may not work on HTTP.');
        }
        
        // Check if Porto is available
        if (typeof Porto === 'undefined') {
          console.error('Porto SDK not available');
          setError('Porto SDK not available. Please check your installation.');
          return;
        }

        // Porto works without extensions, so we can always try to create it
        const portoInstance = Porto.create();
        console.log('Porto instance created:', portoInstance);
        setPorto(portoInstance);
        
        // Check if already connected
        try {
          const accounts = await portoInstance.provider.request({
            method: 'eth_accounts',
          });
          
          if (accounts && accounts.length > 0) {
            setIsConnected(true);
            setAddress(accounts[0]);
            console.log('Already connected to Porto:', accounts[0]);
          }
        } catch (accountErr) {
          console.log('No existing connection found:', accountErr);
        }
      } catch (err) {
        console.error('Failed to initialize Porto:', err);
        setError('Failed to initialize Porto wallet: ' + (err as Error).message);
      }
    };

    initializePorto();
  }, []);

  const connect = async () => {
    if (!porto) {
      setError('Porto wallet not initialized');
      return;
    }

    try {
      setError(null);
      console.log('Requesting account access from Porto...');
      
      const accounts = await porto.provider.request({
        method: 'eth_requestAccounts',
      });

      console.log('Received accounts:', accounts);

      if (accounts && accounts.length > 0) {
        setIsConnected(true);
        setAddress(accounts[0]);
        console.log('Successfully connected to Porto:', accounts[0]);
      } else {
        setError('No accounts returned from Porto');
      }
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      
      // Handle specific error cases
      if (err.code === 4001) {
        setError('Connection was rejected by user');
      } else if (err.code === -32002) {
        setError('Connection request already pending');
      } else if (err.message?.includes('User rejected')) {
        setError('Connection was cancelled by user');
      } else if (err.message?.includes('disconnected')) {
        setError('Porto wallet is not connected. Please check your internet connection.');
      } else {
        setError(err.message || 'Failed to connect wallet');
      }
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
  };

  const getAssets = async () => {
    if (!porto || !address) {
      throw new Error('Porto wallet not connected');
    }

    try {
      const assets = await porto.provider.request({
        method: 'wallet_getAssets',
        params: [{
          account: address,
        }],
      });
      
      return assets;
    } catch (err: any) {
      console.error('Failed to get assets:', err);
      setError('Failed to retrieve assets');
      throw err;
    }
  };

  const value: PortoContextType = {
    porto,
    isConnected,
    address,
    connect,
    disconnect,
    getAssets,
    error,
  };

  return (
    <PortoContext.Provider value={value}>
      {children}
    </PortoContext.Provider>
  );
};

export const usePorto = (): PortoContextType => {
  const context = useContext(PortoContext);
  if (context === undefined) {
    throw new Error('usePorto must be used within a PortoProvider');
  }
  return context;
};
