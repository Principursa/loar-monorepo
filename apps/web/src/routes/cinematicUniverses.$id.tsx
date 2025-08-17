import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader";
import { ExternalLink, Calendar, User, Coins, Vote, Clock } from "lucide-react";

export const Route = createFileRoute("/cinematicUniverses/$id")({
  component: CinematicUniverseDetail,
});

function CinematicUniverseDetail() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useQuery(trpc.cinematicUniverses.get.queryOptions({ id }));

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-destructive">Error loading cinematic universe: {error.message}</p>
          <Link to="/cinematicUniverses">
            <Button variant="outline" className="mt-4">
              Back to All Universes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const universe = data?.data;

  if (!universe) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Cinematic universe not found</p>
          <Link to="/cinematicUniverses">
            <Button variant="outline" className="mt-4">
              Back to All Universes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Link to="/cinematicUniverses">
          <Button variant="outline" size="sm">
            ← Back to All Universes
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Universe Overview</span>
                <Badge variant="secondary">Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {universe.image_url && (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={universe.image_url}
                    alt="Universe"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{universe.description}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Created {new Date(universe.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Contract Information */}
          <Card>
            <CardHeader>
              <CardTitle>Smart Contracts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Timeline Contract</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {universe.address.slice(0, 10)}...{universe.address.slice(-8)}
                    </code>
                    <Button variant="ghost" size="sm" asChild>
                      <a 
                        href={`https://sepolia.etherscan.io/address/${universe.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    <span className="font-medium">Governance Token</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {universe.tokenAddress.slice(0, 10)}...{universe.tokenAddress.slice(-8)}
                    </code>
                    <Button variant="ghost" size="sm" asChild>
                      <a 
                        href={`https://sepolia.etherscan.io/address/${universe.tokenAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Vote className="w-4 h-4" />
                    <span className="font-medium">Governor Contract</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {universe.governanceAddress.slice(0, 10)}...{universe.governanceAddress.slice(-8)}
                    </code>
                    <Button variant="ghost" size="sm" asChild>
                      <a 
                        href={`https://sepolia.etherscan.io/address/${universe.governanceAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Creator</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {universe.creator.slice(0, 10)}...{universe.creator.slice(-8)}
                    </code>
                    <Button variant="ghost" size="sm" asChild>
                      <a 
                        href={`https://sepolia.etherscan.io/address/${universe.creator}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/timeline" search={{ universe: universe.id }}>
                <Button className="w-full">
                  Open Timeline
                </Button>
              </Link>
              
              <Link to="/flow" search={{ universe: universe.id }}>
                <Button variant="outline" className="w-full">
                  Flow Editor
                </Button>
              </Link>
              
              <Button variant="outline" className="w-full" disabled>
                Governance (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Universe ID:</span>
                <code className="text-xs">{universe.id.slice(0, 8)}...</code>
              </div>
              <div className="flex justify-between">
                <span>Created:</span>
                <span>{new Date(universe.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span>{new Date(universe.updated_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contract Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                <a 
                  href={`https://sepolia.etherscan.io/address/${universe.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  View Timeline Contract
                </a>
              </Button>
              
              <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                <a 
                  href={`https://sepolia.etherscan.io/address/${universe.tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  View Token Contract
                </a>
              </Button>
              
              <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                <a 
                  href={`https://sepolia.etherscan.io/address/${universe.governanceAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  View Governor Contract
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}