import React, { createContext, useContext, useEffect, useState } from 'react';
import { CDPReactProvider, AuthButton } from '@coinbase/cdp-react';
import { type AppConfig } from '@coinbase/cdp-react';
import { type Config } from '@coinbase/cdp-core';
import { useCurrentUser, useIsSignedIn, useEvmAddress, useSignOut, CDPHooksProvider } from '@coinbase/cdp-hooks';
import { testCDPConfig } from './test-cdp-config';

// CDP Configuration - using environment variables
const getCDPConfig = (): Config => {
  return {
    projectId: import.meta.env.VITE_CDP_PROJECT_ID || '',
    apiKeyName: import.meta.env.VITE_CDP_API_KEY || '',
    apiKeySecret: import.meta.env.VITE_CDP_API_SECRET || '',
  };
};

// App Configuration with SMS OTP enabled
const getAppConfig = (): AppConfig => {
  return {
    name: "LOAR - AI Video Generation",
    logoUrl: "/logo.png",
    authMethods: ["email", "sms"], // Enable both email and SMS authentication
  };
};

// CDP Context Interface
interface CDPContextType {
  isInitialized: boolean;
  error: string | null;
  user: any;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  walletAddress: string | null;
  hooksReady: boolean;
}

export const CDPContext = createContext<CDPContextType | null>(null);

// Inner component that uses real CDP hooks
const CDPContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hooksReady, setHooksReady] = useState(false);
  
  // Use real CDP hooks to get authentication state and wallet address
  const { currentUser: user } = useCurrentUser();
  const { isSignedIn: isAuthenticated } = useIsSignedIn();
  const { evmAddress } = useEvmAddress();
  const { signOut: cdpSignOut } = useSignOut();

  // Wait for hooks to be ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setHooksReady(true);
      console.log('🔧 CDP Hooks marked as ready');
    }, 1000); // Give hooks 1 second to initialize

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
        // Initialize CDP configuration check
        const initializeCDP = async () => {
          try {
            // Run CDP configuration test
            testCDPConfig();
            
            const config = getCDPConfig();

            if (config.projectId && config.apiKeyName && config.apiKeySecret) {
              setIsInitialized(true);
              console.log('✅ CDP Official SDK configuration validated successfully');
              console.log('📋 CDP Config:', {
                projectId: config.projectId,
                apiKeyName: config.apiKeyName,
                hasSecret: !!config.apiKeySecret,
                authMethods: ['email', 'sms']
              });
            } else {
              setError('CDP configuration missing - check environment variables');
              console.error('❌ CDP configuration missing:', {
                hasProjectId: !!config.projectId,
                hasApiKey: !!config.apiKeyName,
                hasSecret: !!config.apiKeySecret
              });
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to validate CDP configuration');
            console.error('❌ CDP configuration validation failed:', err);
          }
        };

    initializeCDP();
  }, []);

      // Debug logging for CDP state changes
      useEffect(() => {
        const debugInfo = {
          user: user ? { id: user.id, email: user.email, phoneNumber: user.phoneNumber } : null,
          isAuthenticated,
          evmAddress,
          hooksReady,
          timestamp: new Date().toISOString()
        };
        
        console.log('🔍 CDP State Debug:', debugInfo);
        console.log('📊 CDP State Details:');
        console.log('  - User:', user ? `${user.email || user.phoneNumber || 'Unknown'} (ID: ${user.id})` : 'null');
        console.log('  - Is Authenticated:', isAuthenticated);
        console.log('  - EVM Address:', evmAddress || 'null');
        console.log('  - Hooks Ready:', hooksReady);
        console.log('  - Timestamp:', new Date().toISOString());
        
        // Phone authentication specific debugging
        if (user && user.phoneNumber) {
          console.log('📱 Phone Authentication Details:');
          console.log('  - Phone Number:', user.phoneNumber);
          console.log('  - Phone Verified:', user.phoneNumberVerified || 'unknown');
          console.log('  - User ID:', user.id);
          console.log('  - Full User Object:', user);
        }
        
        // Debug authentication method
        if (user) {
          console.log('🔐 Authentication Method Debug:');
          console.log('  - Has Email:', !!user.email);
          console.log('  - Has Phone:', !!user.phoneNumber);
          console.log('  - Email:', user.email || 'none');
          console.log('  - Phone:', user.phoneNumber || 'none');
          console.log('  - Is Authenticated:', isAuthenticated);
          console.log('  - Has EVM Address:', !!evmAddress);
        }
        
        // Additional debugging for authentication state
        if (user && !isAuthenticated) {
          console.warn('⚠️ User exists but isAuthenticated is false - potential state mismatch', {
            user: user,
            isAuthenticated,
            hooksReady
          });
        }
        if (isAuthenticated && !evmAddress) {
          console.warn('⚠️ User is authenticated but no EVM address - wallet may not be ready', {
            user: user,
            isAuthenticated,
            evmAddress,
            hooksReady
          });
        }
      }, [user, isAuthenticated, evmAddress, hooksReady]);

  const signOut = async () => {
    try {
      await cdpSignOut();
      console.log('✅ User signed out successfully');
    } catch (err) {
      console.error('❌ Sign out failed:', err);
    }
  };

  // Add error handling for CDP hooks
  useEffect(() => {
    const handleCDPError = (error: any) => {
      console.error('🚨 CDP Hook Error:', error);
      if (error?.message?.includes('SMS') || error?.message?.includes('phone')) {
        console.error('📱 SMS/Phone Authentication Error:', error);
      }
    };

    // Listen for any CDP-related errors
    window.addEventListener('error', handleCDPError);
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('CDP') || event.reason?.message?.includes('SMS')) {
        handleCDPError(event.reason);
      }
    });

    return () => {
      window.removeEventListener('error', handleCDPError);
      window.removeEventListener('unhandledrejection', handleCDPError);
    };
  }, []);

  const contextValue: CDPContextType = {
    isInitialized,
    error,
    user,
    isAuthenticated,
    signOut,
    walletAddress: evmAddress || null,
    hooksReady,
  };

  return (
    <CDPContext.Provider value={contextValue}>
      {children}
    </CDPContext.Provider>
  );
};

