/**
 * SegmentPlayer Component
 *
 * Video player that plays multiple segments sequentially.
 * Automatically transitions from one segment to the next.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize,
  Loader2
} from 'lucide-react';
import type { VideoSegment } from '@/types/segments';

interface SegmentPlayerProps {
  segments: VideoSegment[];
  autoPlay?: boolean;
  onSegmentChange?: (segmentIndex: number) => void;
  onPlaybackComplete?: () => void;
  className?: string;
}

export function SegmentPlayer({
  segments,
  autoPlay = false,
  onSegmentChange,
  onPlaybackComplete,
  className = '',
}: SegmentPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  const currentSegment = segments[currentIndex];
  const hasNext = currentIndex < segments.length - 1;
  const hasPrevious = currentIndex > 0;

  // Handle video ended - move to next segment
  const handleEnded = useCallback(() => {
    if (hasNext) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
      onPlaybackComplete?.();
    }
  }, [hasNext, onPlaybackComplete]);

  // Handle play/pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Handle next segment
  const goToNext = useCallback(() => {
    if (hasNext) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [hasNext]);

  // Handle previous segment
  const goToPrevious = useCallback(() => {
    if (hasPrevious) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [hasPrevious]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Handle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!videoRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  }, []);

  // Update progress
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;

    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;

    setCurrentTime(current);
    setDuration(total);

    if (total > 0) {
      setProgress((current / total) * 100);
    }
  }, []);

  // Handle seek
  const handleSeek = useCallback((value: number) => {
    if (!videoRef.current) return;

    const newTime = (value / 100) * duration;
    videoRef.current.currentTime = newTime;
    setProgress(value);
  }, [duration]);

  // Load new segment
  useEffect(() => {
    if (!videoRef.current || !currentSegment) return;

    setIsLoading(true);
    videoRef.current.load();

    const video = videoRef.current;

    const handleLoadedData = () => {
      setIsLoading(false);
      if (isPlaying) {
        video.play();
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [currentIndex, currentSegment, isPlaying]);

  // Notify segment change
  useEffect(() => {
    onSegmentChange?.(currentIndex);
  }, [currentIndex, onSegmentChange]);

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentSegment) {
    return (
      <Card className={className}>
        <div className="aspect-video flex items-center justify-center bg-muted">
          <p className="text-muted-foreground">No segments available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="relative group">
        {/* Video element */}
        <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden">
          <video
            ref={videoRef}
            src={currentSegment.videoUrl}
            onEnded={handleEnded}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
            className="w-full h-full"
            playsInline
          />

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-12 w-12 animate-spin text-white" />
            </div>
          )}

          {/* Play/Pause overlay */}
          {!isPlaying && !isLoading && (
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={togglePlay}
            >
              <div className="bg-black/60 rounded-full p-6 hover:bg-black/80 transition-colors">
                <Play className="h-12 w-12 text-white" />
              </div>
            </div>
          )}

          {/* Segment indicator */}
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="backdrop-blur-sm">
              Segment {currentIndex + 1} of {segments.length}
            </Badge>
          </div>

          {/* Model indicator */}
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="backdrop-blur-sm capitalize">
              {currentSegment.model.replace('fal-', '')}
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 space-y-3 bg-card rounded-b-lg">
          {/* Progress bar */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Segment description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {currentSegment.description}
          </p>

          {/* Control buttons */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* Previous */}
              <Button
                size="icon"
                variant="outline"
                onClick={goToPrevious}
                disabled={!hasPrevious}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              {/* Play/Pause */}
              <Button
                size="icon"
                variant="default"
                onClick={togglePlay}
                disabled={isLoading}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              {/* Next */}
              <Button
                size="icon"
                variant="outline"
                onClick={goToNext}
                disabled={!hasNext}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {/* Mute */}
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>

              {/* Fullscreen */}
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleFullscreen}
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Segment list indicator */}
          {segments.length > 1 && (
            <div className="flex gap-1 pt-2">
              {segments.map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    idx === currentIndex
                      ? 'bg-primary'
                      : idx < currentIndex
                      ? 'bg-primary/50'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
