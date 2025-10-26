/**
 * VideoTimeline Component
 *
 * Professional video editing timeline with:
 * - Preview player at the top (like Google Flow)
 * - Play/Pause controls
 * - Draggable segments for reordering
 * - Timeline view with segment blocks
 */

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  Plus,
  Trash2,
  GripVertical,
  Clock,
  Maximize2,
} from 'lucide-react';
import type { VideoSegment } from '@/types/segments';
import { cn } from '@/lib/utils';

interface VideoTimelineProps {
  segments: VideoSegment[];
  onSegmentsReorder: (segmentIds: string[]) => void;
  onSegmentTrim?: (segmentId: string, startTrim: number, endTrim: number) => void;
  onSegmentDelete: (segmentId: string) => void;
  onAddSegment: () => void;
  onPlaySegments: () => void;
  isPlaying?: boolean;
  currentTime?: number;
  currentSegmentIndex?: number;
}

export function VideoTimeline({
  segments,
  onSegmentsReorder,
  onSegmentDelete,
  onAddSegment,
  onPlaySegments,
  isPlaying = false,
  currentTime = 0,
  currentSegmentIndex = 0,
}: VideoTimelineProps) {
  const [draggedSegment, setDraggedSegment] = useState<string | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Calculate total duration
  const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0);

  // Get current segment
  const currentSegment = segments[currentSegmentIndex] || segments[0];

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, segmentId: string) => {
    setDraggedSegment(segmentId);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, targetSegmentId: string) => {
    e.preventDefault();
    if (draggedSegment && draggedSegment !== targetSegmentId) {
      setHoveredSegment(targetSegmentId);
    }
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, targetSegmentId: string) => {
    e.preventDefault();
    if (!draggedSegment || draggedSegment === targetSegmentId) return;

    const draggedIndex = segments.findIndex(s => s.id === draggedSegment);
    const targetIndex = segments.findIndex(s => s.id === targetSegmentId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newSegments = [...segments];
    const [removed] = newSegments.splice(draggedIndex, 1);
    newSegments.splice(targetIndex, 0, removed);

    onSegmentsReorder(newSegments.map(s => s.id));
    setDraggedSegment(null);
    setHoveredSegment(null);
  };

  // Calculate segment start time
  const getSegmentStartTime = (segmentId: string): number => {
    let startTime = 0;
    for (const seg of segments) {
      if (seg.id === segmentId) break;
      startTime += seg.duration;
    }
    return startTime;
  };

  if (segments.length === 0) {
    return (
      <Card className="p-8 border-dashed">
        <div className="text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Segments Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start building your video by adding segments
          </p>
          <Button onClick={onAddSegment} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Add First Segment
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {/* Ultra-Compact Preview & Controls Combined */}
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[240px,1fr] gap-2 p-2">
          {/* Left: Mini Preview */}
          <div className="relative aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded overflow-hidden group">
            {currentSegment?.videoUrl ? (
              <video
                ref={videoRef}
                src={currentSegment.videoUrl}
                className="w-full h-full object-contain"
                playsInline
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="h-6 w-6 text-muted-foreground" />
              </div>
            )}

            {/* Minimal overlay */}
            <div className="absolute top-1 left-1 flex gap-1 z-10">
              <Badge className="bg-black/70 backdrop-blur-sm border-white/10 text-[9px] px-1 py-0.5">
                <span className="text-white/90">{currentSegmentIndex + 1}/{segments.length}</span>
              </Badge>
              {currentSegment && (
                <Badge className="bg-gradient-to-r from-primary/90 to-primary/70 backdrop-blur-sm border-white/10 capitalize text-[9px] px-1 py-0.5">
                  <span className="text-white font-medium">
                    {currentSegment.model.replace('fal-', '')}
                  </span>
                </Badge>
              )}
            </div>

            {/* Fullscreen button */}
            <button
              className="absolute top-1 right-1 bg-black/70 hover:bg-black/90 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-10"
              onClick={() => videoRef.current?.requestFullscreen()}
              title="Fullscreen"
            >
              <Maximize2 className="h-2.5 w-2.5" />
            </button>
          </div>

          {/* Right: Inline Controls & Timeline */}
          <div className="flex flex-col gap-1.5 min-w-0">
            {/* Ultra-Compact Controls */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant={isPlaying ? "secondary" : "default"}
                  onClick={onPlaySegments}
                  className="h-7 px-2"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3 w-3 mr-1" />
                      <span className="text-xs">Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      <span className="text-xs">Play</span>
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-muted/50 rounded text-[10px] font-mono">
                  <Clock className="h-2.5 w-2.5 text-muted-foreground" />
                  <span>{formatTime(currentTime)}/{formatTime(totalDuration)}</span>
                </div>

                <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                  {segments.length}
                </Badge>
              </div>

              <Button onClick={onAddSegment} variant="outline" size="sm" className="h-7 px-2 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>

            {/* Ultra-Compact Timeline */}
            <div className="flex-1 bg-gradient-to-br from-muted/30 to-muted/10 rounded p-1.5 border border-border/50 min-h-0">
              {/* Minimal ruler */}
              <div className="flex justify-between text-[9px] text-muted-foreground mb-1 px-0.5">
                <span className="font-mono">0:00</span>
                <span className="font-mono">{formatTime(totalDuration)}</span>
              </div>

              {/* Compact segments */}
              <div className="flex gap-1 h-12 relative">
                {segments.map((segment, index) => {
                  const startTime = getSegmentStartTime(segment.id);
                  const widthPercent = (segment.duration / totalDuration) * 100;

                  return (
                    <SegmentBlock
                      key={segment.id}
                      segment={segment}
                      index={index}
                      widthPercent={widthPercent}
                      startTime={startTime}
                      isSelected={selectedSegment === segment.id}
                      isDragging={draggedSegment === segment.id}
                      isHovered={hoveredSegment === segment.id}
                      isCurrent={index === currentSegmentIndex}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onSelect={() => setSelectedSegment(segment.id)}
                      onDelete={() => onSegmentDelete(segment.id)}
                      formatTime={formatTime}
                    />
                  );
                })}

                {/* Playhead indicator */}
                {currentTime > 0 && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-primary z-10 pointer-events-none shadow-lg"
                    style={{
                      left: `${(currentTime / totalDuration) * 100}%`,
                      transition: 'left 0.1s linear'
                    }}
                  >
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary rounded-full shadow-lg ring-1 ring-background" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Segment Details (when selected) - Ultra Compact */}
      {selectedSegment && (
        <Card className="p-1.5 bg-primary/5 border-primary/20">
          {(() => {
            const segment = segments.find(s => s.id === selectedSegment);
            if (!segment) return null;

            return (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <Badge variant="outline" className="text-[9px] px-1 py-0 flex-shrink-0">
                    #{segments.findIndex(s => s.id === selectedSegment) + 1}
                  </Badge>
                  <span className="text-[10px] font-medium truncate">
                    {segment.description || 'Untitled'}
                  </span>
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground flex-shrink-0">
                    <span className="flex items-center gap-0.5 px-1 py-0 bg-background rounded">
                      <Clock className="h-2.5 w-2.5" />
                      {segment.duration}s
                    </span>
                    <span className="px-1 py-0 bg-background rounded">
                      {segment.model.replace('fal-', '')}
                    </span>
                    <span className="px-1 py-0 bg-background rounded">
                      {segment.aspectRatio}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedSegment(null)}
                  className="h-5 w-5 p-0 text-xs"
                >
                  ×
                </Button>
              </div>
            );
          })()}
        </Card>
      )}
    </div>
  );
}

interface SegmentBlockProps {
  segment: VideoSegment;
  index: number;
  widthPercent: number;
  startTime: number;
  isSelected: boolean;
  isDragging: boolean;
  isHovered: boolean;
  isCurrent: boolean;
  onDragStart: (e: React.DragEvent, segmentId: string) => void;
  onDragOver: (e: React.DragEvent, segmentId: string) => void;
  onDrop: (e: React.DragEvent, segmentId: string) => void;
  onSelect: () => void;
  onDelete: () => void;
  formatTime: (seconds: number) => string;
}

function SegmentBlock({
  segment,
  index,
  widthPercent,
  startTime,
  isSelected,
  isDragging,
  isHovered,
  isCurrent,
  onDragStart,
  onDragOver,
  onDrop,
  onSelect,
  onDelete,
  formatTime,
}: SegmentBlockProps) {
  // Color gradient based on model
  const getModelGradient = (model: string) => {
    switch (model) {
      case 'fal-veo3': return 'from-blue-500 to-blue-600';
      case 'fal-kling': return 'from-purple-500 to-purple-600';
      case 'fal-wan25': return 'from-green-500 to-green-600';
      case 'fal-sora': return 'from-orange-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getModelAccent = (model: string) => {
    switch (model) {
      case 'fal-veo3': return 'border-blue-400';
      case 'fal-kling': return 'border-purple-400';
      case 'fal-wan25': return 'border-green-400';
      case 'fal-sora': return 'border-orange-400';
      default: return 'border-gray-400';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, segment.id)}
      onDragOver={(e) => onDragOver(e, segment.id)}
      onDrop={(e) => onDrop(e, segment.id)}
      onClick={onSelect}
      className={cn(
        "relative h-full rounded cursor-move transition-all group flex-shrink-0 overflow-hidden",
        "bg-gradient-to-br shadow-sm",
        getModelGradient(segment.model),
        isSelected && "ring-2 ring-primary shadow-md scale-[1.02]",
        isCurrent && "ring-2 ring-white/90 shadow-sm",
        isDragging && "opacity-40 scale-95",
        isHovered && "ring-2 ring-white/60",
        "hover:shadow-md hover:brightness-110 active:scale-95",
        "border border-white/20"
      )}
      style={{ width: `${widthPercent}%`, minWidth: '50px' }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

      {/* Drag handle */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
        <GripVertical className="h-4 w-4 text-white drop-shadow-lg" />
      </div>

      {/* Segment info */}
      <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white font-bold drop-shadow">
            {index + 1}
          </span>
          <span className="text-[9px] text-white/90 font-medium bg-black/40 px-1 py-0.5 rounded">
            {segment.duration}s
          </span>
        </div>
      </div>

      {/* Start time badge */}
      <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
        {formatTime(startTime)}
      </div>

      {/* Model indicator */}
      <div className={cn(
        "absolute top-1 right-1 w-1 h-1 rounded-full shadow ring-1 ring-white/40",
        getModelAccent(segment.model).replace('border-', 'bg-')
      )} title={segment.model.replace('fal-', '')} />

      {/* Delete button (on hover) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`Delete segment ${index + 1}?`)) {
            onDelete();
          }
        }}
        className="absolute -top-1.5 -right-1.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-md z-10 hover:scale-110"
      >
        <Trash2 className="h-2.5 w-2.5" />
      </button>

      {/* Resize handles (visual only for now) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-gradient-to-r from-white/60 to-transparent hover:from-white/80 transition-all"
        title="Trim start"
      >
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white/80 rounded-r" />
      </div>
      <div
        className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-gradient-to-l from-white/60 to-transparent hover:from-white/80 transition-all"
        title="Trim end"
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white/80 rounded-l" />
      </div>
    </div>
  );
}
