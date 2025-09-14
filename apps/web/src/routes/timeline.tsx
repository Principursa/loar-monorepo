import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { universes } from "@/data/universes";
import { ArrowRight, Play } from "lucide-react";
import { TimelineFlowWithData } from "@/components/flow/TimelineFlowWithData";
import { useQuery } from "@tanstack/react-query";

// Simple tab components to avoid import errors
const Tabs = ({ defaultValue, className, children }: { defaultValue: string, className?: string, children: React.ReactNode }) => (
  <div className={className} data-default-value={defaultValue}>{children}</div>
);

const TabsList = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`flex space-x-2 ${className || ''}`}>{children}</div>
);

const TabsTrigger = ({ value, children }: { value: string, children: React.ReactNode }) => (
  <button className="px-4 py-2 rounded-md hover:bg-gray-100" data-value={value}>{children}</button>
);

const TabsContent = ({ value, className, children }: { value: string, className?: string, children: React.ReactNode }) => (
  <div className={className} data-value={value}>{children}</div>
);

interface TimelineSearch {
  universe?: string;
  timeline?: string;
}

function TimelinePage() {
  const search = useSearch({ from: "/timeline" }) as TimelineSearch;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Try to get universe data from localStorage for blockchain universes
  const { data: localUniverses } = useQuery({
    queryKey: ['local-universes'],
    queryFn: async () => {
      try {
        const stored = localStorage.getItem('createdUniverses');
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.log('localStorage not available');
        return [];
      }
    },
    enabled: true,
    retry: 1
  });

  // Check if this is a blockchain universe (contract address format)
  const isBlockchainUniverse = search.universe?.startsWith('0x');
  
  let universe, timeline;
  
  if (isBlockchainUniverse) {
    // Look for universe in localStorage
    const localUniverse = localUniverses?.find((u: any) => u.id === search.universe);
    
    // For blockchain universes, create universe object from localStorage + contract address
    universe = {
      id: search.universe,
      name: localUniverse?.name || `Universe ${search.universe?.slice(0, 8)}...`,
      description: localUniverse?.description || 'Blockchain-based cinematic universe',
      imageUrl: localUniverse?.imageUrl || '',
      timelines: [{
        id: 'main',
        name: 'Main Timeline',
        description: 'Blockchain-based narrative timeline',
        nodes: [] // Will be loaded from contract
      }]
    };
    timeline = universe.timelines[0];
  } else {
    // Use static data for demo universes
    universe = universes.find(u => u.id === search.universe);
    timeline = universe?.timelines.find(t => t.id === search.timeline);
  }

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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-4">{timeline.name}</h1>
            <p className="text-lg text-muted-foreground">
              {timeline.description}
            </p>
          </div>
          <Button 
            size="lg" 
            className="flex items-center gap-2" 
            variant="default"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Play className="h-5 w-5" />
            Post New Narrative Content
          </Button>
        </div>
      </div>

      <Tabs defaultValue="graph" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="graph">Interactive Timeline</TabsTrigger>
          <TabsTrigger value="events">Timeline Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="graph" className="space-y-6">
          {/* Blockchain-connected Timeline Flow Editor */}
          <TimelineFlowWithData 
            universeId={search.universe || ''} 
            timelineId={search.timeline || ''} 
            rootNodeId={0} // You would get this from the blockchain
            isCreateDialogOpen={isCreateDialogOpen}
            setIsCreateDialogOpen={setIsCreateDialogOpen}
            timelineAddress={isBlockchainUniverse ? search.universe : undefined}
          />
        </TabsContent>
        
        <TabsContent value="events">
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
                        Static timeline graph visualization
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

                      <div>
                        <video 
                          className="w-full h-48 object-cover rounded-lg border" 
                          controls
                          preload="metadata"
                        >
                          <source src={node.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      
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
                        <Button size="sm" className="flex items-center gap-2" asChild>
                          <a href={node.videoUrl} target="_blank" rel="noopener noreferrer">
                            <Play className="w-4 h-4" />
                            Watch Full Video
                          </a>
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
        </TabsContent>
      </Tabs>
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