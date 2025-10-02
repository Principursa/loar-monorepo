import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Wallet, Copy, ExternalLink, Play, Users, Calendar, Plus, Database, Search, TrendingUp, Clock, Sparkles, BarChart3 } from "lucide-react";
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

  const nodeCountNumber = nodeCountError ? '?' : (nodeCountLoading ? '...' : (nodeCount || 0));

  return (
    <div
      className="group cursor-pointer"
      onClick={() => onSelect(universe.id)}
    >
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
        {/* Universe Image */}
        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
          {universe.image_url ? (
            <img
              src={universe.image_url}
              alt={universe.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

          {/* Node count badge */}
          {universe.address && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-white/90 dark:bg-black/90 text-foreground border-0 backdrop-blur-sm">
                <Database className="h-3 w-3 mr-1" />
                {nodeCountNumber}
              </Badge>
            </div>
          )}
        </div>

        {/* Universe Info */}
        <div className="p-4">
          <h3 className="font-semibold text-base mb-1 truncate group-hover:text-primary transition-colors">
            {universe.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {universe.description || "Explore this narrative universe"}
          </p>

          {/* Contract Info Compact */}
          {universe.address && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <code className="font-mono bg-muted px-2 py-0.5 rounded">
                {universe.address.slice(0, 6)}...{universe.address.slice(-4)}
              </code>
              <span>•</span>
              <span>{new Date(universe.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RouteComponent() {
  const { isConnected } = useAccount();
  const navigate = Route.useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("trending");

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

  // Filter universes by search query
  const filteredUniverses = useMemo(() => {
    if (!searchQuery) return universesData;
    const query = searchQuery.toLowerCase();
    return universesData.filter((u: any) =>
      u.name.toLowerCase().includes(query) ||
      u.description?.toLowerCase().includes(query) ||
      u.id.toLowerCase().includes(query) ||
      u.address?.toLowerCase().includes(query) ||
      u.creator?.toLowerCase().includes(query) ||
      u.tokenAddress?.toLowerCase().includes(query) ||
      u.governanceAddress?.toLowerCase().includes(query)
    );
  }, [universesData, searchQuery]);

  // Categorize universes
  const categories = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const getSuggestions = (universes: any[]) => {
      if (universes.length === 0) return [];
      return [...universes]
        .sort((a, b) => {
          const hashA = a.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
          const hashB = b.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
          return hashA - hashB;
        })
        .slice(0, 12);
    };

    return {
      trending: filteredUniverses
        .filter((u: any) => new Date(u.createdAt) > sevenDaysAgo)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 12),
      recent: [...filteredUniverses]
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 12),
      popular: [...filteredUniverses].slice(0, 12),
      suggestions: getSuggestions(filteredUniverses),
    };
  }, [filteredUniverses]);

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

  const currentUniverses = categories[activeCategory as keyof typeof categories] || [];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hero Section */}
      <div className="relative border-b bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Explore Universes</h1>
              <p className="text-muted-foreground text-lg">
                Discover narrative worlds created by the community
              </p>
            </div>
            <Button
              onClick={createNewUniverse}
              size="lg"
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Universe
            </Button>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 h-auto p-1">
              <TabsTrigger value="trending" className="gap-2 py-3">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="recent" className="gap-2 py-3">
                <Clock className="h-4 w-4" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="popular" className="gap-2 py-3">
                <BarChart3 className="h-4 w-4" />
                Popular
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="gap-2 py-3">
                <Sparkles className="h-4 w-4" />
                For You
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="container mx-auto px-6 pt-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Unable to load universes. Make sure you're connected to Sepolia testnet.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {currentUniverses.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">
              {universesData.length === 0 ? "No universes yet" : "No results"}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {universesData.length === 0
                ? "Create your first narrative universe to get started"
                : "Try adjusting your search or exploring a different category"}
            </p>
            {universesData.length === 0 && (
              <Button onClick={createNewUniverse} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Your First Universe
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {currentUniverses.map((universe: any) => (
              <UniverseCard
                key={universe.id}
                universe={universe}
                onSelect={selectUniverse}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fixed Search Bar at Bottom */}
      {universesData.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-background via-background to-transparent border-t backdrop-blur-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search universes by name, description, or contract address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-12 text-base rounded-full bg-background/80 backdrop-blur-md border-2 focus:border-primary shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
