import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Play, Users, Plus, Database, ChevronLeft, ChevronRight, Info, Search } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { useReadContract, useAccount } from 'wagmi';
import { timelineAbi } from '@/generated';
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/universes")({
  component: RouteComponent,
});

// Netflix-style Hero Banner Component
function HeroBanner({ universe, onSelect }: { universe: any; onSelect: (id: string) => void }) {
  const { data: nodeCount } = useReadContract({
    abi: timelineAbi,
    address: universe?.address as `0x${string}`,
    functionName: 'latestNodeId',
    query: {
      enabled: !!universe?.address && universe.address.startsWith('0x'),
      select: (data) => data ? Number(data) : 0,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  });

  if (!universe) return null;

  return (
    <div className="relative h-[75vh] w-full overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        {universe.image_url ? (
          <img
            src={universe.image_url}
            alt={universe.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-16 pb-24 max-w-3xl">
        <div className="space-y-6">
          {/* Badges */}
          <div className="flex gap-3">
            {universe.address && (
              <Badge className="bg-white/20 backdrop-blur-md text-white border-0 px-4 py-2 text-sm">
                <Database className="h-4 w-4 mr-2" />
                {nodeCount || 0} nodes
              </Badge>
            )}
            <Badge className="bg-primary/90 backdrop-blur-md text-white border-0 px-4 py-2 text-sm font-semibold">
              {universe.address ? 'ON-CHAIN' : 'OFF-CHAIN'}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-7xl font-bold text-white drop-shadow-2xl leading-tight">
            {universe.name}
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-100 max-w-2xl leading-relaxed drop-shadow-lg">
            {universe.description || "Explore this narrative universe and discover its stories"}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 px-10 text-lg h-14 font-bold"
              onClick={() => onSelect(universe.id)}
            >
              <Play className="h-6 w-6 mr-3 fill-black" />
              Explore Universe
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="bg-gray-600/70 backdrop-blur-md text-white hover:bg-gray-600/90 border-0 px-10 text-lg h-14 font-semibold"
            >
              <Info className="h-6 w-6 mr-3" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Netflix-style Horizontal Scrolling Row Component
function UniverseRow({ title, universes, onSelect }: { title: string; universes: any[]; onSelect: (id: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    ref?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      ref?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [universes]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.9;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (universes.length === 0) return null;

  return (
    <div className="relative group/row mb-12">
      <h2 className="text-3xl font-bold mb-6 px-16 text-foreground">{title}</h2>

      {/* Left Scroll Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-background/95 hover:bg-background backdrop-blur-sm border-2 border-border text-foreground rounded-full w-12 h-12 opacity-0 group-hover/row:opacity-100 transition-all duration-300 flex items-center justify-center shadow-xl hover:scale-110"
          style={{ marginTop: '24px' }}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Scrollable Container */}
      <div className="overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overflowY: 'visible' }}>
        <div
          ref={scrollRef}
          className="flex gap-3 px-16 py-4"
        >
          {universes.map((universe) => (
            <UniverseCard key={universe.id} universe={universe} onSelect={onSelect} />
          ))}
        </div>
      </div>

      {/* Right Scroll Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-background/95 hover:bg-background backdrop-blur-sm border-2 border-border text-foreground rounded-full w-12 h-12 opacity-0 group-hover/row:opacity-100 transition-all duration-300 flex items-center justify-center shadow-xl hover:scale-110"
          style={{ marginTop: '24px' }}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

// Netflix-style Universe Card Component
function UniverseCard({ universe, onSelect }: { universe: any; onSelect: (id: string) => void }) {
  const [isHovered, setIsHovered] = useState(false);

  const { data: nodeCount } = useReadContract({
    abi: timelineAbi,
    address: universe.address as `0x${string}`,
    functionName: 'latestNodeId',
    query: {
      enabled: !!universe.address && universe.address.startsWith('0x'),
      select: (data) => data ? Number(data) : 0,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  });

  return (
    <div
      className="relative flex-shrink-0 w-[320px] cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.08] hover:z-30"
      onClick={() => onSelect(universe.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transformOrigin: 'center center' }}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted shadow-2xl">
        {/* Thumbnail */}
        {universe.image_url ? (
          <img
            src={universe.image_url}
            alt={universe.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
        )}

        {/* Hover Overlay with Info */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <h3 className="text-white font-bold text-lg truncate drop-shadow-lg">{universe.name}</h3>
            <p className="text-white/90 text-sm line-clamp-2 leading-relaxed">
              {universe.description || "Explore this narrative universe"}
            </p>
            <div className="flex items-center gap-2 pt-1">
              {universe.address && (
                <Badge className="bg-white/25 backdrop-blur-sm text-white border-0 text-xs px-2 py-1">
                  <Database className="h-3 w-3 mr-1" />
                  {nodeCount || 0} nodes
                </Badge>
              )}
              <Badge className="bg-primary/90 backdrop-blur-sm text-white border-0 text-xs px-2 py-1">
                {universe.address ? 'On-chain' : 'Off-chain'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Play Button Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-white/30 backdrop-blur-md rounded-full p-3 border-2 border-white shadow-2xl">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>

        {/* Small badge when not hovering */}
        {!isHovered && universe.address && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-black/70 backdrop-blur-sm text-white border-0 text-xs">
              <Database className="h-2.5 w-2.5 mr-1" />
              {nodeCount || 0}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}

function RouteComponent() {
  const { isConnected } = useAccount();
  const navigate = Route.useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: universesResponse, isLoading, error } = useQuery(trpc.cinematicUniverses.getAll.queryOptions());

  const universesData = useMemo(() => {
    if (!universesResponse?.data) return [];
    return universesResponse.data.map((universe: any) => ({
      ...universe,
      name: `Universe ${universe.id.slice(0, 8)}`,
      createdAt: universe.created_at,
    }));
  }, [universesResponse]);

  // Filter universes by search query (must be before early returns)
  const filteredUniverses = useMemo(() => {
    if (!searchQuery) return universesData;
    const query = searchQuery.toLowerCase();
    return universesData.filter((u: any) =>
      u.name.toLowerCase().includes(query) ||
      u.description?.toLowerCase().includes(query) ||
      u.id.toLowerCase().includes(query) ||
      u.address?.toLowerCase().includes(query)
    );
  }, [universesData, searchQuery]);

  const universes = filteredUniverses;
  const featuredUniverse = universes[0];
  const latestUniverses = universes.slice(0, 8);
  const onChainUniverses = universes.filter(u => u.address).slice(0, 8);
  const allUniverses = universes;

  useEffect(() => {
    if (!isConnected) {
      navigate({ to: "/" });
    }
  }, [isConnected, navigate]);

  const selectUniverse = (universeId: string) => {
    navigate({
      to: "/universe/$id",
      params: { id: universeId },
    });
  };

  const createNewUniverse = () => {
    navigate({ to: "/cinematicUniverseCreate" });
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="text-center space-y-4 p-8">
            <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
            <p className="text-muted-foreground">Please connect your wallet to view universes.</p>
            <WalletConnectButton size="lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-foreground text-xl">Loading universes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* Error notification */}
      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-yellow-900/90 backdrop-blur-md border border-yellow-700 rounded-lg shadow-2xl">
          <p className="text-yellow-100 font-medium">
            ⚠️ Unable to load universes. Make sure you're connected to Sepolia testnet.
          </p>
        </div>
      )}

      {/* Main Content */}
      <main>
        {universes.length === 0 ? (
          <div className="flex items-center justify-center min-h-screen text-center px-4">
            <div>
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
                <div className="relative bg-muted/50 backdrop-blur-sm rounded-3xl p-12 inline-block">
                  <Users className="h-24 w-24 mx-auto text-muted-foreground" />
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-4">No universes yet</h2>
              <p className="text-muted-foreground mb-10 text-xl max-w-lg mx-auto leading-relaxed">
                Create your first narrative universe to get started with collaborative storytelling
              </p>
              <Button
                onClick={createNewUniverse}
                className="font-bold text-lg px-8"
                size="lg"
              >
                <Plus className="h-6 w-6 mr-2" />
                Create Your First Universe
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Banner - Always render component to maintain hook order */}
            <section className="mb-16 px-16">
              <HeroBanner universe={featuredUniverse} onSelect={selectUniverse} />
            </section>

            {/* Content Rows */}
            <div className="space-y-8 pb-24">
              <UniverseRow title="Latest Universes" universes={latestUniverses} onSelect={selectUniverse} />
              <UniverseRow title="On-chain Universes" universes={onChainUniverses} onSelect={selectUniverse} />
              <UniverseRow title="All Universes" universes={allUniverses} onSelect={selectUniverse} />
            </div>
          </>
        )}
      </main>

      {/* Fixed Search Bar at Bottom */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search universes by name, description, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 h-14 text-base bg-background/95 backdrop-blur-md border-2 border-border shadow-2xl rounded-full focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}
