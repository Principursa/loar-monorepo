import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, BookOpen, Users as UsersIcon, Calendar, Film, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "@/utils/trpc";
import { useGetFullGraph } from "@/hooks/useTimeline";

function EventPage() {
  const { universe: universeId, event: eventId } = useParams({ from: "/event/$universe/$event" });
  const navigate = useNavigate();

  const isBlockchainUniverse = universeId?.startsWith('0x');

  // Fetch blockchain graph data to get event details
  const { data: graphData, isLoading: isLoadingGraph } = useGetFullGraph(
    isBlockchainUniverse ? universeId : undefined
  );

  // Find the event in the graph
  const eventIndex = graphData ? graphData[0]?.findIndex((id: any) => {
    const numericId = typeof id === 'bigint' ? Number(id) : parseInt(String(id));
    return numericId === parseInt(eventId);
  }) : -1;

  const eventVideoUrl = eventIndex !== -1 ? String(graphData?.[1]?.[eventIndex] || '') : '';
  const rawDescription = eventIndex !== -1 ? graphData?.[2]?.[eventIndex] : '';
  const eventDescription = typeof rawDescription === 'object' && rawDescription !== null && 'description' in rawDescription
    ? String((rawDescription as any).description)
    : String(rawDescription || '');

  // Find previous event (the parent node)
  const previousNodeId = eventIndex !== -1 ? graphData?.[3]?.[eventIndex] : null;
  const previousEventId = previousNodeId && String(previousNodeId) !== '0'
    ? (typeof previousNodeId === 'bigint' ? Number(previousNodeId) : parseInt(String(previousNodeId)))
    : null;

  // Find next events (all children of this node)
  const nextEventIds: number[] = [];
  const nextEventData: Array<{ id: number; videoUrl: string; description: string }> = [];
  if (graphData && eventIndex !== -1) {
    const currentNodeId = graphData[0][eventIndex];
    const currentId = typeof currentNodeId === 'bigint' ? Number(currentNodeId) : parseInt(String(currentNodeId));

    // Find all nodes that have this node as their parent
    graphData[3]?.forEach((parentId: any, idx: number) => {
      const parentNumeric = typeof parentId === 'bigint' ? Number(parentId) : parseInt(String(parentId));
      if (parentNumeric === currentId) {
        const childId = graphData[0][idx];
        const childNumeric = typeof childId === 'bigint' ? Number(childId) : parseInt(String(childId));
        nextEventIds.push(childNumeric);

        const rawDesc = graphData[2]?.[idx];
        const description = typeof rawDesc === 'object' && rawDesc !== null && 'description' in rawDesc
          ? String((rawDesc as any).description)
          : String(rawDesc || `Event ${childNumeric}`);

        nextEventData.push({
          id: childNumeric,
          videoUrl: String(graphData[1]?.[idx] || ''),
          description
        });
      }
    });
  }

  // Get previous event data
  let previousEventData: { id: number; videoUrl: string; description: string } | null = null;
  if (previousEventId && graphData) {
    const prevIndex = graphData[0]?.findIndex((id: any) => {
      const numericId = typeof id === 'bigint' ? Number(id) : parseInt(String(id));
      return numericId === previousEventId;
    });
    if (prevIndex !== -1) {
      const rawPrevDesc = graphData[2]?.[prevIndex];
      const prevDescription = typeof rawPrevDesc === 'object' && rawPrevDesc !== null && 'description' in rawPrevDesc
        ? String((rawPrevDesc as any).description)
        : String(rawPrevDesc || `Event ${previousEventId}`);

      previousEventData = {
        id: previousEventId,
        videoUrl: String(graphData[1]?.[prevIndex] || ''),
        description: prevDescription
      };
    }
  }

  // Fetch wiki data
  const { data: wikiData, isLoading: isLoadingWiki } = useQuery({
    queryKey: ['wiki', universeId, eventId],
    queryFn: async () => {
      if (!universeId || !eventId) return null;

      try {
        const result = await trpcClient.wiki.getWiki.query({
          universeId: universeId,
          eventId: eventId
        });
        return result;
      } catch (error) {
        console.error('Failed to fetch wiki:', error);
        return null;
      }
    },
    enabled: !!universeId && !!eventId,
    retry: 1
  });

  // Fetch characters to get images for character elements
  const { data: charactersData } = useQuery({
    queryKey: ['characters'],
    queryFn: async () => {
      try {
        const result = await trpcClient.wiki.characters.query();
        return result;
      } catch (error) {
        console.error('Failed to fetch characters:', error);
        return null;
      }
    }
  });

  const wiki = wikiData?.wikiData;
  const isLoading = isLoadingGraph || isLoadingWiki;

  if (!universeId || !eventId) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Invalid Event Request</h2>
            <p className="text-muted-foreground mb-4">
              Please provide both universe and event parameters.
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-xl">Loading event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: `/universe/${universeId}` })}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Universe
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Film className="h-6 w-6" />
                  Event #{eventId}
                </h1>
                <p className="text-sm text-muted-foreground">{wiki?.title || eventDescription}</p>
              </div>
            </div>
            {wiki && (
              <Badge variant="secondary" className="text-xs">
                AI Generated
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-4 max-w-6xl">
        {/* Video Player */}
        {eventVideoUrl && (
          <Card className="mb-4 shadow-lg">
            <CardContent className="p-0">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  key={eventId}
                  className="w-full h-full"
                  controls
                  autoPlay
                  src={eventVideoUrl}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Description */}
        {eventDescription && (
          <Card className="mb-4 shadow-sm bg-muted/50">
            <CardContent className="p-4">
              <h3 className="text-base font-semibold mb-1.5">Event Description</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {eventDescription}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">Navigate Timeline</h3>
            <Button
              variant="outline"
              onClick={() => navigate({ to: `/universe/${universeId}` })}
            >
              View Full Timeline
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Previous Event Card */}
            {previousEventData ? (
              <Card
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
                onClick={() => navigate({ to: `/event/${universeId}/${previousEventData.id}` })}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <ChevronLeft className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Previous Event</span>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-32 h-20 bg-black rounded overflow-hidden flex-shrink-0">
                      {previousEventData.videoUrl ? (
                        <video
                          src={previousEventData.videoUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
                          <Film className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Event #{previousEventData.id}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {previousEventData.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="opacity-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <ChevronLeft className="h-5 w-5" />
                    <span className="font-semibold">No Previous Event</span>
                  </div>
                  <p className="text-sm text-muted-foreground">This is the first event</p>
                </CardContent>
              </Card>
            )}

            {/* Next Event Card(s) */}
            {nextEventData.length > 0 ? (
              nextEventData.length === 1 ? (
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
                  onClick={() => navigate({ to: `/event/${universeId}/${nextEventData[0].id}` })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold">Next Event</span>
                      <ChevronRight className="h-5 w-5 text-primary ml-auto" />
                    </div>
                    <div className="flex gap-3">
                      <div className="w-32 h-20 bg-black rounded overflow-hidden flex-shrink-0">
                        {nextEventData[0].videoUrl ? (
                          <video
                            src={nextEventData[0].videoUrl}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white">
                            <Film className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Event #{nextEventData[0].id}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {nextEventData[0].description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold">Multiple Branches Available</span>
                      <Badge variant="secondary">{nextEventData.length} branches</Badge>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
                      {nextEventData.map((event, idx) => (
                        <div
                          key={event.id}
                          className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-all group border border-transparent hover:border-primary"
                          onClick={() => navigate({ to: `/event/${universeId}/${event.id}` })}
                        >
                          <div className="w-20 h-14 bg-black rounded overflow-hidden flex-shrink-0">
                            {event.videoUrl ? (
                              <video
                                src={event.videoUrl}
                                className="w-full h-full object-cover"
                                muted
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white">
                                <Film className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Branch {idx + 1} - Event #{event.id}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {event.description}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            ) : (
              <Card className="opacity-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold">No Next Event</span>
                    <ChevronRight className="h-5 w-5 ml-auto" />
                  </div>
                  <p className="text-sm text-muted-foreground">This is the last event</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Wiki Content */}
        {wiki ? (
          <>
            {/* Title & Summary */}
            <div className="mb-4">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary pl-4 py-4 rounded-r-2xl">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {wiki.title}
                </h2>
                {wiki.summary && (
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {wiki.summary}
                  </p>
                )}
              </div>
            </div>

            {/* Plot/Storyline */}
            <Card className="mb-4 shadow-sm bg-gradient-to-br from-card via-card to-primary/5">
              <CardContent className="p-5">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  Plot Summary
                </h3>
                <div className="prose prose-lg max-w-none">
                  <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-primary/10">
                    <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                      {wiki.plot}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Characters & Elements */}
            {wiki.elements && wiki.elements.length > 0 && (
              <Card className="mb-4 shadow-sm">
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <UsersIcon className="h-5 w-5 text-primary" />
                    Characters & Elements
                  </h3>

                  {/* Character details */}
                  <div className="space-y-4">
                    {wiki.elements.map((element, idx) => {
                      // Get character image for the detail card
                      let matchingCharacter;
                      if (element.characterId) {
                        matchingCharacter = charactersData?.characters?.find((char: any) =>
                          char.id === element.characterId
                        );
                      }
                      if (!matchingCharacter) {
                        matchingCharacter = charactersData?.characters?.find((char: any) =>
                          char.character_name.toLowerCase() === element.name.toLowerCase()
                        );
                      }

                      return (
                        <div key={idx} className="group">
                          <div className="bg-gradient-to-r from-primary/5 via-transparent to-transparent border-l-4 border-primary/50 pl-4 py-3 rounded-r-xl hover:border-primary transition-all duration-300 hover:shadow-md">
                            <div className="flex items-start gap-4">
                              {/* Thumbnail */}
                              {matchingCharacter?.image_url && (
                                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
                                  <img
                                    src={matchingCharacter.image_url}
                                    alt={element.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{element.name}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{element.description}</p>

                                {element.actions && element.actions.length > 0 && (
                                  <div className="bg-muted/30 rounded-lg p-3 border border-primary/10">
                                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                                      <span className="w-1 h-3 bg-primary rounded-full"></span>
                                      Actions
                                    </p>
                                    <ul className="space-y-1.5">
                                      {element.actions.map((action, actionIdx) => (
                                        <li key={actionIdx} className="text-xs flex items-start gap-2">
                                          <span className="text-primary mt-0.5">•</span>
                                          <span className="text-foreground/90">{action}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Moments */}
            {wiki.keyMoments && wiki.keyMoments.length > 0 && (
              <Card className="mb-4 shadow-sm bg-gradient-to-br from-card to-card/50">
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    Key Moments
                  </h3>
                  <ol className="space-y-3">
                    {wiki.keyMoments.map((moment, idx) => {
                      // Extract string from moment (might be object or string)
                      const momentText = typeof moment === 'object' && moment !== null && 'description' in moment
                        ? String((moment as any).description)
                        : String(moment || '');
                      return (
                        <li key={idx} className="group flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all duration-300">
                          <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-bold flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
                            {idx + 1}
                          </span>
                          <span className="text-sm leading-relaxed pt-0.5 text-foreground/90 group-hover:text-foreground">{momentText}</span>
                        </li>
                      );
                    })}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Visual Details */}
            {wiki.visualDetails && wiki.visualDetails.length > 0 && (
              <Card className="mb-4 shadow-sm bg-gradient-to-br from-card to-primary/5">
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
                    Visual Details
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {wiki.visualDetails.map((detail, idx) => {
                      // Extract string from detail (might be object or string)
                      const detailText = typeof detail === 'object' && detail !== null && 'description' in detail
                        ? String((detail as any).description)
                        : String(detail || '');
                      return (
                        <li key={idx} className="group flex items-start gap-2 p-2 rounded-lg hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20">
                          <span className="text-primary mt-0.5 group-hover:scale-125 transition-transform duration-300">✦</span>
                          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{detailText}</span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Metadata Footer */}
            {wikiData && (
              <Card className="shadow-sm bg-muted/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>Generated {new Date(wikiData.generatedAt).toLocaleString()}</span>
                      </div>
                      {wikiData.costUsd && (
                        <span>Cost: ${Number(wikiData.costUsd).toFixed(4)}</span>
                      )}
                      {wikiData.tokensUsed && (
                        <span>Tokens: {wikiData.tokensUsed.toLocaleString()}</span>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {wikiData.generatedBy}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          /* No Wiki Available */
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-bold mb-3">No Wiki Available</h3>
              <p className="text-muted-foreground mb-6">
                This event doesn't have a wiki entry yet. Wikis are automatically generated when events are saved to the blockchain.
              </p>
              {eventDescription && (
                <div className="bg-muted rounded-lg p-4 mb-4">
                  <p className="text-sm text-foreground">{eventDescription}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/event/$universe/$event")({
  component: EventPage,
});
