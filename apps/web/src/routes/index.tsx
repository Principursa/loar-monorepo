import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Sparkles, Database, Users, GitBranch, ChevronRight, Video } from "lucide-react";
import { useAccount, useReadContract } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { timelineAbi } from "@/generated";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

// Universe Card Component (reused from universes page)
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
      className="relative flex-shrink-0 w-[320px] cursor-pointer transition-all duration-300 ease-out hover:scale-110 hover:z-30"
      onClick={() => onSelect(universe.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted shadow-2xl">
        {universe.image_url ? (
          <img
            src={universe.image_url}
            alt={universe.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
        )}

        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <h3 className="text-white font-bold text-lg truncate drop-shadow-lg">{universe.name}</h3>
            <p className="text-gray-200 text-sm line-clamp-2 leading-relaxed">
              {universe.description || "Explore this narrative universe"}
            </p>
            <div className="flex items-center gap-2 pt-1">
              {universe.address && (
                <Badge className="bg-white/30 backdrop-blur-sm text-white border-0 text-xs px-2 py-1">
                  <Database className="h-3 w-3 mr-1" />
                  {nodeCount || 0} nodes
                </Badge>
              )}
              <Badge className="bg-primary/80 backdrop-blur-sm text-white border-0 text-xs px-2 py-1">
                {universe.address ? 'On-chain' : 'Off-chain'}
              </Badge>
            </div>
          </div>
        </div>

        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-white/30 backdrop-blur-md rounded-full p-3 border-2 border-white shadow-2xl">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>

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

function HomeComponent() {
  const { isConnected } = useAccount();
  const navigate = Route.useNavigate();

  // Fetch universes
  const { data: universesResponse } = useQuery(trpc.cinematicUniverses.getAll.queryOptions());

  const universes = useMemo(() => {
    if (!universesResponse?.data) return [];
    return universesResponse.data.map((universe: any) => ({
      ...universe,
      name: `Universe ${universe.id.slice(0, 8)}`,
      createdAt: universe.created_at,
    }));
  }, [universesResponse]);

  const recentUniverses = universes.slice(0, 6);

  const selectUniverse = (universeId: string) => {
    navigate({
      to: "/universe/$id",
      params: { id: universeId },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Video */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />

        <div className="relative container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text */}
            <div className="text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Blockchain-Powered Storytelling</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Rebuild Your Own{" "}
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Narrative Path
                </span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Create collaborative cinematic universes where your community decides the canon.
                Build branching timelines, vote on events, and own your stories forever.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-10 h-14 font-semibold shadow-lg shadow-primary/20" asChild>
                  <Link to="/universes">
                    <Play className="w-5 h-5 mr-2" />
                    Explore Universes
                  </Link>
                </Button>
                {isConnected && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-10 h-14 font-semibold border-2"
                    asChild
                  >
                    <Link to="/cinematicuniversecreate">
                      Create Universe
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Right side - Video Example */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-2xl" />
              <div className="relative">
                <div className="aspect-video bg-card rounded-2xl border-2 border-border shadow-2xl overflow-hidden backdrop-blur-sm">
                  <video
                    className="w-full h-full object-cover"
                    controls
                    poster="/loar-video-generation-preview.png"
                  >
                    <source
                      src="https://aggregator.walrus-testnet.walrus.space/v1/blobs/SfYobs0IsGUYorA898m0k2mQxK4wud5HotOyysKGrs0"
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Universes Section */}
      {recentUniverses.length > 0 && (
        <section className="py-20 px-4 bg-muted/30 border-y border-border">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-10 px-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Recent Universes</h2>
                <p className="text-muted-foreground">Explore what the community is building</p>
              </div>
              <Button variant="ghost" className="font-semibold" asChild>
                <Link to="/universes" className="text-primary">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>

            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-4 px-4 pb-4">
                {recentUniverses.map((universe) => (
                  <UniverseCard key={universe.id} universe={universe} onSelect={selectUniverse} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Own Path</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create branching narratives where every decision matters
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg text-center group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Deploy Universe</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Launch your narrative universe with governance tokens and immutable timeline contracts
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-500/50 transition-all hover:shadow-lg text-center group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <GitBranch className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Build Timeline</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Create branching story paths with AI characters, videos, and decentralized content storage
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-pink-500/50 transition-all hover:shadow-lg text-center group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-pink-500/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Vote on Canon</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Community governance decides which story branches become the official timeline
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />

        <div className="relative container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Start Your Story Today</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to Build Your{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Universe?
            </span>
          </h2>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            {isConnected
              ? "Deploy your universe and invite collaborators to shape the story together"
              : "Connect your wallet to start creating collaborative narratives"
            }
          </p>

          {isConnected ? (
            <Button size="lg" className="text-lg px-12 h-16 font-bold shadow-2xl shadow-primary/20" asChild>
              <Link to="/cinematicuniversecreate">
                <Sparkles className="w-5 h-5 mr-2" />
                Create Your Universe
              </Link>
            </Button>
          ) : (
            <Button size="lg" className="text-lg px-12 h-16 font-bold shadow-2xl shadow-primary/20" asChild>
              <Link to="/universes">
                <Play className="w-5 h-5 mr-2" />
                Explore Universes
              </Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
