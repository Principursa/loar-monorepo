import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { universes } from "@/data/universes";
import { ArrowRight, Play } from "lucide-react";

interface TimelineSearch {
  universe?: string;
  timeline?: string;
}

function TimelinePage() {
  const search = useSearch({ from: "/timeline" }) as TimelineSearch;
  
  const universe = universes.find(u => u.id === search.universe);
  const timeline = universe?.timelines.find(t => t.id === search.timeline);

  if (!universe || !timeline) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Timeline Not Found</h2>
            <p className="text-muted-foreground">
              The requested timeline could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline">{universe.name}</Badge>
          <ArrowRight className="w-4 h-4" />
          <Badge variant="secondary">{timeline.name}</Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">{timeline.name}</h1>
        <p className="text-lg text-muted-foreground">
          {timeline.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Timeline Graph</h2>
          <Card className="p-6">
            <div className="relative min-h-[400px] bg-muted/10 rounded-lg border-2 border-dashed border-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {timeline.nodes.map((node, index) => (
                      <div
                        key={node.id}
                        className="relative bg-background border rounded-lg p-3 shadow-sm"
                        style={{
                          gridColumn: node.connections.length === 0 ? "span 2" : "auto"
                        }}
                      >
                        <div className="text-sm font-medium mb-1 line-clamp-1">
                          {node.title}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Event {index + 1}
                        </Badge>
                        
                        {node.connections.length > 0 && index < timeline.nodes.length - 1 && (
                          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-6">
                    Interactive timeline graph visualization
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Timeline Events</h2>
          <div className="space-y-4">
            {timeline.nodes.map((node, index) => (
              <Card key={node.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{node.title}</span>
                    <Badge variant="outline">Event {index + 1}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {node.description}
                  </p>
                  
                  {node.characters.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Featured Characters:</h4>
                      <div className="flex flex-wrap gap-2">
                        {node.characters.map((characterId) => (
                          <Badge key={characterId} variant="secondary">
                            {characterId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <Button size="sm" className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Watch Event
                    </Button>
                    
                    {node.connections.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Leads to:</span>
                        <Badge variant="outline" className="text-xs">
                          {node.connections.length} event{node.connections.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/timeline")({
  component: TimelinePage,
  validateSearch: (search: Record<string, unknown>): TimelineSearch => {
    return {
      universe: typeof search.universe === 'string' ? search.universe : undefined,
      timeline: typeof search.timeline === 'string' ? search.timeline : undefined,
    };
  },
});