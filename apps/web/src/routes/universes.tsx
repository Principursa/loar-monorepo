import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Copy, ExternalLink, Play, Users, Calendar, Plus, Database } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { trpcClient } from '@/utils/trpc';
import { useChainId, useReadContract } from 'wagmi';
import { timelineAbi } from '@/generated';
import { createPublicClient, http, parseEventLogs } from 'viem';
import { sepolia } from 'viem/chains';

export const Route = createFileRoute("/universes")({
  component: RouteComponent,
});

// Component to display Universe info with contract data
function UniverseCard({ universe, onSelect }: { universe: any; onSelect: (id: string) => void }) {
  // Read contract data for Timeline contract with better error handling
  const { data: nodeCount, isLoading: nodeCountLoading, error: nodeCountError } = useReadContract({
    abi: timelineAbi,
    address: universe.address as `0x${string}`,
    functionName: 'latestNodeId',
    query: {
      enabled: !!universe.address && universe.address.startsWith('0x'),
      select: (data) => data ? Number(data) : 0, // Convert BigInt to number immediately
      retry: 1,
      refetchOnWindowFocus: false,
    }
  });

  const { data: owner, isLoading: ownerLoading, error: ownerError } = useReadContract({
    abi: timelineAbi,
    address: universe.address as `0x${string}`,
    functionName: 'owner',
    query: {
      enabled: !!universe.address && universe.address.startsWith('0x'),
      select: (data) => data?.toString() || '', // Convert address to string
      retry: 1,
      refetchOnWindowFocus: false,
    }
  });

  const nodeCountNumber = nodeCountError ? '?' : (nodeCountLoading ? '...' : (nodeCount || 0));
  
  // Log any contract call errors for debugging
  if (nodeCountError) console.error('Node count error:', nodeCountError);
  if (ownerError) console.error('Owner error:', ownerError);

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 group overflow-hidden"
      onClick={() => onSelect(universe.id)}
    >
      <CardContent className="p-0">
        {/* Universe Thumbnail/Header */}
        <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-2 right-2 flex gap-2">
            {universe.address && (
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <Database className="h-3 w-3 mr-1" />
                {nodeCountNumber} nodes
              </Badge>
            )}
          </div>
          <div className="absolute bottom-2 left-2">
            <div className="text-white text-xs bg-black/40 px-2 py-1 rounded">
              {universe.address ? 'On-chain Timeline' : 'Off-chain'}
            </div>
          </div>
        </div>
        
        {/* Universe Info */}
        <div className="p-4">
          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
            {universe.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {universe.description || "Explore this narrative universe"}
          </p>
          
          {/* Contract Addresses */}
          {universe.address && (
            <div className="mt-3 space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">Timeline:</span>
                <code className="text-xs bg-muted px-1 rounded truncate flex-1">
                  {universe.address.slice(0, 6)}...{universe.address.slice(-4)}
                </code>
              </div>
              {universe.tokenAddress && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Token:</span>
                  <code className="text-xs bg-muted px-1 rounded truncate flex-1">
                    {universe.tokenAddress.slice(0, 6)}...{universe.tokenAddress.slice(-4)}
                  </code>
                </div>
              )}
              {universe.governanceAddress && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Governor:</span>
                  <code className="text-xs bg-muted px-1 rounded truncate flex-1">
                    {universe.governanceAddress.slice(0, 6)}...{universe.governanceAddress.slice(-4)}
                  </code>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground">
              Created {new Date(universe.createdAt).toLocaleDateString()}
            </span>
            <Button 
              size="sm" 
              variant="ghost" 
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(universe.id);
              }}
            >
              <Play className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Create a public client for reading contract events
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
});

function RouteComponent() {
  const { user } = useDynamicContext();
  const navigate = Route.useNavigate();
  const chainId = useChainId();

  // Fetch universes from database first, fallback to localStorage
  const { data: universesData, isLoading, error } = useQuery({
    queryKey: ['blockchain-universes'],
    queryFn: async () => {
      try {
        // Try database first
        console.log('Fetching universes from database...');
        const dbResult = await trpcClient.cinematicUniverses.getAll.query();
        
        if (dbResult?.success && dbResult.data && dbResult.data.length > 0) {
          console.log('Found universes in database:', dbResult.data);
          return dbResult.data;
        }
        
        console.log('Database empty or failed, checking localStorage backup...');
        
        // Fallback to localStorage
        const stored = localStorage.getItem('createdUniverses');
        const localUniverses = stored ? JSON.parse(stored) : [];
        
        console.log('localStorage backup universes:', localUniverses);
        return localUniverses;
        
      } catch (error) {
        console.error('Database fetch failed, using localStorage backup:', error);
        
        // Fallback to localStorage on any error
        const stored = localStorage.getItem('createdUniverses');
        const localUniverses = stored ? JSON.parse(stored) : [];
        console.log('Using localStorage fallback:', localUniverses);
        return localUniverses;
      }
    },
    enabled: true,
    retry: 1
  });

  useEffect(() => {
    if (!user) {
      navigate({
        to: "/",
      });
    }
  }, [user, navigate]);

  const selectUniverse = (universeId: string) => {
    navigate({
      to: "/universe/$id",
      params: { id: universeId },
    });
  };

  const createNewUniverse = () => {
    navigate({
      to: "/cinematicUniverseCreate",
    });
  };


  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to access the universes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please connect your wallet to view created universes.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading universes...</p>
        </div>
      </div>
    );
  }

  // Use all universes from database
  const universes = universesData || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">LOAR Universes</h1>
              <p className="text-muted-foreground">Select a narrative universe to explore</p>
            </div>
            <Button onClick={createNewUniverse} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Universe
            </Button>
          </div>
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="container mx-auto px-6 pt-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Unable to load universes. Make sure you're connected to Sepolia testnet.
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        {/* Featured Universe Section */}
        {universes.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6">Latest Universe</h2>
            <div className="relative">
              <UniverseCard 
                universe={universes[0]} 
                onSelect={selectUniverse}
              />
            </div>
          </section>
        )}

        {/* All Universes Grid */}
        <section>
          <h2 className="text-xl font-semibold mb-6">Your Universes</h2>
          {universes.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Users className="h-12 w-12 mx-auto text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No universes yet</h3>
              <p className="text-muted-foreground mb-4">Create your first narrative universe to get started</p>
              <Button onClick={createNewUniverse} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Universe
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {universes.map((universe: any) => (
                <UniverseCard 
                  key={universe.id}
                  universe={universe}
                  onSelect={selectUniverse}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
