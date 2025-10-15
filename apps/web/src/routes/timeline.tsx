import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize2, Sparkles, BookOpen, Users as UsersIcon, ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "@/utils/trpc";
import { useGetFullGraph } from "@/hooks/useTimeline";

interface TimelineSearch {
  universe?: string;
  timeline?: string;
  event?: string; // Current event being watched
}

interface WikiaEntry {
  title: string;
  summary: string;
  plot: string;
  characters: string[];
  themes: string[];
  significance: string;
  connectedEvents: string[];
  keyMoments: string[];
}

interface EventNode {
  id: number;
  videoUrl: string;
  description: string;
  previousId: number;
  nextIds: number[];
  isCanon: boolean;
}

function TimelineWatchPage() {
  const search = useSearch({ from: "/timeline" }) as TimelineSearch;
  const navigate = useNavigate();

  const [currentEventId, setCurrentEventId] = useState<number>(search.event ? parseInt(search.event) : 1);
  const [wikiaEntry, setWikiaEntry] = useState<WikiaEntry | null>(null);
  const [isLoadingWikia, setIsLoadingWikia] = useState(false);
  const [wikiaError, setWikiaError] = useState<string | null>(null);
  const [showFullGraph, setShowFullGraph] = useState(false);
  const [events, setEvents] = useState<EventNode[]>([]);

  // Get universe data from localStorage
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

  const isBlockchainUniverse = search.universe?.startsWith('0x');
  const universeId = search.universe || '';

  // Get universe metadata
  const localUniverse = localUniverses?.find((u: any) => u.id === search.universe);
  const universeName = localUniverse?.name || `Universe ${search.universe?.slice(0, 8)}...`;
  const universeDescription = localUniverse?.description || 'Blockchain-based cinematic universe';

  // Load full graph data to get all events
  const { data: graphData, isLoading: isLoadingGraph } = useGetFullGraph(
    isBlockchainUniverse ? universeId : undefined
  );

  // Process graph data into events array
  useEffect(() => {
    if (!graphData) return;

    const [ids, links, plots, previousIds] = graphData;
    const eventsList: EventNode[] = [];

    for (let i = 0; i < ids.length; i++) {
      const id = Number(ids[i]);
      if (id === 0) continue;

      eventsList.push({
        id,
        videoUrl: String(links[i]),
        description: String(plots[i]),
        previousId: Number(previousIds[i]),
        nextIds: [], // We'll calculate this
        isCanon: true,
      });
    }

    // Sort by ID
    eventsList.sort((a, b) => a.id - b.id);
    setEvents(eventsList);

    // Set initial event if not set
    if (eventsList.length > 0 && !search.event) {
      setCurrentEventId(eventsList[0].id);
    }
  }, [graphData, search.event]);

  // Get current event
  const currentEvent = events.find(e => e.id === currentEventId);
  const currentIndex = events.findIndex(e => e.id === currentEventId);
  const prevEvent = currentIndex > 0 ? events[currentIndex - 1] : null;
  const nextEvent = currentIndex < events.length - 1 ? events[currentIndex + 1] : null;

  // Generate wikia for current event
  const generateWikia = useCallback(async () => {
    if (!currentEvent) return;

    setIsLoadingWikia(true);
    setWikiaError(null);

    try {
      const result = await trpcClient.wiki.generateEventWikia.mutate({
        nodeId: currentEvent.id,
        title: `Event ${currentEvent.id}`,
        description: currentEvent.description || 'No description available',
        videoUrl: currentEvent.videoUrl || '',
      });

      setWikiaEntry(result);
    } catch (error) {
      console.error('Failed to generate wikia:', error);
      setWikiaError(error instanceof Error ? error.message : 'Failed to generate storyline');
    } finally {
      setIsLoadingWikia(false);
    }
  }, [currentEvent]);

  // Auto-generate wikia when event changes
  useEffect(() => {
    if (currentEvent && !wikiaEntry) {
      generateWikia();
    }
  }, [currentEvent, wikiaEntry, generateWikia]);

  // Navigate to different event
  const goToEvent = useCallback((eventId: number) => {
    setCurrentEventId(eventId);
    setWikiaEntry(null); // Clear wikia to trigger regeneration
    navigate({
      to: "/timeline",
      search: { universe: universeId, event: eventId.toString() }
    });
  }, [universeId, navigate]);

  const goToPrevious = () => {
    if (prevEvent) goToEvent(prevEvent.id);
  };

  const goToNext = () => {
    if (nextEvent) goToEvent(nextEvent.id);
  };

  if (isLoadingGraph) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-xl">Loading timeline...</p>
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Events Found</h2>
            <p className="text-muted-foreground mb-4">
              This universe doesn't have any events yet.
            </p>
            <Button onClick={() => navigate({ to: "/universes" })}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Universes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: "/universes" })}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{universeName}</h1>
                <p className="text-sm text-muted-foreground">{universeDescription}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              Event {currentEventId} of {events.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Video Player */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-0">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {currentEvent.videoUrl ? (
                <video
                  key={currentEvent.id}
                  className="w-full h-full"
                  controls
                  autoPlay
                  src={currentEvent.videoUrl}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  <p>No video available for this event</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Event Title & Summary */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-3">
            {wikiaEntry?.title || `Event ${currentEventId}`}
          </h2>
          {wikiaEntry?.summary && (
            <p className="text-xl text-muted-foreground leading-relaxed">{wikiaEntry.summary}</p>
          )}
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={goToPrevious}
              disabled={!prevEvent}
              className="min-w-[120px]"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>
            <Button
              variant="default"
              size="lg"
              onClick={goToNext}
              disabled={!nextEvent}
              className="min-w-[120px]"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate({ to: "/universe/$id", params: { id: universeId } })}
          >
            Edit This Universe
          </Button>
        </div>

        {/* Storyline */}
        <Card className="mb-8 shadow-sm">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Storyline
              </h3>
              {!wikiaEntry && !isLoadingWikia && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateWikia}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Storyline
                </Button>
              )}
            </div>

            {isLoadingWikia && (
              <div className="flex flex-col items-center gap-3 text-muted-foreground py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-lg">Generating storyline with AI...</p>
              </div>
            )}

            {wikiaError && (
              <div className="bg-destructive/10 border border-destructive rounded-lg p-6 mb-4">
                <p className="text-destructive font-semibold mb-2">Failed to generate storyline</p>
                <p className="text-sm text-muted-foreground">{wikiaError}</p>
              </div>
            )}

            {wikiaEntry && (
              <div className="space-y-8">
                {/* Plot/Storyline */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-base leading-relaxed whitespace-pre-line text-foreground">
                    {wikiaEntry.plot}
                  </p>
                </div>

                {/* Metadata Grid */}
                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
                  {/* Characters */}
                  {wikiaEntry.characters && wikiaEntry.characters.length > 0 && (
                    <div>
                      <h4 className="text-base font-semibold flex items-center gap-2 mb-3">
                        <UsersIcon className="h-5 w-5 text-primary" />
                        Characters
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {wikiaEntry.characters.map((character, idx) => (
                          <Badge key={idx} variant="secondary" className="text-sm py-1 px-3">
                            {character}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Themes */}
                  {wikiaEntry.themes && wikiaEntry.themes.length > 0 && (
                    <div>
                      <h4 className="text-base font-semibold flex items-center gap-2 mb-3">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Themes
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {wikiaEntry.themes.map((theme, idx) => (
                          <Badge key={idx} variant="outline" className="text-sm py-1 px-3">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Significance */}
                {wikiaEntry.significance && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                    <h4 className="text-base font-semibold mb-3">Narrative Significance</h4>
                    <p className="text-sm leading-relaxed">{wikiaEntry.significance}</p>
                  </div>
                )}

                {/* Key Moments */}
                {wikiaEntry.keyMoments && wikiaEntry.keyMoments.length > 0 && (
                  <div>
                    <h4 className="text-base font-semibold mb-3">Key Moments</h4>
                    <ul className="space-y-2">
                      {wikiaEntry.keyMoments.map((moment, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-sm leading-relaxed">{moment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!wikiaEntry && !isLoadingWikia && !wikiaError && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No storyline generated yet. Click the button above to generate an AI-powered narrative.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mini Graph Navigation */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Timeline Navigation</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFullGraph(!showFullGraph)}
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                {showFullGraph ? 'Hide' : 'Show'} Full Graph
              </Button>
            </div>

            {/* Mini Timeline */}
            <div className="flex items-center justify-center gap-3 overflow-x-auto pb-4 px-4">
              {events.map((event, idx) => (
                <div key={event.id} className="flex items-center gap-3">
                  <button
                    onClick={() => goToEvent(event.id)}
                    className={`
                      relative flex-shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center
                      transition-all hover:scale-110 font-semibold text-base
                      ${event.id === currentEventId
                        ? 'bg-primary text-primary-foreground border-primary scale-125 shadow-lg'
                        : 'bg-card border-muted-foreground/40 hover:border-primary hover:bg-primary/5'
                      }
                    `}
                    title={`Event ${event.id}`}
                  >
                    {event.id}
                    {event.id === currentEventId && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </button>
                  {idx < events.length - 1 && (
                    <div className="w-12 h-1 bg-gradient-to-r from-muted-foreground/30 to-muted-foreground/10 rounded-full" />
                  )}
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground text-center mt-2">
              Click any node to jump to that event • {events.length} total events
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/timeline")({
  component: TimelineWatchPage,
  validateSearch: (search: Record<string, unknown>): TimelineSearch => {
    return {
      universe: typeof search.universe === 'string' ? search.universe : undefined,
      timeline: typeof search.timeline === 'string' ? search.timeline : undefined,
      event: typeof search.event === 'string' ? search.event : undefined,
    };
  },
});
