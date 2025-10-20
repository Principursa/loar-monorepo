/**
 * SegmentTimeline Component
 *
 * Google Flow-inspired horizontal timeline for managing video segments.
 * Shows thumbnails, duration, and controls for each segment.
 */

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Edit,
  Trash2,
  Plus,
  GripVertical,
  Clock,
  Sparkles
} from 'lucide-react';
import type { VideoSegment } from '@/types/segments';
import { cn } from '@/lib/utils';

interface SegmentTimelineProps {
  segments: VideoSegment[];
  selectedSegmentId?: string;
  onSegmentSelect: (segmentId: string) => void;
  onSegmentPlay: (segmentId: string) => void;
  onSegmentEdit: (segmentId: string) => void;
  onSegmentDelete: (segmentId: string) => void;
  onAddSegment: () => void;
  onReorder?: (segmentIds: string[]) => void;
}

export function SegmentTimeline({
  segments,
  selectedSegmentId,
  onSegmentSelect,
  onSegmentPlay,
  onSegmentEdit,
  onSegmentDelete,
  onAddSegment,
  onReorder,
}: SegmentTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  // Calculate total duration
  const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0);

  // Format duration (seconds to MM:SS)
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (segments.length === 0) {
    return (
      <div className="w-full">
        <Card className="p-8 text-center border-dashed">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Segments Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start building your event by adding video segments
          </p>
          <Button onClick={onAddSegment} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Add First Segment
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Event Segments ({segments.length})</h3>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(totalDuration)} total
          </Badge>
        </div>
        <Button onClick={onAddSegment} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Segment
        </Button>
      </div>

      {/* Timeline */}
      <div
        ref={timelineRef}
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        {segments.map((segment, index) => (
          <SegmentCard
            key={segment.id}
            segment={segment}
            index={index}
            isSelected={segment.id === selectedSegmentId}
            onSelect={() => onSegmentSelect(segment.id)}
            onPlay={() => onSegmentPlay(segment.id)}
            onEdit={() => onSegmentEdit(segment.id)}
            onDelete={() => onSegmentDelete(segment.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface SegmentCardProps {
  segment: VideoSegment;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onPlay: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function SegmentCard({
  segment,
  index,
  isSelected,
  onSelect,
  onPlay,
  onEdit,
  onDelete,
}: SegmentCardProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Extract thumbnail from video
  useEffect(() => {
    if (segment.thumbnailUrl) {
      setThumbnail(segment.thumbnailUrl);
      return;
    }

    // Generate thumbnail from video
    const generateThumbnail = async () => {
      if (!videoRef.current) return;

      try {
        const video = document.createElement('video');
        video.src = segment.videoUrl;
        video.crossOrigin = 'anonymous';
        video.currentTime = 1; // 1 second in

        await new Promise<void>((resolve, reject) => {
          video.onloadeddata = () => resolve();
          video.onerror = () => reject();
        });

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const thumbUrl = canvas.toDataURL('image/jpeg', 0.8);
          setThumbnail(thumbUrl);
        }
      } catch (error) {
        console.error('Failed to generate thumbnail:', error);
      }
    };

    generateThumbnail();
  }, [segment.videoUrl, segment.thumbnailUrl]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return secs >= 60 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  // Get model badge color
  const getModelColor = (model: string) => {
    switch (model) {
      case 'fal-veo3': return 'bg-blue-500';
      case 'fal-kling': return 'bg-purple-500';
      case 'fal-wan25': return 'bg-green-500';
      case 'fal-sora': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card
      className={cn(
        "flex-shrink-0 w-64 cursor-pointer transition-all hover:shadow-lg",
        isSelected && "ring-2 ring-primary shadow-lg"
      )}
      onClick={onSelect}
    >
      <div className="p-3 space-y-2">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-muted rounded-md overflow-hidden group">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={`Segment ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">
                Loading...
              </div>
            </div>
          )}

          {/* Overlay controls */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10"
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
            >
              <Play className="h-5 w-5" />
            </Button>
          </div>

          {/* Segment number badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs">
              Segment {index + 1}
            </Badge>
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(segment.duration)}
            </Badge>
          </div>
        </div>

        {/* Segment info */}
        <div className="space-y-1">
          <p className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
            {segment.description || `Segment ${index + 1}`}
          </p>

          {/* Model badge */}
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", getModelColor(segment.model))} />
            <span className="text-xs text-muted-foreground capitalize">
              {segment.model.replace('fal-', '')}
            </span>
            {segment.generationMode === 'image-to-video' && segment.characterIds && segment.characterIds.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {segment.characterIds.length} character{segment.characterIds.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete segment ${index + 1}?`)) {
                onDelete();
              }
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Hidden video element for thumbnail extraction */}
      <video ref={videoRef} className="hidden" />
    </Card>
  );
}
