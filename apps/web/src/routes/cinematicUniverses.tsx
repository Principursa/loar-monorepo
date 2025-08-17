import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader";

export const Route = createFileRoute("/cinematicUniverses")({
  component: CinematicUniverses,
});

function CinematicUniverses() {
  const { data, isLoading, error } = useQuery(trpc.cinematicUniverses.getAll.queryOptions());

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-destructive">Error loading cinematic universes: {error.message}</p>
        </div>
      </div>
    );
  }

  const universes = data?.data || [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cinematic Universes</h1>
        <Link to="/cinematicUniverseCreate">
          <Button>Create New Universe</Button>
        </Link>
      </div>

      {universes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No cinematic universes found</p>
          <Link to="/cinematicUniverseCreate">
            <Button>Create the First Universe</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universes.map((universe) => (
            <Card key={universe.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg truncate">
                    {universe.description.split(' ').slice(0, 4).join(' ')}
                    {universe.description.split(' ').length > 4 && '...'}
                  </CardTitle>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {universe.image_url && (
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={universe.image_url}
                      alt="Universe"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {universe.description}
                </p>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-medium">Creator:</span>
                    <span className="ml-1 font-mono">
                      {universe.creator.slice(0, 6)}...{universe.creator.slice(-4)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Timeline:</span>
                    <span className="ml-1 font-mono">
                      {universe.address.slice(0, 6)}...{universe.address.slice(-4)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>
                    <span className="ml-1">
                      {new Date(universe.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to="/cinematicUniverses/$id" params={{ id: universe.id }}>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                  </Link>
                  <Link to="/timeline" search={{ universe: universe.id }}>
                    <Button size="sm" className="flex-1">
                      Open Timeline
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}