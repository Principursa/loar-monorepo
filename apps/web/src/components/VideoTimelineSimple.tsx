import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Plus, Trash2, Volume2, VolumeX } from 'lucide-react';

interface TimelineSegment {
  id: string;
  videoUrl: string;
  duration: number;
  trimStart: number;
  trimEnd: number;
  imageUrl?: string;
}

interface VideoTimelineSimpleProps {
  segments: TimelineSegment[];
  onRemoveSegment: (id: string) => void;
  onUpdateSegment?: (id: string, trimStart: number, trimEnd: number) => void;
  onAddSegment?: () => void;
  currentTime?: number;
  onSeek?: (time: number) => void;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
}

export function VideoTimelineSimple({
  segments,
  onRemoveSegment,
  onUpdateSegment,
  onAddSegment,
  currentTime = 0,
  onSeek,
  isPlaying = false,
  onPlayPause,
  volume = 1,
  onVolumeChange,
}: VideoTimelineSimpleProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [trimming, setTrimming] = useState<{
    segmentId: string;
    handle: 'start' | 'end';
    initialX: number;
  } | null>(null);

  // Calculate total duration (trimmed)
  const totalDuration = segments.reduce((acc, seg) => {
    const trimmedDuration = seg.trimEnd - seg.trimStart;
    return acc + trimmedDuration;
  }, 0);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle timeline click for seeking
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !onSeek) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * totalDuration;

    onSeek(Math.max(0, Math.min(totalDuration, newTime)));
  };

  // Handle timeline drag
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleTimelineClick(e);
  };

  // Handle trim dragging
  useEffect(() => {
    if (!trimming || !onUpdateSegment) return;

    const handleMouseMove = (e: MouseEvent) => {
      const segment = segments.find(s => s.id === trimming.segmentId);
      if (!segment) return;

      const deltaX = e.clientX - trimming.initialX;

      // Calculate pixels per second based on segment width
      // This is a rough estimate - we'll use 60px per second as a baseline
      const pixelsPerSecond = 60;
      const deltaSeconds = deltaX / pixelsPerSecond;

      if (trimming.handle === 'start') {
        const newTrimStart = Math.max(0, Math.min(segment.trimStart + deltaSeconds, segment.trimEnd - 0.5));
        if (Math.abs(newTrimStart - segment.trimStart) > 0.01) {
          onUpdateSegment(segment.id, newTrimStart, segment.trimEnd);
          setTrimming({ ...trimming, initialX: e.clientX });
        }
      } else {
        const newTrimEnd = Math.max(segment.trimStart + 0.5, Math.min(segment.trimEnd + deltaSeconds, segment.duration));
        if (Math.abs(newTrimEnd - segment.trimEnd) > 0.01) {
          onUpdateSegment(segment.id, segment.trimStart, newTrimEnd);
          setTrimming({ ...trimming, initialX: e.clientX });
        }
      }
    };

    const handleMouseUp = () => {
      setTrimming(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [trimming, segments, onUpdateSegment]);

  // Handle timeline seeking drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !timelineRef.current || !onSeek) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newTime = percentage * totalDuration;

      onSeek(newTime);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, totalDuration, onSeek]);

  // Calculate which segment is currently active
  let cumulativeTime = 0;
  const activeSegmentIndex = segments.findIndex((seg) => {
    const segmentDuration = seg.trimEnd - seg.trimStart;
    if (currentTime >= cumulativeTime && currentTime < cumulativeTime + segmentDuration) {
      return true;
    }
    cumulativeTime += segmentDuration;
    return false;
  });

  return (
    <div className="w-full bg-black/95 rounded-2xl shadow-2xl">
      {/* Main Timeline Container */}
      <div className="p-6 space-y-4">
        {/* Timeline Track with Segments */}
        <div className="relative">
          {/* Play Button + Timeline + Time Display */}
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button
              onClick={onPlayPause}
              className="flex-shrink-0 w-14 h-14 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-black ml-0.5" fill="currentColor" />
              ) : (
                <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
              )}
            </button>

            {/* Timeline Area */}
            <div className="flex-1 space-y-3">
              {/* Segment Thumbnails */}
              <div className="relative h-24">
                <div className="flex gap-2 h-full">
                  {segments.map((segment, index) => {
                    const segmentDuration = segment.trimEnd - segment.trimStart;
                    const widthPercentage = (segmentDuration / totalDuration) * 100;
                    const isActive = index === activeSegmentIndex;

                    // Calculate trim percentages within the segment
                    const trimStartPercent = (segment.trimStart / segment.duration) * 100;
                    const trimEndPercent = ((segment.duration - segment.trimEnd) / segment.duration) * 100;

                    return (
                      <div
                        key={segment.id}
                        className="relative group"
                        style={{ width: `${widthPercentage}%` }}
                        onMouseEnter={() => setHoveredSegment(segment.id)}
                        onMouseLeave={() => setHoveredSegment(null)}
                      >
                        {/* Segment Card - Full duration shown */}
                        <div
                          className={`h-full rounded-lg overflow-hidden border-2 transition-all relative ${
                            isActive
                              ? 'border-white shadow-lg scale-105'
                              : 'border-gray-700 hover:border-gray-500'
                          }`}
                        >
                          {/* Thumbnail or gradient background */}
                          {segment.imageUrl ? (
                            <img
                              src={segment.imageUrl}
                              alt={`Segment ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600" />
                          )}

                          {/* Trimmed Start Overlay - Darkened area */}
                          {segment.trimStart > 0.01 && (
                            <div
                              className="absolute left-0 top-0 bottom-0 bg-black/70 border-r-2 border-red-500/60"
                              style={{
                                width: `${trimStartPercent}%`,
                                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,0,0,0.1) 4px, rgba(255,0,0,0.1) 8px)'
                              }}
                            >
                              <div className="absolute top-1 left-1 text-[8px] text-red-400 font-bold">
                                {segment.trimStart.toFixed(1)}s
                              </div>
                            </div>
                          )}

                          {/* Trimmed End Overlay - Darkened area */}
                          {segment.trimEnd < segment.duration - 0.01 && (
                            <div
                              className="absolute right-0 top-0 bottom-0 bg-black/70 border-l-2 border-red-500/60"
                              style={{
                                width: `${trimEndPercent}%`,
                                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,0,0,0.1) 4px, rgba(255,0,0,0.1) 8px)'
                              }}
                            >
                              <div className="absolute top-1 right-1 text-[8px] text-red-400 font-bold">
                                -{(segment.duration - segment.trimEnd).toFixed(1)}s
                              </div>
                            </div>
                          )}

                          {/* Active region indicator */}
                          {(segment.trimStart > 0.01 || segment.trimEnd < segment.duration - 0.01) && (
                            <div
                              className="absolute top-0 bottom-0 border-l-2 border-r-2 border-green-400/50 pointer-events-none"
                              style={{
                                left: `${trimStartPercent}%`,
                                right: `${trimEndPercent}%`
                              }}
                            />
                          )}

                          {/* Hover overlay with delete button */}
                          {hoveredSegment === segment.id && !trimming && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveSegment(segment.id);
                                }}
                                className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Trim Handles - Always visible on hover */}
                        {onUpdateSegment && hoveredSegment === segment.id && (
                          <>
                            {/* Left trim handle */}
                            <div
                              className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize z-30 group/handle"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                setTrimming({
                                  segmentId: segment.id,
                                  handle: 'start',
                                  initialX: e.clientX,
                                });
                              }}
                            >
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 group-hover/handle:bg-blue-300 group-hover/handle:w-2 transition-all" />
                              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-3 h-8 bg-blue-500 rounded-r-md border-2 border-blue-300 opacity-0 group-hover/handle:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="flex flex-col gap-0.5">
                                  <div className="w-0.5 h-1 bg-white rounded-full" />
                                  <div className="w-0.5 h-1 bg-white rounded-full" />
                                  <div className="w-0.5 h-1 bg-white rounded-full" />
                                </div>
                              </div>
                            </div>

                            {/* Right trim handle */}
                            <div
                              className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize z-30 group/handle"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                setTrimming({
                                  segmentId: segment.id,
                                  handle: 'end',
                                  initialX: e.clientX,
                                });
                              }}
                            >
                              <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-400 group-hover/handle:bg-blue-300 group-hover/handle:w-2 transition-all" />
                              <div className="absolute top-1/2 -translate-y-1/2 right-0 w-3 h-8 bg-blue-500 rounded-l-md border-2 border-blue-300 opacity-0 group-hover/handle:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="flex flex-col gap-0.5">
                                  <div className="w-0.5 h-1 bg-white rounded-full" />
                                  <div className="w-0.5 h-1 bg-white rounded-full" />
                                  <div className="w-0.5 h-1 bg-white rounded-full" />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Duration label */}
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 font-mono whitespace-nowrap">
                          {segmentDuration.toFixed(1)}s
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Segment Button */}
                  {onAddSegment && (
                    <button
                      onClick={onAddSegment}
                      className="flex-shrink-0 w-24 h-full rounded-lg border-2 border-dashed border-gray-700 hover:border-gray-500 flex items-center justify-center transition-all hover:bg-gray-800/50 group"
                    >
                      <Plus className="w-8 h-8 text-gray-600 group-hover:text-gray-400 transition-colors" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div
                ref={timelineRef}
                className="relative h-2 bg-gray-800 rounded-full cursor-pointer overflow-hidden"
                onMouseDown={handleMouseDown}
                onClick={handleTimelineClick}
              >
                {/* Progress fill */}
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                />

                {/* Playhead */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing"
                  style={{
                    left: `${(currentTime / totalDuration) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </div>
            </div>

            {/* Time Display */}
            <div className="flex-shrink-0 min-w-[120px] text-right">
              <div className="text-white font-mono text-lg">
                {formatTime(currentTime)} <span className="text-gray-500">/</span>{' '}
                {formatTime(totalDuration)}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onVolumeChange?.(volume > 0 ? 0 : 1)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              {volume > 0 ? (
                <Volume2 className="w-5 h-5 text-gray-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => onVolumeChange?.(Number(e.target.value))}
              className="w-24 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500">
              {segments.length} clip{segments.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
