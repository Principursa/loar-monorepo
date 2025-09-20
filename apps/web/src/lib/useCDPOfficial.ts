import { useContext } from 'react';
import { CDPContext } from './cdp-official-provider';

// Custom hook to use CDP functionality
export const useCDPOfficial = () => {
  const context = useContext(CDPContext);
  if (!context) {
    throw new Error('useCDPOfficial must be used within a CDPOfficialProvider');
  }
  return context;
};
