import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { universes, type Universe, type Timeline } from "@/data/universes";

function UniversesPage() {
  const [selectedUniverse, setSelectedUniverse] = useState<Universe | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(null);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Universes</h1>
        <p className="text-lg text-muted-foreground">
          Explore different narrative universes and their branching timelines
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Available Universes</h2>
          <div className="space-y-4">
            {universes.map((universe) => (
              <Card 
                key={universe.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedUniverse?.id === universe.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => {
                  setSelectedUniverse(universe);
                  setSelectedTimeline(null);
                }}
              >
                <div className="relative">
                  <img 
                    src={universe.imageUrl} 
                    alt={universe.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
                  <div className="absolute bottom-2 left-2 text-white">
                    <h3 className="font-bold text-lg">{universe.name}</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {universe.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline">
                      {universe.timelines.length} Timeline{universe.timelines.length !== 1 ? 's' : ''}
                    </Badge>
                    <Button size="sm" variant="ghost" asChild onClick={(e) => e.stopPropagation()}>
                      <Link to="/universe/$id" params={{ id: universe.id }}>
                        View Graph →
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Timelines</h2>
          {selectedUniverse ? (
            <div className="space-y-4">
              {selectedUniverse.timelines.map((timeline) => (
                <Card 
                  key={timeline.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedTimeline?.id === timeline.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedTimeline(timeline)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{timeline.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {timeline.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {timeline.nodes.length} Event{timeline.nodes.length !== 1 ? 's' : ''}
                      </Badge>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/timeline" search={{ universe: selectedUniverse.id, timeline: timeline.id }}>
                          View Timeline
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Select a universe to view its timelines
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Timeline Events</h2>
          {selectedTimeline ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {selectedTimeline.name}
                    <Badge variant="outline">{selectedUniverse?.name}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedTimeline.description}
                  </p>
                  
                  <div className="space-y-3">
                    {selectedTimeline.nodes.map((node, index) => (
                      <Card key={node.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{node.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              Event {index + 1}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {node.description}
                          </p>

                          <div className="mb-3">
                            <video 
                              className="w-full h-32 object-cover rounded-lg border" 
                              controls
                              preload="metadata"
                            >
                              <source src={node.videoUrl} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                          
                          {node.characters.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-medium mb-1">Characters:</p>
                              <div className="flex flex-wrap gap-1">
                                {node.characters.map((characterId) => (
                                  <Badge key={characterId} variant="secondary" className="text-xs">
                                    {characterId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <Button size="sm" variant="outline" asChild>
                              <a href={node.videoUrl} target="_blank" rel="noopener noreferrer">
                                Watch Full Video
                              </a>
                            </Button>
                            {node.connections.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {node.connections.length} Connection{node.connections.length !== 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button className="w-full" asChild>
                      <Link to="/timeline" search={{ universe: selectedUniverse?.id, timeline: selectedTimeline.id }}>
                        Open Interactive Timeline
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/universe/$id" params={{ id: selectedUniverse?.id || '' }}>
                        View Universe Graph
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Select a timeline to view its events
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/universes")({
  component: UniversesPage,
});