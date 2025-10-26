import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Play,
  Pause,
  Plus,
  Download,
  LayoutGrid,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoSegment {
  id: string;
  videoUrl: string;
  duration: number;
  prompt: string;
  thumbnail?: string;
  order: number;
}

interface SceneBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  initialSegments?: VideoSegment[];
  onSave?: (segments: VideoSegment[]) => void;
}

export function SceneBuilder({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  initialSegments = [],
  onSave,
}: SceneBuilderProps) {
  const [segments, setSegments] = useState<VideoSegment[]>(initialSegments);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showAddSegmentDialog, setShowAddSegmentDialog] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Calculate total duration
  const totalDuration = segments.reduce((acc, seg) => acc + seg.duration, 0);

  // Get current segment
  const currentSegment = segments[currentSegmentIndex];

  // Handle video end - auto-play next segment
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      if (currentSegmentIndex < segments.length - 1) {
        setCurrentSegmentIndex(prev => prev + 1);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
        setCurrentSegmentIndex(0);
      }
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [currentSegmentIndex, segments.length]);

  // Handle play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(err => console.error('Play error:', err));
    } else {
      video.pause();
    }
  }, [isPlaying, currentSegmentIndex]);

  // Update current time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSegmentClick = (index: number) => {
    setCurrentSegmentIndex(index);
    setIsPlaying(true);
  };

  const handleAddSegment = () => {
    setShowAddSegmentDialog(true);
  };

  const handleRemoveSegment = (index: number) => {
    const newSegments = segments.filter((_, i) => i !== index);
    setSegments(newSegments);
    if (currentSegmentIndex >= newSegments.length) {
      setCurrentSegmentIndex(Math.max(0, newSegments.length - 1));
    }
  };

  const handleReorderSegment = (fromIndex: number, toIndex: number) => {
    const newSegments = [...segments];
    const [removed] = newSegments.splice(fromIndex, 1);
    newSegments.splice(toIndex, 0, removed);
    setSegments(newSegments.map((seg, idx) => ({ ...seg, order: idx })));
  };

  const handleDownload = async () => {
    // TODO: Implement video concatenation and download
    console.log('Downloading scene with segments:', segments);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>SceneBuilder</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Event {eventId} • {eventTitle || 'Untitled Scene'}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video Preview Area */}
          <div className="flex-1 bg-black relative flex items-center justify-center">
            {currentSegment ? (
              <video
                ref={videoRef}
                src={currentSegment.videoUrl}
                className="max-h-full max-w-full"
                onLoadedMetadata={(e) => {
                  // Update duration when video loads
                  const video = e.currentTarget;
                  const newSegments = [...segments];
                  newSegments[currentSegmentIndex].duration = video.duration;
                  setSegments(newSegments);
                }}
              />
            ) : (
              <div className="text-white text-center">
                <p className="text-lg mb-2">No segments yet</p>
                <p className="text-sm text-white/60">Add your first video segment to get started</p>
              </div>
            )}

            {/* Segment indicator */}
            {segments.length > 0 && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full text-white text-sm">
                Segment {currentSegmentIndex + 1} of {segments.length}
              </div>
            )}
          </div>

          {/* Timeline Controls */}
          <div className="border-t bg-background">
            {/* Playback Controls */}
            <div className="px-6 py-3 border-b">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  disabled={segments.length === 0}
                  className="h-9 w-9 p-0"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                {/* Timeline Scrubber */}
                <div className="flex-1 relative">
                  <div
                    ref={timelineRef}
                    className="h-16 bg-muted rounded-lg overflow-hidden flex"
                  >
                    {segments.map((segment, index) => {
                      const widthPercent = (segment.duration / totalDuration) * 100;
                      return (
                        <button
                          key={segment.id}
                          onClick={() => handleSegmentClick(index)}
                          className={`relative border-r border-background hover:opacity-80 transition-opacity ${
                            index === currentSegmentIndex ? 'ring-2 ring-primary' : ''
                          }`}
                          style={{ width: `${widthPercent}%` }}
                        >
                          {/* Video thumbnail */}
                          {segment.thumbnail ? (
                            <img
                              src={segment.thumbnail}
                              alt={`Segment ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted-foreground/20 flex items-center justify-center text-xs">
                              {index + 1}
                            </div>
                          )}

                          {/* Duration badge */}
                          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded">
                            {formatTime(segment.duration)}
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSegment(index);
                            }}
                            className="absolute top-1 right-1 p-1 bg-black/80 hover:bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </button>
                      );
                    })}

                    {/* Add Segment Button */}
                    <button
                      onClick={handleAddSegment}
                      className="flex-shrink-0 w-16 flex items-center justify-center hover:bg-muted-foreground/10 transition-colors border-l-2 border-dashed border-primary/50"
                    >
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Duration Display */}
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* TODO: Implement arrange */}}
                    className="h-9 gap-2"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    Arrange
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={segments.length === 0}
                    className="h-9 gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>

            {/* Segment Details */}
            {currentSegment && (
              <div className="px-6 py-3 border-t bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Segment {currentSegmentIndex + 1}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {currentSegment.prompt || 'No description'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (currentSegmentIndex > 0) {
                          handleReorderSegment(currentSegmentIndex, currentSegmentIndex - 1);
                          setCurrentSegmentIndex(prev => prev - 1);
                        }
                      }}
                      disabled={currentSegmentIndex === 0}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (currentSegmentIndex < segments.length - 1) {
                          handleReorderSegment(currentSegmentIndex, currentSegmentIndex + 1);
                          setCurrentSegmentIndex(prev => prev + 1);
                        }
                      }}
                      disabled={currentSegmentIndex === segments.length - 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {segments.length} segment{segments.length !== 1 ? 's' : ''} • Total duration: {formatTime(totalDuration)}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSave?.(segments);
                onClose();
              }}
              disabled={segments.length === 0}
            >
              Save Scene
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
