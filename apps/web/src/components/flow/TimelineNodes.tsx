import { Handle, Position } from 'reactflow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Film } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface TimelineNodeData {
  label: string;
  description: string;
  videoUrl?: string;
  characters?: string[];
  timelineColor?: string;
  timelineName?: string;
  isRoot?: boolean;
  eventId?: string;
  blockchainNodeId?: number; // Actual blockchain node ID for navigation
  displayName?: string; // User-friendly display name for UI
  timelineId?: string;
  universeId?: string;
  nodeType?: 'scene' | 'branch' | 'add';
  isInCanonChain?: boolean; // Whether this node is part of the canonical chain
  onAddScene?: (position: 'after' | 'branch', sourceNodeId?: string) => void;
  onEditScene?: (eventId: string) => void;
}

export function TimelineEventNode({ data }: { data: TimelineNodeData }) {
  const [displayVideoUrl, setDisplayVideoUrl] = useState<string | null>(data.videoUrl || null);
  const [isLoadingStorage, setIsLoadingStorage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  // Debug: Log the node data
  console.log('TimelineEventNode data:', data);

  // MinIO URLs are direct HTTP URLs, no conversion needed
  useEffect(() => {
    // Simply use the video URL directly - MinIO provides HTTP URLs
    setDisplayVideoUrl(data.videoUrl || null);
    setIsLoadingStorage(false);
  }, [data.videoUrl]);

  // Handle video play/pause based on hover state
  useEffect(() => {
    if (!videoElement) return;

    let playPromise: Promise<void> | undefined;

    if (isHovered) {
      playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented, silently ignore
        });
      }
    } else {
      if (playPromise !== undefined) {
        playPromise.then(() => {
          videoElement.pause();
          videoElement.currentTime = 0;
        }).catch(() => {
          // Play was prevented, no need to pause
        });
      } else {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
    }
  }, [isHovered, videoElement]);

  const handleClick = () => {
    if (!data.eventId || !data.universeId) return;

    // Extract the numeric ID from eventId (e.g., "4b" -> 4, "10" -> 10)
    let numericEventId: string | number = data.eventId;

    // If eventId is a string like "4b", extract just the number part
    if (typeof numericEventId === 'string') {
      const match = numericEventId.match(/^\d+/);
      if (match) {
        numericEventId = match[0];
      }
    }

    const eventUrl = `/event/${data.universeId}/${numericEventId}`;
    window.location.href = eventUrl;
  };

  // Add Event Node - just a + button
  if (data.nodeType === 'add') {
    return (
      <>
        <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            size="sm"
            className="w-12 h-12 p-0 border-2 border-dashed border-primary/60 hover:border-primary hover:bg-primary/10 rounded-full transition-all duration-200"
            onClick={() => data.onAddScene?.('after', data.eventId)}
            title="Add new event"
          >
            <Plus className="h-6 w-6 text-primary" />
          </Button>
        </div>
        <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      </>
    );
  }

  // Regular Timeline Event Node - Merged design with best of both branches
  return (
    <>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      
      <div className="relative group">
        <div 
          className={`w-80 h-72 rounded-lg border-2 bg-card hover:bg-card/80 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md overflow-hidden ${data.isRoot ? 'ring-2 ring-primary/50' : ''}`}
          style={{ borderColor: data.timelineColor || '#10b981' }}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Video Preview - Fixed size with proper containment and hover effects */}
          <div className="w-full h-52 bg-black relative overflow-hidden">
            {isLoadingStorage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-1"></div>
                  <p className="text-white text-xs">Loading...</p>
                </div>
              </div>
            )}
            {displayVideoUrl ? (
              <>
                <video
                  ref={setVideoElement}
                  className="w-full h-full object-cover"
                  controls={false}
                  preload="metadata"
                  muted
                  loop
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent node click when using video controls
                  }}
                  onError={(e) => {
                    // Show fallback on error
                    const video = e.target as HTMLVideoElement;
                    const container = video.parentElement;
                    if (container) {
                      container.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex flex-col items-center justify-center">
                          <div class="text-white text-3xl mb-2">🎬</div>
                          <div class="text-white text-sm">Video unavailable</div>
                        </div>
                      `;
                    }
                  }}
                >
                  <source src={displayVideoUrl} type="video/mp4" />
                  <source src={displayVideoUrl} />
                </video>
                
                {/* Event ID overlay - with displayName support */}
                <div className="absolute top-2 left-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                  {data.displayName || `Event ${data.eventId || '?'}`}
                </div>
                
                {/* Canon badge - displayed if node is in canonical chain */}
                {data.isInCanonChain && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs px-2 py-1">
                      Canon
                    </Badge>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex flex-col items-center justify-center">
                <div className="text-white text-4xl mb-2">🎬</div>
                <div className="text-white text-sm">No Video</div>
              </div>
            )}
          </div>

          {/* Event ID and Status - Fixed footer with displayName support */}
          <div className="p-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className={`w-3 h-3 rounded-full flex-shrink-0 ${data.isRoot ? 'bg-primary' : 'bg-current'}`}
                style={{
                  backgroundColor: data.timelineColor || '#10b981'
                }}
              />
              <span className="text-lg font-bold text-primary truncate">
                {data.displayName || `Event ${data.eventId || '?'}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {data.isRoot && <Badge variant="secondary" className="text-sm">Start</Badge>}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  data.onEditScene?.(data.eventId || '');
                }}
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Edit scene segments"
              >
                <Film className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Branch button - appears on hover */}
        <Button
          variant="outline"
          size="sm"
          className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 w-8 h-8 p-0 border-2 border-dashed border-primary/60 hover:border-primary hover:bg-primary/10 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            console.log('🔴 Branch button clicked for event:', data.eventId);
            data.onAddScene?.('branch', data.eventId);
          }}
          title="Create branch event"
        >
          <Plus className="h-4 w-4 text-primary" />
        </Button>
      </div>
      
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </>
  );
}

export function TimelineBranchNode({ data }: { data: { label: string; color: string } }) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div 
        className="px-3 py-1 rounded-full text-xs font-medium text-white"
        style={{ backgroundColor: data.color }}
      >
        {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}