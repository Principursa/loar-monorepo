import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import {
  Play,
  Plus,
  Search,
  TrendingUp,
  Clock,
  Sparkles,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Rocket,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useAccount, useChainId, useSwitchChain, useWaitForTransactionReceipt } from "wagmi";
import { usePonderQuery } from "@ponder/react";
import { useUniverseManager, useDefaultDeploymentConfig } from "@/hooks/useUniverseManager";
import { useMutation } from "@tanstack/react-query";
import { trpcClient } from "@/utils/trpc";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { desc } from "@ponder/client";
import { parseEther } from "viem";
import { UniverseManager } from "@loar/abis/addresses";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  universe,
  token,
  node,
  nodeContent,
  swap,
  tokenTransfer,
  tokenHolder,
  pool,
} from "../../../indexer/ponder.schema";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

// Activity Feed Banner
function ActivityFeedBanner() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: nodesData } = usePonderQuery({
    queryFn: (db) =>
      db
        .select()
        .from(node as any)
        .orderBy(desc((node as any).createdAt))
        .limit(20),
  });

  const { data: nodeContentData } = usePonderQuery({
    queryFn: (db) => db.select().from(nodeContent as any),
  });

  const { data: universesData } = usePonderQuery({
    queryFn: (db) => db.select().from(universe as any),
  });

  const activities = useMemo(() => {
    if (!nodesData || !nodeContentData || !universesData) return [];

    type NodeRow = typeof node.$inferSelect;
    type NodeContentRow = typeof nodeContent.$inferSelect;
    type UniverseRow = typeof universe.$inferSelect;

    const contentMap = new Map<string, NodeContentRow>();
    (nodeContentData as NodeContentRow[]).forEach((c) => {
      contentMap.set(c.id, c);
    });

    const universeMap = new Map<string, UniverseRow>();
    (universesData as UniverseRow[]).forEach((u) => {
      universeMap.set(u.id.toLowerCase(), u);
    });

    return (nodesData as NodeRow[])
      .map((n) => {
        const content = contentMap.get(`${n.universeAddress.toLowerCase()}:${n.nodeId}`);
        const uni = universeMap.get(n.universeAddress.toLowerCase());

        return {
          id: n.id,
          universeName: uni?.name || `Universe ${n.universeAddress.slice(0, 8)}`,
          action: content?.plot ? "Added Event" : "Created Node",
          universeId: n.universeAddress,
          nodeId: n.nodeId,
          timestamp: new Date(Number(n.createdAt) * 1000),
        };
      })
      .slice(0, 15);
  }, [nodesData, nodeContentData, universesData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft >= scrollWidth - clientWidth) {
          scrollRef.current.scrollLeft = 0;
        } else {
          scrollRef.current.scrollLeft += 1;
        }
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  if (activities.length === 0) return null;

  return (
    <div className="bg-black border-b border-border/50 overflow-hidden">
      <div ref={scrollRef} className="flex gap-4 px-4 py-3 overflow-x-hidden whitespace-nowrap">
        {activities.map((activity, index) => (
          <Link
            key={`${activity.id}-${index}`}
            to="/universe/$id"
            params={{ id: activity.universeId }}
            className="flex items-center gap-3 px-4 py-2 bg-muted/30 rounded-full hover:bg-muted/50 transition-colors flex-shrink-0"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">{activity.universeName}</span>
            <span className="text-xs text-muted-foreground">{activity.action}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Featured Universes Carousel
function FeaturedCarousel({ universes }: { universes: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = Route.useNavigate();

  // Show universes with tokens OR events, fallback to all universes
  let featured = universes.filter((u) => u.tokenData || u.nodeCount > 0).slice(0, 5);

  // If no featured universes, show any universes
  if (featured.length === 0) {
    featured = universes.slice(0, 5);
  }

  if (featured.length === 0) return null;

  // Safety check for current index
  if (!featured[currentIndex]) return null;

  const current = featured[currentIndex];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  const prev = () => {
    setCurrentIndex((prevState) => (prevState - 1 + featured.length) % featured.length);
  };

  return (
    <div className="relative mb-8">
      <div className="overflow-hidden rounded-2xl shadow-xl">
        <div className="relative h-[450px] bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20">
          {current.imageURL || current.tokenData?.imageURL ? (
            <img
              src={current.imageURL || current.tokenData.imageURL}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

          <div className="relative h-full flex flex-col justify-between p-8">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/90 text-white">Featured</Badge>
              <Badge className="bg-green-500/90 text-white">{current.nodeCount} Events</Badge>
              {current.holderCount > 0 && (
                <Badge className="bg-purple-500/90 text-white">
                  <Users className="h-3 w-3 mr-1" />
                  {current.holderCount} Holders
                </Badge>
              )}
            </div>

            <div>
              <h2 className="text-5xl font-bold text-white mb-4">
                {current.name || current.tokenData?.name}
              </h2>

              <p className="text-white/80 mb-6 text-lg max-w-xl">
                {current.description || current.tokenData?.metadata}
              </p>

              <div className="flex items-center gap-4">
                <Button size="lg" onClick={() => navigate({ to: `/universe/${current.id}` })}>
                  <Play className="h-5 w-5 mr-2" />
                  Explore Universe
                </Button>
                {current.tokenData && (
                  <div className="text-white">
                    <div className="text-3xl font-bold">${current.tokenData.symbol}</div>
                    {current.swapVolume > 0 && (
                      <div className="text-sm text-white/70">24h Vol: ${(current.swapVolume / 1e18).toFixed(2)}</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={prev} className="text-white hover:bg-white/20">
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button size="icon" variant="ghost" onClick={next} className="text-white hover:bg-white/20">
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              {/* Dots indicator */}
              {featured.length > 1 && (
                <div className="flex gap-2">
                  {featured.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex ? "bg-white w-6" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Copy address button
function CopyAddressButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-muted/50 transition-colors"
    >
      <span className="font-mono text-xs">{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

// Top Universes Table
function TopUniversesTable({ universes, swapData, holderData }: { universes: any[]; swapData: any[]; holderData: any[] }) {
  const navigate = Route.useNavigate();

  if (universes.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4 text-muted-foreground">No Universes Yet</h2>
        <p className="text-muted-foreground mb-6">Be the first to create a narrative universe</p>
      </div>
    );
  }

  const topUniverses = [...universes]
    .sort((a, b) => {
      const aScore = (a.nodeCount || 0) * 100 + (a.tokenData ? 50 : 0) + (a.swapVolume || 0) / 1e18;
      const bScore = (b.nodeCount || 0) * 100 + (b.tokenData ? 50 : 0) + (b.swapVolume || 0) / 1e18;
      return bScore - aScore;
    })
    .slice(0, 15);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Top Universes</h2>
        <Button variant="outline" size="sm" className="rounded-full" asChild>
          <Link to="/cinematicUniverseCreate">
            <Plus className="h-4 w-4 mr-2" />
            Create Universe
          </Link>
        </Button>
      </div>

      <div className="bg-card/30 backdrop-blur-sm rounded-2xl border border-border/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30 bg-muted/20">
                <th className="text-left p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Universe</th>
                <th className="text-left p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Events</th>
                <th className="text-left p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Volume (24h)</th>
                <th className="text-left p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Holders</th>
                <th className="text-left p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Token</th>
                <th className="text-right p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {topUniverses.map((u) => {
                const hasEvents = u.nodeCount > 0;
                const hasToken = !!u.tokenData;
                const volume24h = u.swapVolume || 0;
                const holders = u.holderCount || 0;

                return (
                  <tr
                    key={u.id}
                    className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => navigate({ to: `/universe/${u.id}` })}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        {u.imageURL || u.tokenData?.imageURL ? (
                          <img
                            src={u.imageURL || u.tokenData.imageURL}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-base truncate">
                            {u.name || u.tokenData?.name || `Universe ${u.id.slice(0, 8)}`}
                          </div>
                          <CopyAddressButton address={u.id} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-2xl font-bold">{u.nodeCount || 0}</div>
                      <div className="text-xs text-muted-foreground">events</div>
                    </td>
                    <td className="p-4">
                      {volume24h > 0 ? (
                        <div>
                          <div className="text-lg font-bold">${(volume24h / 1e18).toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">24h volume</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {holders > 0 ? (
                        <div>
                          <div className="text-lg font-bold">{holders}</div>
                          <div className="text-xs text-muted-foreground">holders</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {hasToken ? (
                        <div>
                          <div className="font-semibold">${u.tokenData.symbol}</div>
                          <div className="text-xs text-muted-foreground">Launched</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate({ to: `/universe/${u.id}` });
                        }}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Enhanced Right Sidebar with Wallet, Videos, and Trading
function EnhancedSidebar({ universes }: { universes: any[] }) {
  const { isConnected } = useAccount();

  // Query recent events with video content
  const { data: nodesData } = usePonderQuery({
    queryFn: (db) =>
      db
        .select()
        .from(node as any)
        .orderBy(desc((node as any).createdAt))
        .limit(10),
  });

  const { data: nodeContentData } = usePonderQuery({
    queryFn: (db) => db.select().from(nodeContent as any),
  });

  const eventVideos = useMemo(() => {
    if (!nodesData || !nodeContentData) return [];

    type NodeRow = typeof node.$inferSelect;
    type NodeContentRow = typeof nodeContent.$inferSelect;

    const contentMap = new Map<string, NodeContentRow>();
    (nodeContentData as NodeContentRow[]).forEach((c) => {
      contentMap.set(c.id, c);
    });

    const universeMap = new Map<string, any>();
    universes.forEach((u) => {
      universeMap.set(u.id.toLowerCase(), u);
    });

    return (nodesData as NodeRow[])
      .map((n) => {
        const content = contentMap.get(`${n.universeAddress.toLowerCase()}:${n.nodeId}`);
        const uni = universeMap.get(n.universeAddress.toLowerCase());

        if (!content?.videoLink) return null;

        return {
          id: n.id,
          videoLink: content.videoLink,
          plot: content.plot,
          universeName: uni?.name || `Universe ${n.universeAddress.slice(0, 8)}`,
          universeId: n.universeAddress,
          nodeId: n.nodeId,
          timestamp: Number(n.createdAt) * 1000,
        };
      })
      .filter((v) => v !== null)
      .slice(0, 5);
  }, [nodesData, nodeContentData, universes]);

  const tradableUniverses = universes.filter((u) => u.tokenData).slice(0, 10);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Wallet Connection - Always Visible */}
      <div className="flex-shrink-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl border border-border/30 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-bold text-lg">Wallet</h3>
        </div>
        <WalletConnectButton size="lg" className="w-full rounded-xl" />
        {isConnected && (
          <div className="mt-4 p-4 bg-background/50 rounded-xl border border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <div className="text-sm font-medium">Connected & Ready</div>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Section - Recent Events & Token Trading */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4 min-h-0">
        {/* Recent Event Videos */}
        {eventVideos.length > 0 && (
        <div className="bg-card/30 backdrop-blur-sm rounded-2xl border border-border/30 overflow-hidden">
          <div className="p-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Play className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-bold">Recent Events</h3>
              </div>
              <Badge variant="secondary" className="text-xs">
                {eventVideos.length}
              </Badge>
            </div>
          </div>
          <div className="divide-y divide-border/30">
            {eventVideos.map((event: any) => (
              <Link
                key={event.id}
                to="/event/$universe/$event"
                params={{ universe: event.universeId, event: event.nodeId.toString() }}
                className="block p-3 hover:bg-muted/30 transition-colors group"
              >
                <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden mb-3 group-hover:ring-2 group-hover:ring-primary/50 transition-all">
                  {event.videoLink.includes("walrus") ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                      <Play className="h-10 w-10 text-white/80 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-white/60 font-medium">Walrus Storage</span>
                    </div>
                  ) : (
                    <>
                      <video
                        src={event.videoLink}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Play className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </>
                  )}
                  {/* Time badge */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md">
                    <span className="text-xs text-white font-medium">
                      {new Date(event.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                      {event.universeName}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {event.plot}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Token Trading */}
      {tradableUniverses.length > 0 && (
        <div className="bg-card/30 backdrop-blur-sm rounded-2xl border border-border/30 overflow-hidden">
          <div className="p-4 border-b border-border/30">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-bold">Token Trading</h3>
            </div>
          </div>
          <div className="divide-y divide-border/30">
            {tradableUniverses.map((u) => (
              <Link
                key={u.id}
                to="/universe/$id"
                params={{ id: u.id }}
                className="block p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {u.imageURL || u.tokenData?.imageURL ? (
                      <img src={u.imageURL || u.tokenData.imageURL} alt="" className="w-8 h-8 rounded" />
                    ) : (
                      <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-500" />
                    )}
                    <div>
                      <div className="font-bold text-sm">${u.tokenData.symbol}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {u.name || u.tokenData.name}
                      </div>
                    </div>
                  </div>
                  {u.priceChange24h !== undefined && (
                    <div
                      className={`flex items-center gap-1 text-sm font-bold ${
                        u.priceChange24h >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {u.priceChange24h >= 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {Math.abs(u.priceChange24h).toFixed(2)}%
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Vol: ${((u.swapVolume || 0) / 1e18).toFixed(2)}</span>
                  <span>{u.holderCount || 0} holders</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

// Trending Universes Section
function TrendingUniverses({ universes }: { universes: any[] }) {
  const navigate = Route.useNavigate();

  const trending = [...universes]
    .filter((u) => u.swapVolume > 0 || u.nodeCount > 0)
    .sort((a, b) => {
      const aActivity = (a.swapVolume || 0) + (a.nodeCount || 0) * 1e18;
      const bActivity = (b.swapVolume || 0) + (b.nodeCount || 0) * 1e18;
      return bActivity - aActivity;
    })
    .slice(0, 6);

  if (trending.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6">Trending Universes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trending.map((u) => (
          <div
            key={u.id}
            className="bg-card/30 backdrop-blur-sm rounded-2xl border border-border/30 overflow-hidden hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => navigate({ to: `/universe/${u.id}` })}
          >
            <div className="relative h-48 bg-muted">
              {u.imageURL || u.tokenData?.imageURL ? (
                <img src={u.imageURL || u.tokenData.imageURL} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-bold text-lg text-white mb-1 truncate">
                  {u.name || u.tokenData?.name || `Universe ${u.id.slice(0, 8)}`}
                </h3>
                <div className="flex gap-2">
                  {u.nodeCount > 0 && (
                    <Badge className="bg-green-500/90 text-white text-xs">{u.nodeCount} events</Badge>
                  )}
                  {u.tokenData && (
                    <Badge className="bg-primary/90 text-white text-xs">${u.tokenData.symbol}</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">24h Volume</div>
                  <div className="font-bold">${((u.swapVolume || 0) / 1e18).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Holders</div>
                  <div className="font-bold">{u.holderCount || 0}</div>
                </div>
                <Button size="sm" variant="outline" className="rounded-full group-hover:bg-primary group-hover:text-white">
                  <Play className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeComponent() {
  const { isConnected, address } = useAccount();
  const navigate = Route.useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  // Create Universe form state
  const [universeName, setUniverseName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [deploymentStep, setDeploymentStep] = useState<'idle' | 'creating_universe' | 'universe_created' | 'deploying_token' | 'completed'>('idle');
  const [createdUniverseAddress, setCreatedUniverseAddress] = useState<`0x${string}` | null>(null);
  const [universeId, setUniverseId] = useState<bigint | null>(null);

  // Blockchain hooks
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { createUniverse, deployUniverseToken, hash, isPending, isConfirming, error } = useUniverseManager();
  const defaultConfig = useDefaultDeploymentConfig();
  const { data: txReceipt, isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash: hash as `0x${string}` | undefined,
    query: { enabled: !!hash }
  });

  // Query the highest universe ID from the indexer to know what ID the next universe will get
  const { data: latestUniverseData } = usePonderQuery({
    queryFn: (db) =>
      db
        .select()
        .from(universe as any)
        .orderBy(desc((universe as any).universeId))
        .limit(1),
  });

  // Calculate the next universe ID
  const nextUniverseId = useMemo(() => {
    if (!latestUniverseData || latestUniverseData.length === 0) {
      return BigInt(0); // First universe
    }
    const latestUniverse = latestUniverseData[0];
    if (latestUniverse.universeId !== null && latestUniverse.universeId !== undefined) {
      return BigInt(latestUniverse.universeId) + BigInt(1);
    }
    return BigInt(0);
  }, [latestUniverseData]);

  // Debug: Log nextUniverseId when it changes
  useEffect(() => {
    console.log("nextUniverseId:", nextUniverseId?.toString());
  }, [nextUniverseId]);

  // AI Cover generation
  const generateCoverMutation = useMutation({
    mutationFn: async () => {
      const prompt = `Epic cinematic universe cover art for "${universeName}". ${description}. Professional movie poster style, high quality, dramatic lighting`;
      const result = await trpcClient.fal.generateImage.mutate({
        prompt,
        model: "fal-ai/nano-banana",
        imageSize: "landscape_16_9",
      });
      return result;
    },
    onSuccess: (data) => {
      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
      }
    },
  });

  // Query universes
  const { data: universesData } = usePonderQuery({
    queryFn: (db) =>
      db
        .select()
        .from(universe as any)
        .orderBy(desc((universe as any).createdAt))
        .limit(50),
  });

  // Query tokens
  const { data: tokensData } = usePonderQuery({
    queryFn: (db) => db.select().from(token as any),
  });

  // Query swaps for volume calculation
  const { data: swapsData } = usePonderQuery({
    queryFn: (db) =>
      db
        .select()
        .from(swap as any)
        .orderBy(desc((swap as any).timestamp))
        .limit(1000),
  });

  // Query token holders
  const { data: holdersData } = usePonderQuery({
    queryFn: (db) => db.select().from(tokenHolder as any),
  });

  // Combine all data
  const universes = useMemo(() => {
    if (!universesData) return [];

    type UniverseRow = typeof universe.$inferSelect;
    type TokenRow = typeof token.$inferSelect;
    type SwapRow = typeof swap.$inferSelect;
    type HolderRow = typeof tokenHolder.$inferSelect;

    const tokenMap = new Map<string, TokenRow>();
    if (tokensData) {
      (tokensData as TokenRow[]).forEach((t) => {
        tokenMap.set(t.universeAddress.toLowerCase(), t);
      });
    }

    // Calculate 24h volume per token
    const now = Date.now() / 1000;
    const dayAgo = now - 86400;
    const volumeMap = new Map<string, number>();
    if (swapsData) {
      (swapsData as SwapRow[]).forEach((s) => {
        if (s.timestamp >= dayAgo) {
          const current = volumeMap.get(s.poolId) || 0;
          volumeMap.set(s.poolId, current + Math.abs(Number(s.amount0)));
        }
      });
    }

    // Count holders per token
    const holderCountMap = new Map<string, number>();
    if (holdersData) {
      (holdersData as HolderRow[]).forEach((h) => {
        const current = holderCountMap.get(h.tokenAddress.toLowerCase()) || 0;
        holderCountMap.set(h.tokenAddress.toLowerCase(), current + 1);
      });
    }

    return (universesData as UniverseRow[]).map((u) => {
      const tokenData = tokenMap.get(u.id.toLowerCase());
      const poolId = tokenData?.poolId;
      const swapVolume = poolId ? volumeMap.get(poolId) || 0 : 0;
      const holderCount = tokenData ? holderCountMap.get(tokenData.id.toLowerCase()) || 0 : 0;

      return {
        ...u,
        tokenData,
        swapVolume,
        holderCount,
        priceChange24h: undefined, // Would need historical price data
      };
    });
  }, [universesData, tokensData, swapsData, holdersData]);

  // Filter universes by search query
  const filteredUniverses = useMemo(() => {
    if (!searchQuery) return universes;
    const query = searchQuery.toLowerCase();
    return universes.filter((u: any) => {
      const name = u.name?.toLowerCase() || "";
      const tokenName = u.tokenData?.name?.toLowerCase() || "";
      const tokenSymbol = u.tokenData?.symbol?.toLowerCase() || "";
      const metadata = u.tokenData?.metadata?.toLowerCase() || "";
      const description = u.description?.toLowerCase() || "";
      const address = u.id.toLowerCase();

      return (
        name.includes(query) ||
        tokenName.includes(query) ||
        tokenSymbol.includes(query) ||
        metadata.includes(query) ||
        description.includes(query) ||
        address.includes(query)
      );
    });
  }, [universes, searchQuery]);

  // Handle create universe submission
  const handleCreateUniverse = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first");
      return;
    }

    if (chainId !== 11155111) {
      alert("Please switch to Sepolia network");
      return;
    }

    if (!universeName || !description || !imageUrl || !tokenSymbol) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setDeploymentStep('creating_universe');

      // Create universe with required parameters
      createUniverse({
        name: universeName,
        imageURL: imageUrl,
        description: description,
        nodeCreationOptions: 0, // OPEN - anyone can create nodes
        nodeVisibilityOptions: 0, // PUBLIC - all nodes visible
        initialOwner: address,
      });
    } catch (err) {
      console.error("Universe creation failed:", err);
      setDeploymentStep('idle');
    }
  };

  // Watch for transaction success
  useEffect(() => {
    if (!txSuccess || !createOpen) return;

    if (deploymentStep === 'creating_universe') {
      // Universe creation succeeded
      console.log("Universe created successfully! Transaction:", txReceipt);

      // Parse UniverseCreated event from receipt to get universe address
      if (txReceipt?.logs) {
        const contractAddress = UniverseManager[11155111];

        for (const log of txReceipt.logs) {
          if (log.address.toLowerCase() === contractAddress?.toLowerCase()) {
            try {
              // Decode the log data - universe address is the first 20 bytes after padding
              const universeAddress = `0x${log.data.slice(26, 66)}` as `0x${string}`;
              console.log("Extracted universe address from event:", universeAddress);
              setCreatedUniverseAddress(universeAddress);

              // The universe ID is the next sequential ID calculated from the indexer
              // Our universe should have this ID since we just created it
              console.log("Setting universe ID to:", nextUniverseId.toString());
              setUniverseId(nextUniverseId);

              setDeploymentStep('universe_created');
              break;
            } catch (err) {
              console.error("Error parsing universe address from log:", err);
            }
          }
        }
      }
    } else if (deploymentStep === 'deploying_token') {
      // Token deployment succeeded
      console.log("Token deployed successfully! Transaction:", txReceipt);
      setDeploymentStep('completed');

      // Close modal after showing success
      setTimeout(() => {
        handleCloseCreate();
      }, 3000);
    }
  }, [txSuccess, deploymentStep, createOpen, txReceipt, nextUniverseId]);

  // Handle token deployment (step 2)
  const handleDeployToken = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first");
      return;
    }

    if (!universeId) {
      alert("Universe ID not available. Please try creating the universe again.");
      return;
    }

    if (!tokenSymbol) {
      alert("Please enter a token symbol");
      return;
    }

    try {
      setDeploymentStep('deploying_token');

      // Deploy token with full configuration
      deployUniverseToken(
        {
          tokenConfig: {
            tokenAdmin: address,
            name: universeName,
            symbol: tokenSymbol,
            imageURL: imageUrl,
            metadata: `Token for ${universeName}`,
            context: description,
          },
          poolConfig: {
            hook: defaultConfig.defaultHook,
            pairedToken: defaultConfig.defaultPairedToken,
            tickIfToken0IsLoar: defaultConfig.defaultTickIfToken0IsLoar,
            tickSpacing: defaultConfig.defaultTickSpacing,
            poolData: "0x" as `0x${string}`,
          },
          lockerConfig: {
            locker: defaultConfig.defaultLocker,
            rewardAdmins: [address],
            rewardRecipients: [address],
            rewardBps: [1000],
            tickLower: [-887220],
            tickUpper: [887220],
            positionBps: [10000],
            lockerData: "0x" as `0x${string}`,
          },
        },
        universeId,
        parseEther("0.01") // Initial liquidity - 0.01 ETH
      );
    } catch (err) {
      console.error("Token deployment failed:", err);
      alert(`Token deployment failed: ${err instanceof Error ? err.message : "Unknown error"}`);
      setDeploymentStep('universe_created');
    }
  };

  const handleCloseCreate = () => {
    setCreateOpen(false);
    setUniverseName("");
    setTokenSymbol("");
    setImageUrl("");
    setDescription("");
    setDeploymentStep('idle');
    setCreatedUniverseAddress(null);
    setUniverseId(null);
  };

  // Handle switch network
  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: 11155111 });
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Navigation Bar */}
      <div className={`sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 ${searchOpen || createOpen ? 'pointer-events-none' : ''}`}>
        <div className="container mx-auto max-w-[1800px] px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src="/loarlogo.svg" alt="LOAR" className="h-8 w-auto" />
            </Link>

            {/* Right: Search + Launch Button */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-9 h-9"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Launch Button */}
              <Button
                className="rounded-full bg-primary hover:bg-primary/90 font-medium px-6"
                onClick={() => setCreateOpen(true)}
              >
                Launch Now
                <Play className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <>
          {/* Backdrop - separate layer */}
          <div
            className="fixed inset-0 z-[100] bg-black/60"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-20 px-4 pointer-events-none">
            <div className="relative w-full max-w-2xl bg-background/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden pointer-events-auto">
            {/* Search Input */}
            <div className="p-6 border-b border-border/30">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search universes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-12 pr-12 h-12 text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <Plus className="h-5 w-5 rotate-45" />
                </Button>
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {searchQuery ? (
                filteredUniverses.length > 0 ? (
                  <div className="p-2">
                    {filteredUniverses.slice(0, 8).map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          navigate({ to: `/universe/${u.id}` });
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="w-full p-4 rounded-xl hover:bg-muted/50 transition-colors text-left flex items-center gap-4"
                      >
                        {/* Universe Image */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                          {u.imageURL || u.tokenData?.imageURL ? (
                            <img
                              src={u.imageURL || u.tokenData.imageURL}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>

                        {/* Universe Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm mb-1">
                            {u.name || u.tokenData?.name || `Universe ${u.id.slice(0, 8)}`}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {u.description || u.tokenData?.metadata || "No description"}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {u.nodeCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {u.nodeCount} events
                            </Badge>
                          )}
                          {u.tokenData && (
                            <Badge className="text-xs">
                              ${u.tokenData.symbol}
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-muted-foreground">
                    No universes found matching "{searchQuery}"
                  </div>
                )
              ) : (
                <div className="p-6">
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending Universes
                  </h3>
                  <div className="space-y-1">
                    {universes.filter((u) => u.tokenData || u.nodeCount > 0).slice(0, 6).map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          navigate({ to: `/universe/${u.id}` });
                          setSearchOpen(false);
                        }}
                        className="w-full p-3 rounded-xl hover:bg-muted/50 transition-colors text-left flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                          {u.imageURL || u.tokenData?.imageURL ? (
                            <img
                              src={u.imageURL || u.tokenData.imageURL}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">
                            {u.name || u.tokenData?.name || `Universe ${u.id.slice(0, 8)}`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {u.tokenData?.symbol || `${u.nodeCount} events`}
                          </div>
                        </div>
                        {u.swapVolume > 0 && (
                          <div className="text-xs text-green-500 font-medium">
                            ${(u.swapVolume / 1e18).toFixed(2)}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>
        </>
      )}

      {/* Create Universe Modal */}
      {createOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[100] bg-black/60"
            onClick={handleCloseCreate}
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center px-4 py-8 pointer-events-none overflow-y-auto">
            <div className="w-full max-w-2xl bg-background border border-border rounded-2xl shadow-2xl pointer-events-auto my-auto overflow-hidden">
              {/* Header */}
              <div className="bg-background/95 backdrop-blur-xl border-b border-border px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Rocket className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Create Your Universe</h2>
                </div>
                <button
                  onClick={handleCloseCreate}
                  className="hover:bg-muted rounded-lg p-2 transition-colors"
                  aria-label="Close"
                >
                  <Plus className="h-5 w-5 rotate-45" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-4">
                {/* Progress Steps */}
                {(deploymentStep === 'creating_universe' || deploymentStep === 'universe_created' || deploymentStep === 'deploying_token' || deploymentStep === 'completed') && (
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className={`flex items-center gap-2 ${deploymentStep === 'creating_universe' || deploymentStep === 'universe_created' || deploymentStep === 'deploying_token' || deploymentStep === 'completed' ? 'text-primary' : 'text-muted-foreground'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${deploymentStep === 'creating_universe' || deploymentStep === 'universe_created' || deploymentStep === 'deploying_token' || deploymentStep === 'completed' ? 'bg-primary text-white' : 'bg-muted'}`}>
                        {deploymentStep === 'universe_created' || deploymentStep === 'deploying_token' || deploymentStep === 'completed' ? <Check className="h-4 w-4" /> : '1'}
                      </div>
                      <span className="text-sm font-medium">Create Universe</span>
                    </div>
                    <div className={`h-px w-12 ${deploymentStep === 'universe_created' || deploymentStep === 'deploying_token' || deploymentStep === 'completed' ? 'bg-primary' : 'bg-muted'}`} />
                    <div className={`flex items-center gap-2 ${deploymentStep === 'deploying_token' || deploymentStep === 'completed' ? 'text-primary' : 'text-muted-foreground'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${deploymentStep === 'deploying_token' || deploymentStep === 'completed' ? 'bg-primary text-white' : 'bg-muted'}`}>
                        {deploymentStep === 'completed' ? <Check className="h-4 w-4" /> : '2'}
                      </div>
                      <span className="text-sm font-medium">Deploy Token</span>
                    </div>
                  </div>
                )}

                {/* Wallet & Network Check */}
                {!isConnected ? (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-500">Wallet Not Connected</p>
                      <p className="text-sm text-muted-foreground mt-1">Please connect your wallet to create a universe</p>
                      <WalletConnectButton className="mt-3" />
                    </div>
                  </div>
                ) : chainId !== 11155111 ? (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-500">Wrong Network</p>
                      <p className="text-sm text-muted-foreground mt-1">Please switch to Sepolia testnet</p>
                      <Button onClick={handleSwitchNetwork} className="mt-3" size="sm">
                        Switch to Sepolia
                      </Button>
                    </div>
                  </div>
                ) : null}

                {/* Step 1: Universe Creation Fields */}
                {(deploymentStep === 'idle' || deploymentStep === 'creating_universe') && (
                  <>
                    {/* Universe Name */}
                    <div className="space-y-2">
                      <Label htmlFor="universeName" className="text-sm font-medium">
                        Universe Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="universeName"
                        value={universeName}
                        onChange={(e) => setUniverseName(e.target.value)}
                        placeholder="e.g., Marvel Cinematic Universe"
                        className="h-11"
                        disabled={deploymentStep !== 'idle'}
                      />
                    </div>

                    {/* Token Symbol */}
                    <div className="space-y-2">
                      <Label htmlFor="tokenSymbol" className="text-sm font-medium">
                        Token Symbol <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="tokenSymbol"
                        value={tokenSymbol}
                        onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                        placeholder="e.g., MCU"
                        className="h-11"
                        maxLength={6}
                        disabled={deploymentStep !== 'idle'}
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum 6 characters
                      </p>
                    </div>

                    {/* Cover Image */}
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl" className="text-sm font-medium">
                        Cover Image <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="imageUrl"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://..."
                          className="h-11 flex-1"
                          disabled={deploymentStep !== 'idle'}
                        />
                        <Button
                          onClick={() => generateCoverMutation.mutate()}
                          disabled={!universeName || generateCoverMutation.isPending || deploymentStep !== 'idle'}
                          variant="outline"
                          className="flex-shrink-0"
                        >
                          {generateCoverMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              AI Generate
                            </>
                          )}
                        </Button>
                      </div>
                      {imageUrl && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-border bg-muted">
                          <img
                            src={imageUrl}
                            alt="Universe cover preview"
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your cinematic universe... This will be used for AI generation and token metadata"
                        className="min-h-[60px] resize-none"
                        disabled={deploymentStep !== 'idle'}
                      />
                      <p className="text-xs text-muted-foreground">
                        {description.length} characters
                      </p>
                    </div>
                  </>
                )}

                {/* Step 2: Token Deployment - Success Message */}
                {deploymentStep === 'universe_created' && (
                  <div className="space-y-3">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-500">Universe Created Successfully!</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Enter the Universe ID to continue with token deployment
                          </p>
                          {hash && (
                            <a
                              href={`https://sepolia.etherscan.io/tx/${hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline mt-2 inline-flex items-center gap-1"
                            >
                              View transaction on Etherscan
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Universe ID Display */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Universe Details
                      </Label>
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <div className="text-sm font-medium text-green-500">Universe Created</div>
                        </div>
                        {universeId !== null && (
                          <div className="text-xs text-muted-foreground">
                            Universe ID: <span className="font-mono font-medium text-foreground">{universeId.toString()}</span>
                          </div>
                        )}
                        {createdUniverseAddress && (
                          <div className="text-xs text-muted-foreground">
                            Contract: <span className="font-mono font-medium text-foreground">{createdUniverseAddress.slice(0, 6)}...{createdUniverseAddress.slice(-4)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-500">Transaction Failed</p>
                      <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
                    </div>
                  </div>
                )}

                {/* Transaction Status */}
                {(isPending || isConfirming || (deploymentStep !== 'idle' && deploymentStep !== 'universe_created' && deploymentStep !== 'completed')) && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
                    <Loader2 className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0 animate-spin" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-500">
                        {isPending && deploymentStep === 'creating_universe' && "Confirm universe creation in wallet..."}
                        {isPending && deploymentStep === 'deploying_token' && "Confirm token deployment in wallet..."}
                        {isConfirming && deploymentStep === 'creating_universe' && "Creating universe..."}
                        {isConfirming && deploymentStep === 'deploying_token' && "Deploying token & liquidity pool..."}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {isPending && "Please confirm the transaction in your wallet"}
                        {isConfirming && "Waiting for transaction confirmation on the blockchain"}
                      </p>
                      {deploymentStep === 'deploying_token' && (
                        <p className="text-xs text-blue-400 mt-2">
                          This will deploy your token, governor contract, and create a liquidity pool with 0.01 ETH
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Success Status */}
                {deploymentStep === 'completed' && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-500">Universe Fully Deployed!</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your universe with token, governance, and liquidity pool is now live. Start creating stories!
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleCloseCreate}
                    disabled={deploymentStep === 'creating_universe' || deploymentStep === 'deploying_token'}
                    className="flex-1"
                  >
                    {deploymentStep === 'completed' ? 'Close' : 'Cancel'}
                  </Button>

                  {/* Step 1 Button: Create Universe */}
                  {(deploymentStep === 'idle' || deploymentStep === 'creating_universe') && (
                    <Button
                      onClick={handleCreateUniverse}
                      disabled={
                        !isConnected ||
                        chainId !== 11155111 ||
                        !universeName ||
                        !description ||
                        !imageUrl ||
                        !tokenSymbol ||
                        deploymentStep === 'creating_universe' ||
                        isPending ||
                        isConfirming
                      }
                      className="flex-1"
                    >
                      {deploymentStep === 'creating_universe' || isPending || isConfirming ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Universe...
                        </>
                      ) : (
                        <>
                          <Rocket className="h-4 w-4 mr-2" />
                          Create Universe
                        </>
                      )}
                    </Button>
                  )}

                  {/* Step 2 Button: Deploy Token */}
                  {deploymentStep === 'universe_created' && (
                    <Button
                      onClick={handleDeployToken}
                      disabled={
                        !isConnected ||
                        chainId !== 11155111 ||
                        !universeId ||
                        !tokenSymbol
                      }
                      className="flex-1"
                      title={!universeId ? "Universe ID is required to deploy token" : ""}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Deploy Token & Pool
                    </Button>
                  )}

                  {/* Deploying State */}
                  {deploymentStep === 'deploying_token' && (
                    <Button disabled className="flex-1">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deploying Token...
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className={`container mx-auto max-w-[1600px] py-8 px-4 transition-all ${searchOpen || createOpen ? 'pointer-events-none blur-sm' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start">
          {/* Left - Main Content */}
          <div className="min-w-0">
            {/* Featured Carousel */}
            <FeaturedCarousel universes={universes} />

            {/* Top Universes Table */}
            <TopUniversesTable
              universes={universes}
              swapData={swapsData || []}
              holderData={holdersData || []}
            />

            {/* Trending Universes */}
            <TrendingUniverses universes={universes} />
          </div>

          {/* Right - Enhanced Sidebar */}
          <aside className="hidden lg:block w-[400px]">
            <div
              className="fixed w-[400px]"
              style={{
                top: '96px',
                height: 'calc(100vh - 112px)',
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden' as const,
                perspective: 1000,
              }}
            >
              <EnhancedSidebar universes={universes} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
