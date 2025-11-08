import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Play, Users, Plus, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { usePonderQuery } from "@ponder/react";
import { desc } from "@ponder/client";
import { universe, token, node } from "../../../indexer/ponder.schema";
import { useAccount } from "wagmi";
import { WalletConnectButton } from "@/components/wallet-connect-button";

export const Route = createFileRoute("/universes")({
  component: RouteComponent,
});

// Netflix-style Hero Banner Component
function HeroBanner({ universeData, onSelect }: { universeData: any; onSelect: (address: string) => void }) {
  const navigate = Route.useNavigate();

  if (!universeData) return null;

  const hasEvents = universeData.nodeCount && universeData.nodeCount > 0;

  // Get token data if available
  const tokenData = universeData.tokenData;

  return (
    <div className="relative h-[75vh] w-full overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        {tokenData?.imageURL ? (
          <img src={tokenData.imageURL} alt={tokenData.name} className="w-full h-full object-cover" />
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
          <div className="flex gap-3 flex-wrap">
            {hasEvents ? (
              <Badge className="bg-green-500/90 backdrop-blur-md text-white border-0 px-4 py-2 text-sm font-semibold">
                <Play className="h-4 w-4 mr-2" />
                {universeData.nodeCount} Events Available
              </Badge>
            ) : (
              <Badge className="bg-gray-500/90 backdrop-blur-md text-white border-0 px-4 py-2 text-sm font-semibold">
                No Events Yet
              </Badge>
            )}
            {tokenData && (
              <Badge className="bg-primary/90 backdrop-blur-md text-white border-0 px-4 py-2 text-sm font-semibold">
                ${tokenData.symbol}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-7xl font-bold text-white drop-shadow-2xl leading-tight">
            {universeData.name || tokenData?.name || `Universe ${universeData.id.slice(0, 8)}`}
          </h1>

          {/* Description */}
          <p className="text-xl text-white/90 max-w-2xl leading-relaxed drop-shadow-lg">
            {universeData.description || tokenData?.metadata || "Explore this narrative universe and discover its stories"}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 flex-wrap">
            {hasEvents && (
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 px-10 text-lg h-14 font-bold shadow-2xl"
                onClick={() => navigate({ to: `/universe/${universeData.id}` })}
              >
                <Play className="h-6 w-6 mr-3 fill-black" />
                Watch Timeline
              </Button>
            )}
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 px-10 text-lg h-14 font-bold shadow-2xl"
              onClick={() => onSelect(universeData.id)}
            >
              <Plus className="h-6 w-6 mr-3" />
              Create Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Netflix-style Horizontal Scrolling Row Component
function UniverseRow({
  title,
  universes,
  onSelect,
}: {
  title: string;
  universes: any[];
  onSelect: (address: string) => void;
}) {
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
    ref?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      ref?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [universes]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.9;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
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
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-background/95 hover:bg-background backdrop-blur-sm border-2 border-border text-foreground rounded-full w-12 h-12 opacity-0 group-hover/row:opacity-100 transition-all duration-300 flex items-center justify-center shadow-xl hover:scale-110"
          style={{ marginTop: "24px" }}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Scrollable Container */}
      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <div className="flex gap-4 px-16 py-6">
          {universes.map((u) => (
            <UniverseCard key={u.id} universeData={u} onSelect={onSelect} />
          ))}
        </div>
      </div>

      {/* Right Scroll Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-background/95 hover:bg-background backdrop-blur-sm border-2 border-border text-foreground rounded-full w-12 h-12 opacity-0 group-hover/row:opacity-100 transition-all duration-300 flex items-center justify-center shadow-xl hover:scale-110"
          style={{ marginTop: "24px" }}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

// Netflix-style Universe Card Component
function UniverseCard({ universeData, onSelect }: { universeData: any; onSelect: (address: string) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = Route.useNavigate();

  const hasEvents = universeData.nodeCount && universeData.nodeCount > 0;
  const tokenData = universeData.tokenData;

  return (
    <div
      className="relative flex-shrink-0 w-[320px] cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.08] hover:z-30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transformOrigin: "center center" }}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black/20 shadow-2xl">
        {/* Thumbnail */}
        {universeData.imageURL || tokenData?.imageURL ? (
          <img src={universeData.imageURL || tokenData.imageURL} alt={universeData.name || tokenData?.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
        )}

        {/* Hover Overlay with Info */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute top-4 left-4 right-4 space-y-2">
            <h3 className="text-white font-bold text-lg truncate drop-shadow-lg">
              {universeData.name || tokenData?.name || `Universe ${universeData.id.slice(0, 6)}...${universeData.id.slice(-4)}`}
            </h3>
            <p className="text-white/90 text-sm line-clamp-2 leading-relaxed">
              {universeData.description || tokenData?.metadata || tokenData?.context || "A new narrative universe waiting to be explored"}
            </p>
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {hasEvents ? (
                <Badge className="bg-green-500/90 backdrop-blur-sm text-white border-0 text-xs px-2 py-1">
                  <Play className="h-3 w-3 mr-1" />
                  {universeData.nodeCount} events
                </Badge>
              ) : (
                <Badge className="bg-gray-500/90 backdrop-blur-sm text-white border-0 text-xs px-2 py-1">No events yet</Badge>
              )}
              {tokenData && (
                <Badge className="bg-primary/90 backdrop-blur-sm text-white border-0 text-xs px-2 py-1">
                  ${tokenData.symbol}
                </Badge>
              )}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div
            className={`absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {hasEvents && (
              <Button
                size="sm"
                className="flex-1 bg-white text-black hover:bg-white/90 font-semibold h-10"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({ to: `/universe/${universeData.id}` });
                }}
              >
                <Play className="h-4 w-4 mr-2" />
                Watch
              </Button>
            )}
            <Button
              size="sm"
              className="flex-1 bg-primary text-white hover:bg-primary/90 font-semibold h-10"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(universeData.id);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>
        </div>

        {/* Small badge when not hovering */}
        {!isHovered && (
          <div className="absolute top-2 right-2 flex gap-1">
            {hasEvents && (
              <Badge className="bg-green-500/90 backdrop-blur-sm text-white border-0 text-xs">
                <Play className="h-2.5 w-2.5 mr-1" />
                {universeData.nodeCount}
              </Badge>
            )}
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

  // Query universes from Ponder
  const { data: universesData, error, isLoading } = usePonderQuery({
    queryFn: (db) =>
      db
        .select()
        .from(universe as any)
        .orderBy(desc((universe as any).createdAt))
        .limit(50),
  });

  // Query tokens from Ponder
  const { data: tokensData } = usePonderQuery({
    queryFn: (db) => db.select().from(token as any),
  });

  // Combine universe and token data
  const universes = useMemo(() => {
    if (!universesData) return [];

    type UniverseRow = typeof universe.$inferSelect;
    type TokenRow = typeof token.$inferSelect;

    const tokenMap = new Map<string, TokenRow>();
    if (tokensData) {
      (tokensData as TokenRow[]).forEach((t) => {
        tokenMap.set(t.universeAddress.toLowerCase(), t);
      });
    }

    return (universesData as UniverseRow[]).map((u) => ({
      ...u,
      tokenData: tokenMap.get(u.id.toLowerCase()) || null,
    }));
  }, [universesData, tokensData]);

  // Filter universes by search query
  const filteredUniverses = useMemo(() => {
    if (!searchQuery) return universes;
    const query = searchQuery.toLowerCase();
    return universes.filter((u: any) => {
      const tokenName = u.tokenData?.name?.toLowerCase() || "";
      const tokenSymbol = u.tokenData?.symbol?.toLowerCase() || "";
      const metadata = u.tokenData?.metadata?.toLowerCase() || "";
      const address = u.id.toLowerCase();

      return (
        tokenName.includes(query) ||
        tokenSymbol.includes(query) ||
        metadata.includes(query) ||
        address.includes(query)
      );
    });
  }, [universes, searchQuery]);

  const featuredUniverse = filteredUniverses[0];
  const latestUniverses = filteredUniverses.slice(0, 8);
  const onChainUniverses = filteredUniverses.filter((u: any) => u.tokenData).slice(0, 8);
  const allUniverses = filteredUniverses;

  useEffect(() => {
    if (!isConnected) {
      navigate({ to: "/" });
    }
  }, [isConnected, navigate]);

  const selectUniverse = (universeAddress: string) => {
    navigate({
      to: "/universe/$id",
      params: { id: universeAddress },
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
            <p className="text-white/70">Please connect your wallet to view universes.</p>
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
          <p className="text-foreground text-xl">Loading universes from chain...</p>
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
            ⚠️ Unable to load universes. Make sure Ponder indexer is running.
          </p>
        </div>
      )}

      {/* Main Content */}
      <main>
        {filteredUniverses.length === 0 && !searchQuery ? (
          <div className="flex items-center justify-center min-h-screen text-center px-4">
            <div>
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-12 inline-block">
                  <Users className="h-24 w-24 mx-auto text-white/60" />
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-4">No universes yet</h2>
              <p className="text-white/70 mb-10 text-xl max-w-lg mx-auto leading-relaxed">
                Create your first narrative universe to get started with collaborative storytelling
              </p>
              <Button onClick={createNewUniverse} className="font-bold text-lg px-8" size="lg">
                <Plus className="h-6 w-6 mr-2" />
                Create Your First Universe
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Banner */}
            {featuredUniverse && (
              <section className="mb-16 px-16">
                <HeroBanner universeData={featuredUniverse} onSelect={selectUniverse} />
              </section>
            )}

            {/* Content Rows */}
            <div className="space-y-8 pb-24">
              <UniverseRow title="Latest Universes" universes={latestUniverses} onSelect={selectUniverse} />
              <UniverseRow title="Launched Universes" universes={onChainUniverses} onSelect={selectUniverse} />
              <UniverseRow title="All Universes" universes={allUniverses} onSelect={selectUniverse} />
            </div>
          </>
        )}

        {filteredUniverses.length === 0 && searchQuery && (
          <div className="flex items-center justify-center min-h-screen text-center px-4">
            <div>
              <h2 className="text-3xl font-bold mb-4">No results found</h2>
              <p className="text-white/70 mb-6">Try a different search term</p>
              <Button onClick={() => setSearchQuery("")} variant="outline">
                Clear Search
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Search Bar at Bottom */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
          <Input
            type="text"
            placeholder="Search universes by name, symbol, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 h-14 text-base bg-background/95 backdrop-blur-md border-2 border-border shadow-2xl rounded-full focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Floating Create Universe Button */}
      <div className="fixed bottom-24 right-8 z-50">
        <Button
          onClick={createNewUniverse}
          size="lg"
          className="h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 bg-primary hover:bg-primary/90 group"
          title="Create New Universe"
        >
          <Plus className="h-8 w-8 group-hover:rotate-90 transition-transform duration-300" />
        </Button>
      </div>
    </div>
  );
}
