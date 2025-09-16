import React from 'react';
import { AuthButton } from '@coinbase/cdp-react';
import { useCDPOfficial } from '@/lib/useCDPOfficial';

interface CDPAuthButtonProps {
  size?: 'sm' | 'lg';
  className?: string;
}

export const CDPAuthButton: React.FC<CDPAuthButtonProps> = ({ 
  size = 'sm', 
  className = '' 
}) => {
  const { isInitialized, error, isAuthenticated, user, signOut, walletAddress, hooksReady } = useCDPOfficial();

  // Debug logging for auth button state
  const authButtonDebug = {
    isInitialized,
    error,
    isAuthenticated,
    hasUser: !!user,
    userEmail: user?.email,
    walletAddress,
    hooksReady,
    timestamp: new Date().toISOString()
  };
  
  console.log('🔍 CDP Auth Button State:', authButtonDebug);
  console.log('📊 Auth Button Details:');
  console.log('  - Is Initialized:', isInitialized);
  console.log('  - Error:', error || 'none');
  console.log('  - Is Authenticated:', isAuthenticated);
  console.log('  - Has User:', !!user);
  console.log('  - User Email:', user?.email || 'none');
  console.log('  - Wallet Address:', walletAddress || 'none');
  console.log('  - Hooks Ready:', hooksReady);

      // Debug button to manually show state
      const showDebugInfo = () => {
        console.log('🔧 MANUAL DEBUG INFO:');
        console.log('  - User object:', user);
        console.log('  - Is Authenticated:', isAuthenticated);
        console.log('  - Wallet Address:', walletAddress);
        console.log('  - Hooks Ready:', hooksReady);
        console.log('  - All context values:', { isInitialized, error, isAuthenticated, user, walletAddress, hooksReady });
        
        // Additional phone authentication debugging
        if (user && user.phoneNumber) {
          console.log('📱 Phone Auth Debug:');
          console.log('  - Phone Number:', user.phoneNumber);
          console.log('  - Phone Format:', user.phoneNumber.startsWith('+1') ? 'US Format (+1)' : 'Non-US Format');
          console.log('  - Phone Verified:', user.phoneNumberVerified);
        }
      };

  // Additional debugging for the specific issue
  if (user && !isAuthenticated) {
    console.warn('🚨 AUTH MISMATCH: User exists but isAuthenticated is false!', {
      user: user,
      isAuthenticated,
      hooksReady
    });
  }
  
  if (isAuthenticated && !walletAddress) {
    console.warn('🚨 WALLET MISSING: User is authenticated but no wallet address!', {
      user: user,
      isAuthenticated,
      walletAddress,
      hooksReady
    });
  }

  // Helper function to format wallet address
  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-8)}`;
  };

  if (!isInitialized) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button 
          disabled 
          className="px-4 py-2 rounded-md bg-gray-300 text-gray-500 cursor-not-allowed"
        >
          Loading...
        </button>
        <button 
          onClick={showDebugInfo}
          className="px-2 py-1 rounded-md bg-blue-100 text-blue-600 text-xs"
        >
          Debug
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button 
          disabled 
          className="px-4 py-2 rounded-md bg-red-100 text-red-600 cursor-not-allowed"
        >
          Configuration Error
        </button>
        <button 
          onClick={showDebugInfo}
          className="px-2 py-1 rounded-md bg-blue-100 text-blue-600 text-xs"
        >
          Debug
        </button>
      </div>
    );
  }

  // Debug: Show authenticated state even if hooks aren't ready yet
  if ((hooksReady && isAuthenticated && user) || (user && !hooksReady)) {
    const displayAddress = formatWalletAddress(walletAddress || '');
    
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-mono">
            {displayAddress || 'Connected'}
            {walletAddress && (
              <span className="text-xs text-green-600 dark:text-green-400 ml-1">
                (...{walletAddress.slice(-10)})
              </span>
            )}
            {!hooksReady && (
              <span className="text-xs text-yellow-600 dark:text-yellow-400 ml-1">
                (hooks loading...)
              </span>
            )}
          </span>
        </div>
        <button 
          onClick={signOut}
          className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // Use the official CDP AuthButton with all authentication methods
  return (
    <div className={`cdp-auth-button relative z-50 ${className}`}>
      <div className="flex items-center gap-2">
        <AuthButton 
          theme="dark"
          size={size}
          // The AuthButton will automatically show email and SMS options
          // based on our appConfig.authMethods: ["email", "sms"]
        />
        <button 
          onClick={showDebugInfo}
          className="px-2 py-1 rounded-md bg-blue-100 text-blue-600 text-xs"
        >
          Debug
        </button>
      </div>
    </div>
  );
};
