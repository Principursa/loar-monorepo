import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Calendar } from "lucide-react";
import { useReadContract, useChainId } from 'wagmi';
import { timelineAbi } from '@/generated';
import { TIMELINE_ADDRESSES, type SupportedChainId } from '@/configs/addresses-test';
import { type Address } from 'viem';
import { useState, useEffect, useCallback } from 'react';
import { trpcClient } from '@/utils/trpc';

function EventPage() {
  const { universeId, eventId } = useParams({ from: "/event/$universeId/$eventId" });
  const chainId = useChainId();
  const [universe, setUniverse] = useState<any>(null);
  const [displayVideoUrl, setDisplayVideoUrl] = useState<string | null>(null);
  const [isLoadingFilecoin, setIsLoadingFilecoin] = useState(false);

  // Custom function to create blob URL from Filecoin PieceCID
  const createFilecoinBlobUrl = useCallback(async (pieceCid: string, filename: string = 'video.mp4') => {
    try {
      console.log('Creating blob URL for PieceCID:', pieceCid);
      
      // Download from Filecoin via tRPC
      const result = await trpcClient.synapse.download.query({ pieceCid });
      
      // Convert base64 back to Uint8Array
      const binaryData = Uint8Array.from(atob(result.data), c => c.charCodeAt(0));
      
      // Create blob with proper MIME type
      const mimeType = filename.endsWith('.mp4') ? 'video/mp4' : 'application/octet-stream';
      const blob = new Blob([binaryData], { type: mimeType });
      
      // Create URL for the blob
      const blobUrl = URL.createObjectURL(blob);
      console.log('Created blob URL:', blobUrl);
      
      return blobUrl;
    } catch (error) {
      console.error('Failed to create blob URL from Filecoin:', error);
      throw error;
    }
  }, []);
  
  // Get universe data from localStorage
  useEffect(() => {
    console.log('Looking for universe with ID:', universeId);
    const savedUniverses = localStorage.getItem('universes');
    if (savedUniverses) {
      const universes = JSON.parse(savedUniverses);
      console.log('Available universes:', universes);
      const currentUniverse = universes.find((u: any) => u.id === universeId);
      console.log('Found universe:', currentUniverse);
      setUniverse(currentUniverse);
    } else {
      console.log('No universes found in localStorage');
    }
  }, [universeId]);

  // Determine contract address - use universe ID if it's a blockchain universe
  const contractAddress = universeId && universeId.startsWith('0x') 
    ? (universeId as Address)
    : (TIMELINE_ADDRESSES[chainId as SupportedChainId] as Address);

  // eventId is already numeric (e.g., "1", "2", "3")
  const nodeIdBigInt = BigInt(eventId);

  console.log('Event Page Debug:', {
    universeId,
    eventId,
    contractAddress,
    universe
  });

  // Fetch event data from blockchain
  const { data: nodeData, isLoading: isLoadingNode, error } = useReadContract({
    abi: timelineAbi,
    address: contractAddress,
    functionName: "getNode",
    args: [nodeIdBigInt],
    query: {
      enabled: !!contractAddress && !!nodeIdBigInt
    }
  });

  // Extract data from blockchain response for use in hooks
  const videoUrl = nodeData && Array.isArray(nodeData) && nodeData.length >= 4 ? nodeData[1] : null;

  console.log('Event page debug:', {
    nodeData,
    videoUrl,
    displayVideoUrl,
    isLoadingFilecoin
  });

  // Handle PieceCIDs by creating blob URLs - MUST be called at top level
  useEffect(() => {
    console.log('useEffect triggered with videoUrl:', videoUrl);
    
    if (videoUrl && videoUrl.startsWith('bafk')) {
      // This looks like a raw PieceCID from Filecoin
      console.log('Event page: Converting PieceCID to blob URL for:', videoUrl);
      
      setIsLoadingFilecoin(true);
      createFilecoinBlobUrl(videoUrl)
        .then((blobUrl) => {
          setDisplayVideoUrl(blobUrl);
          console.log('Event page: Successfully created blob URL:', blobUrl);
        })
        .catch((error) => {
          console.error('Event page: Failed to create blob URL, falling back to HTTP gateway:', error);
          // Fallback: Use our HTTP gateway instead of blob URL
          const baseUrl = import.meta.env.PROD ? 'https://loartech.xyz' : 'http://localhost:3000';
          const fallbackUrl = `${baseUrl}/api/filecoin/${videoUrl}`;
          setDisplayVideoUrl(fallbackUrl);
          console.log('Event page: Using HTTP gateway fallback for large file:', fallbackUrl);
        })
        .finally(() => {
          setIsLoadingFilecoin(false);
        });
    } else if (videoUrl) {
      // Use the original URL for HTTP URLs
      console.log('Event page: Using original URL:', videoUrl);
      setDisplayVideoUrl(videoUrl);
      setIsLoadingFilecoin(false);
    } else {
      // No video URL available
      console.log('Event page: No video URL available');
      setDisplayVideoUrl(null);
      setIsLoadingFilecoin(false);
    }
  }, [videoUrl, createFilecoinBlobUrl]);

  if (isLoadingNode) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading event data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle event not found
  if (!isLoadingNode && (!nodeData || !Array.isArray(nodeData) || nodeData.length < 4)) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The requested event could not be found in universe {universeId}.
            </p>
            <div className="space-y-2">
              <Button asChild>
                <Link to={`/universe/${universeId}`}>Back to Universe</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/universes">Back to Universes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extract data from blockchain response [id, url, desc, prev_node_id, array, bool]
  const eventNodeId = nodeData?.[0];
  const description = nodeData?.[2]; 
  const previousNodeId = nodeData?.[3];

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/universes" className="hover:text-foreground">
            Universes
          </Link>
          <span>/</span>
          <Link to={`/universe/${universeId}`} className="hover:text-foreground">
            {universe?.name || (universeId.length > 16 ? `Universe ${universeId.slice(0, 8)}...` : `Universe ${universeId}`)}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Event {eventNodeId}</span>
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
                  <CardTitle className="text-3xl mb-2">Event {eventNodeId}</CardTitle>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">
                      {universe?.name || (universeId.length > 16 ? `Universe ${universeId.slice(0, 8)}...` : `Universe ${universeId}`)}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50">Blockchain Event</Badge>
                    {previousNodeId && previousNodeId === 0n && (
                      <Badge variant="default" className="bg-green-100 text-green-800">Root Event</Badge>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/universe/${universeId}`}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Universe
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Event Description</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-foreground leading-relaxed text-base">
                      {description || `Timeline event ${eventNodeId} from blockchain`}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Event Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayVideoUrl ? (
                  <>
                    <div className="space-y-4">
                      {/* Primary video player */}
                      <div className="relative">
                        <div className="w-full aspect-video bg-muted rounded-lg border relative overflow-hidden">
                          {isLoadingFilecoin && (
                            <div className="absolute inset-0 flex items-center justify-center bg-muted/80 z-10">
                              <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                                <p className="text-sm text-muted-foreground">Loading from Filecoin...</p>
                              </div>
                            </div>
                          )}
                          <video 
                            className="w-full h-full object-cover" 
                            controls
                            preload="metadata"
                            playsInline
                            onLoadStart={() => console.log('Event video loading:', displayVideoUrl)}
                            onCanPlay={() => console.log('Event video can play:', displayVideoUrl)}
                            onLoadedMetadata={() => console.log('Video metadata loaded')}
                            onError={(e) => {
                              console.error('Event video loading error:', e);
                              console.error('Video URL causing error:', displayVideoUrl);
                              const video = e.target as HTMLVideoElement;
                              console.error('Video error details:', {
                                error: video.error,
                                networkState: video.networkState,
                                readyState: video.readyState
                              });
                            }}
                          >
                            <source src={displayVideoUrl} type="video/mp4" />
                            <source src={displayVideoUrl} />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </div>
                      
                      {/* Alternative: iframe for problematic videos */}
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">If video doesn't load above, try:</p>
                        <Button variant="outline" size="sm" asChild>
                          <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                            🎬 Open Video Directly
                          </a>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex gap-2">
                        <Button asChild>
                          <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                            <Play className="w-4 h-4 mr-2" />
                            Open Video
                          </a>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const video = document.querySelector('video');
                            if (video) {
                              video.load();
                              console.log('Force reloading video:', videoUrl);
                            }
                          }}
                        >
                          🔄 Retry Load
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {videoUrl.includes('walrus') ? 'Walrus Protocol' : 
                         videoUrl.includes('luma.com') ? 'LumaAI Generated' : 'External Video'}
                      </p>
                    </div>
                    
                    <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                      <p className="font-medium mb-1">Direct URL:</p>
                      <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground break-all">
                        {videoUrl}
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 bg-muted rounded-lg">
                    <div className="text-6xl mb-4">🎬</div>
                    <p className="text-muted-foreground text-lg">No video available for this event</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
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
                <h4 className="text-sm font-medium mb-1">Event ID</h4>
                <p className="text-2xl font-bold">{eventNodeId}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Universe</h4>
                <p className="text-sm text-muted-foreground break-all">
                  {universe?.name || `Universe ${universeId.slice(0, 16)}...`}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Contract Address</h4>
                <p className="text-xs text-muted-foreground break-all font-mono">
                  {contractAddress}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Previous Event</h4>
                <p className="text-sm text-muted-foreground">
                  {previousNodeId && previousNodeId !== 0n 
                    ? `Event ${previousNodeId}` 
                    : 'Root/Start of universe'
                  }
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Data Source</h4>
                <Badge variant="outline" className="bg-blue-50">
                  Smart Contract
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Previous Event Link */}
          {previousNodeId && previousNodeId !== 0n && (
            <Card>
              <CardHeader>
                <CardTitle>Previous Event</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to={`/event/${universeId}/${previousNodeId.toString()}`}>
                    <ArrowLeft className="w-3 h-3 mr-2" />
                    Event {previousNodeId.toString()}
                  </Link>
                </Button>
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
                <Link to={`/universe/${universeId}`}>
                  View Universe Timeline
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link to="/universes">
                  Back to Universe Hub
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/event/$universeId/$eventId")({
  component: EventPage,
});