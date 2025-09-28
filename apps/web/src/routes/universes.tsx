import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Copy, ExternalLink, Play, Users, Calendar, Plus, Database } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { useChainId, useReadContract, useAccount } from 'wagmi';
import { timelineAbi } from '@/generated';
import { createPublicClient, http, parseEventLogs } from 'viem';
import { sepolia } from 'viem/chains';
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { trpc } from "@/utils/trpc";

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
      className="cursor-pointer hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 group overflow-hidden border-0 bg-gradient-to-br from-card via-card to-card/95 hover:scale-[1.02] hover:bg-gradient-to-br hover:from-card hover:via-card/98 hover:to-card/90"
      onClick={() => onSelect(universe.id)}
    >
      <CardContent className="p-0">
        {/* Universe Thumbnail/Header */}
        <div className="h-36 relative overflow-hidden">
          {universe.image_url ? (
            <>
              <img 
                src={universe.image_url} 
                alt={universe.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Fallback gradient (shown when image fails) */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 -z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/30" />
            </>
          ) : (
            <>
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 group-hover:from-indigo-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/30" />
            </>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            {universe.address && (
              <Badge variant="secondary" className="bg-white/30 backdrop-blur-sm text-white border-0 shadow-lg">
                <Database className="h-3 w-3 mr-1" />
                {nodeCountNumber} nodes
              </Badge>
            )}
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="text-white text-xs bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium">
              {universe.address ? 'On-chain Timeline' : 'Off-chain'}
            </div>
          </div>
        </div>
        
        {/* Universe Info */}
        <div className="p-5">
          <h3 className="text-lg font-bold truncate group-hover:text-primary transition-colors duration-300">
            {universe.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
            {universe.description || "Explore this narrative universe"}
          </p>
          
          {/* Contract Addresses */}
          {universe.address && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground min-w-[60px]">Timeline:</span>
                <code className="text-xs bg-gradient-to-r from-muted to-muted/80 px-2 py-1 rounded-md truncate flex-1 font-mono">
                  {universe.address.slice(0, 6)}...{universe.address.slice(-4)}
                </code>
              </div>
              {universe.tokenAddress && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground min-w-[60px]">Token:</span>
                  <code className="text-xs bg-gradient-to-r from-muted to-muted/80 px-2 py-1 rounded-md truncate flex-1 font-mono">
                    {universe.tokenAddress.slice(0, 6)}...{universe.tokenAddress.slice(-4)}
                  </code>
                </div>
              )}
              {universe.governanceAddress && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground min-w-[60px]">Governor:</span>
                  <code className="text-xs bg-gradient-to-r from-muted to-muted/80 px-2 py-1 rounded-md truncate flex-1 font-mono">
                    {universe.governanceAddress.slice(0, 6)}...{universe.governanceAddress.slice(-4)}
                  </code>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
            <span className="text-xs text-muted-foreground font-medium">
              Created {new Date(universe.createdAt).toLocaleDateString()}
            </span>
            <Button 
              size="sm" 
              variant="ghost" 
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/10 hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(universe.id);
              }}
            >
              <Play className="h-4 w-4" />
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
  const { address, isConnected } = useAccount();
  const navigate = Route.useNavigate();
  const chainId = useChainId();

  // Fetch all universes from database using TRPC
  const { data: universesResponse, isLoading, error } = useQuery(trpc.cinematicUniverses.getAll.queryOptions());
  
  // Transform the data to match frontend expectations
  const universesData = useMemo(() => {
    if (!universesResponse?.data) return [];
    
    return universesResponse.data.map((universe: any) => ({
      ...universe,
      name: `Universe ${universe.id.slice(0, 8)}`, // Generate name from ID since it's not in DB
      createdAt: universe.created_at, // Map created_at to createdAt
    }));
  }, [universesResponse]);

  useEffect(() => {
    if (!isConnected) {
      navigate({
        to: "/",
      });
    }
  }, [isConnected, navigate]);

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


  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to access the universes
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">Please connect your wallet to view created universes.</p>
            <WalletConnectButton size="lg" />
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

  // Use transformed universes data
  const universes = universesData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-card via-card/95 to-card/90 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                LOAR Universes
              </h1>
              <p className="text-muted-foreground text-lg">Select a narrative universe to explore</p>
            </div>
            <Button 
              onClick={createNewUniverse} 
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
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
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Latest Universe</h2>
            <div className="relative max-w-md mx-auto lg:max-w-none lg:mx-0">
              <UniverseCard 
                universe={universes[0]} 
                onSelect={selectUniverse}
              />
            </div>
          </section>
        )}

        {/* All Universes Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">All Universes</h2>
          {universes.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
                <div className="relative bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm rounded-2xl p-8 inline-block">
                  <Users className="h-16 w-16 mx-auto text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">No universes yet</h3>
              <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto leading-relaxed">
                Create your first narrative universe to get started with collaborative storytelling
              </p>
              <Button 
                onClick={createNewUniverse} 
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                Create Your First Universe
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
