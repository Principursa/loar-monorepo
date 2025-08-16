import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { universes } from "@/data/universes";
import { ArrowLeft, Play, Users, Calendar } from "lucide-react";

interface EventParams {
  universeId: string;
  timelineId: string;
  eventId: string;
}

function EventDetailPage() {
  const { universeId, timelineId, eventId } = useParams({ from: "/event/$universeId/$timelineId/$eventId" });
  
  const universe = universes.find(u => u.id === universeId);
  const timeline = universe?.timelines.find(t => t.id === timelineId);
  const event = timeline?.nodes.find(n => n.id === eventId);

  if (!universe || !timeline || !event) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The requested event could not be found.
            </p>
            <Button asChild>
              <Link to="/universes">Back to Universes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/universes" className="hover:text-foreground">
            Universes
          </Link>
          <span>/</span>
          <Link to="/universe/$id" params={{ id: universeId }} className="hover:text-foreground">
            {universe.name}
          </Link>
          <span>/</span>
          <span>{timeline.name}</span>
          <span>/</span>
          <span className="text-foreground font-medium">{event.title}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{event.title}</CardTitle>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{timeline.name}</Badge>
                    <Badge variant="secondary">{universe.name}</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/universe/$id" params={{ id: universeId }}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Graph
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                {event.description}
              </p>
            </CardContent>
          </Card>

          {/* Video Section */}
          <Card>
            <CardHeader>
              <CardTitle>Event Video</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <video 
                  className="w-full aspect-video object-cover rounded-lg border" 
                  controls
                  preload="metadata"
                >
                  <source src={event.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                <div className="flex items-center justify-between">
                  <Button asChild>
                    <a href={event.videoUrl} target="_blank" rel="noopener noreferrer">
                      <Play className="w-4 h-4 mr-2" />
                      Open in Walrus
                    </a>
                  </Button>
                  
                  <p className="text-sm text-muted-foreground">
                    Stored on Walrus Protocol
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Characters Section */}
          {event.characters && event.characters.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Featured Characters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {event.characters.map((characterId) => (
                    <Card key={characterId} className="border">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-sm">
                          {characterId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Character ID: {characterId}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Timeline Position</h4>
                <p className="text-sm text-muted-foreground">
                  Event {timeline.nodes.indexOf(event) + 1} of {timeline.nodes.length}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Characters Involved</h4>
                <p className="text-2xl font-bold">{event.characters?.length || 0}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Connections</h4>
                <p className="text-sm text-muted-foreground">
                  {event.connections.length > 0 
                    ? `Leads to ${event.connections.length} other event${event.connections.length !== 1 ? 's' : ''}`
                    : 'End of timeline branch'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Connected Events */}
          {event.connections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Next Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {event.connections.map((connectionId) => {
                    const connectedEvent = timeline.nodes.find(n => n.id === connectionId);
                    if (!connectedEvent) return null;
                    
                    return (
                      <Button
                        key={connectionId}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link 
                          to="/event/$universeId/$timelineId/$eventId" 
                          params={{ 
                            universeId: universeId,
                            timelineId: timelineId,
                            eventId: connectionId 
                          }}
                        >
                          <ArrowLeft className="w-3 h-3 mr-2 rotate-180" />
                          {connectedEvent.title}
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link to="/universe/$id" params={{ id: universeId }}>
                  View Universe Graph
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link to="/timeline" search={{ universe: universeId, timeline: timelineId }}>
                  View Full Timeline
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link to="/universes">
                  Browse All Universes
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/event/$universeId/$timelineId/$eventId")({
  component: EventDetailPage,
});