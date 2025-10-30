import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, BookOpen, Sparkles, Users as UsersIcon, Calendar, Film } from "lucide-react";
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
  const eventDescription = eventIndex !== -1 ? String(graphData?.[2]?.[eventIndex] || '') : '';

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
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Video Player */}
        {eventVideoUrl && (
          <Card className="mb-8 shadow-lg">
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
          <Card className="mb-8 shadow-sm bg-muted/50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Event Description</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                {eventDescription}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Wiki Content */}
        {wiki ? (
          <>
            {/* Title & Summary */}
            <div className="mb-8">
              <h2 className="text-5xl font-bold mb-4">
                {wiki.title}
              </h2>
              {wiki.summary && (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {wiki.summary}
                </p>
              )}
            </div>

            {/* Video Analysis */}
            {wiki.videoAnalysis && (
              <Card className="mb-8 shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Video Analysis
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Setting</h4>
                      <p className="text-base leading-relaxed">{wiki.videoAnalysis.setting}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Visual Style</h4>
                      <p className="text-base leading-relaxed">{wiki.videoAnalysis.visualStyle}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Subjects</h4>
                      <p className="text-base leading-relaxed">{wiki.videoAnalysis.subjects}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Action</h4>
                      <p className="text-base leading-relaxed">{wiki.videoAnalysis.action}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Plot/Storyline */}
            <Card className="mb-8 shadow-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  Plot Summary
                </h3>
                <div className="prose prose-lg max-w-none">
                  <p className="text-base leading-relaxed whitespace-pre-line text-foreground">
                    {wiki.plot}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Characters & Elements */}
            {wiki.elements && wiki.elements.length > 0 && (
              <Card className="mb-8 shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <UsersIcon className="h-6 w-6 text-primary" />
                    Characters & Elements
                  </h3>
                  <div className="space-y-6">
                    {wiki.elements.map((element, idx) => (
                      <div key={idx} className="border-l-4 border-primary/30 pl-4">
                        <h4 className="text-lg font-semibold mb-2">{element.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{element.description}</p>
                        {element.actions && element.actions.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Actions</p>
                            <ul className="space-y-1">
                              {element.actions.map((action, actionIdx) => (
                                <li key={actionIdx} className="text-sm flex items-start gap-2">
                                  <span className="text-primary">•</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Moments */}
            {wiki.keyMoments && wiki.keyMoments.length > 0 && (
              <Card className="mb-8 shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Key Moments</h3>
                  <ol className="space-y-4">
                    {wiki.keyMoments.map((moment, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-base leading-relaxed pt-1">{moment}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Visual Details */}
            {wiki.visualDetails && wiki.visualDetails.length > 0 && (
              <Card className="mb-8 shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Visual Details</h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {wiki.visualDetails.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">✦</span>
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
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
