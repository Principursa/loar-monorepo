// Test CDP Configuration
export const testCDPConfig = () => {
  const config = {
    projectId: import.meta.env.VITE_CDP_PROJECT_ID || '',
    apiKeyName: import.meta.env.VITE_CDP_API_KEY || '',
    apiKeySecret: import.meta.env.VITE_CDP_API_SECRET || '',
  };

  console.log('🧪 CDP Configuration Test:');
  console.log('  - Project ID:', config.projectId);
  console.log('  - API Key Name:', config.apiKeyName);
  console.log('  - Has API Secret:', !!config.apiKeySecret);
  console.log('  - All Required Fields Present:', !!(config.projectId && config.apiKeyName && config.apiKeySecret));
  
  // Test environment variables
  console.log('🔍 Environment Variables:');
  console.log('  - VITE_CDP_PROJECT_ID:', import.meta.env.VITE_CDP_PROJECT_ID);
  console.log('  - VITE_CDP_API_KEY:', import.meta.env.VITE_CDP_API_KEY);
  console.log('  - VITE_CDP_API_SECRET:', import.meta.env.VITE_CDP_API_SECRET ? 'SET' : 'NOT SET');
  
  return config;
};