export const CDPOfficialProvider = ({ children }: { children: React.ReactNode }) => {
  const config = getCDPConfig();
  const appConfig = getAppConfig();

  // Check if we have the required configuration
  if (!config.projectId || !config.apiKeyName || !config.apiKeySecret) {
    console.error('❌ CDP configuration missing:', {
      hasProjectId: !!config.projectId,
      hasApiKey: !!config.apiKeyName,
      hasSecret: !!config.apiKeySecret
    });
    
    return (
      <CDPContext.Provider value={{
        isInitialized: false,
        error: 'CDP configuration missing - check environment variables',
        user: null,
        isAuthenticated: false,
        signOut: async () => {},
        walletAddress: null,
        hooksReady: false,
      }}>
        {children}
      </CDPContext.Provider>
    );
  }

  console.log('✅ CDP Official SDK configuration validated successfully');
  console.log('📋 CDP Config:', {
    projectId: config.projectId,
    apiKeyName: config.apiKeyName,
    hasSecret: !!config.apiKeySecret,
    authMethods: ['email', 'sms']
  });
  console.log('📱 SMS Authentication Config:', {
    projectId: config.projectId,
    apiKeyName: config.apiKeyName,
    authMethods: ['email', 'sms'],
    smsEnabled: true,
    usPhoneNumbersOnly: true
  });

  // Use CDP React Provider with CDP Hooks Provider for real hooks integration
  return (
    <CDPReactProvider app={appConfig} config={config}>
      <CDPHooksProvider config={config}>
        <CDPContextProvider>
          {children}
        </CDPContextProvider>
      </CDPHooksProvider>
    </CDPReactProvider>
  );
};

// Hook is now exported from separate file to fix Fast Refresh

// Export the AuthButton component for use in UI
export { AuthButton };
