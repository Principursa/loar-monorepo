/**
 * Video Segment Types
 *
 * Multi-segment event system inspired by Google Flow Scene Builder.
 * Each event can contain multiple video segments that play sequentially.
 */

export type VideoModel = 'fal-veo3' | 'fal-kling' | 'fal-wan25' | 'fal-sora';
export type AspectRatio = '16:9' | '9:16' | '1:1';
export type GenerationMode = 'text-to-video' | 'image-to-video';

/**
 * Individual video segment within an event
 */
export interface VideoSegment {
  /** Unique segment ID (e.g., "1-seg-1", "1-seg-2") */
  id: string;

  /** Generated video URL (blob URL, Walrus URL, or IPFS hash) */
  videoUrl: string;

  /** Segment-specific description */
  description: string;

  /** Generation prompt used */
  prompt: string;

  /** Duration in seconds */
  duration: number;

  /** Position in sequence (0, 1, 2...) */
  order: number;

  // Trimming (future feature - not implemented yet)
  /** Start trim in milliseconds (default: 0) */
  startTrim?: number;

  /** End trim in milliseconds (default: duration * 1000) */
  endTrim?: number;

  // Generation metadata
  /** AI model used for generation */
  model: VideoModel;

  /** Timestamp when segment was generated */
  generatedAt: number;

  /** Video aspect ratio */
  aspectRatio: AspectRatio;

  /** How this segment was generated */
  generationMode: GenerationMode;

  // Optional: Image-to-video source
  /** Source image URL if generated from image */
  imageUrl?: string;

  /** Character IDs used in this segment */
  characterIds?: string[];

  /** Character names for display */
  characterNames?: string[];

  // Optional: Advanced settings
  /** Negative prompt used (if any) */
  negativePrompt?: string;

  /** Thumbnail image extracted from video */
  thumbnailUrl?: string;
}

/**
 * Event with multi-segment support
 */
export interface MultiSegmentEvent {
  /** Event ID */
  eventId: string;

  /** Event title */
  title: string;

  /** Overall event description */
  description: string;

  /** Array of video segments */
  segments: VideoSegment[];

  /** Event metadata */
  timestamp: number;
  createdAt: number;
  updatedAt: number;

  /** Original event data (for backward compatibility) */
  sourceNodeId?: string;
  additionType?: 'after' | 'branch';
  position?: { x: number; y: number };

  /** Blockchain/storage metadata */
  contractSaved?: boolean;
  filecoinSaved?: boolean;
  pieceCid?: string;
}

/**
 * Legacy event format (single video)
 */
export interface LegacyEvent {
  eventId: string;
  title: string;
  description: string;
  videoUrl: string;
  imageUrl?: string;
  characterIds?: string[];
  characterNames?: string[];
  imagePrompt?: string;
  videoPrompt?: string;
  negativePrompt?: string;
  videoModel?: VideoModel;
  videoDuration?: number;
  videoRatio?: AspectRatio;
  imageFormat?: string;
  soundtrackUrl?: string;
  soundtrackName?: string;
  sourceNodeId?: string;
  additionType?: 'after' | 'branch';
  timestamp: number;
  position?: { x: number; y: number };
}

/**
 * Segment creation input
 */
export interface CreateSegmentInput {
  eventId: string;
  description: string;
  prompt: string;
  model: VideoModel;
  duration: number;
  aspectRatio: AspectRatio;
  generationMode: GenerationMode;
  negativePrompt?: string;
  imageUrl?: string;
  characterIds?: string[];
}

/**
 * Segment update input
 */
export interface UpdateSegmentInput {
  segmentId: string;
  description?: string;
  order?: number;
  startTrim?: number;
  endTrim?: number;
}

/**
 * Helper function to migrate legacy event to multi-segment format
 */
export function migrateLegacyEvent(legacyEvent: LegacyEvent): MultiSegmentEvent {
  const segment: VideoSegment = {
    id: `${legacyEvent.eventId}-seg-1`,
    videoUrl: legacyEvent.videoUrl,
    description: legacyEvent.description,
    prompt: legacyEvent.videoPrompt || legacyEvent.imagePrompt || legacyEvent.description,
    duration: legacyEvent.videoDuration || 8,
    order: 0,
    model: legacyEvent.videoModel || 'fal-veo3',
    generatedAt: legacyEvent.timestamp,
    aspectRatio: legacyEvent.videoRatio || '16:9',
    generationMode: legacyEvent.imageUrl ? 'image-to-video' : 'text-to-video',
    imageUrl: legacyEvent.imageUrl,
    characterIds: legacyEvent.characterIds,
    characterNames: legacyEvent.characterNames,
    negativePrompt: legacyEvent.negativePrompt,
  };

  return {
    eventId: legacyEvent.eventId,
    title: legacyEvent.title,
    description: legacyEvent.description,
    segments: [segment],
    timestamp: legacyEvent.timestamp,
    createdAt: legacyEvent.timestamp,
    updatedAt: legacyEvent.timestamp,
    sourceNodeId: legacyEvent.sourceNodeId,
    additionType: legacyEvent.additionType,
    position: legacyEvent.position,
  };
}

/**
 * Helper function to check if event has multiple segments
 */
export function isMultiSegmentEvent(event: MultiSegmentEvent | LegacyEvent): event is MultiSegmentEvent {
  return 'segments' in event && Array.isArray(event.segments);
}

/**
 * Helper function to get total duration of all segments
 */
export function getTotalDuration(event: MultiSegmentEvent): number {
  return event.segments.reduce((total, segment) => total + segment.duration, 0);
}

/**
 * Helper function to generate next segment ID
 */
export function generateSegmentId(eventId: string, segmentCount: number): string {
  return `${eventId}-seg-${segmentCount + 1}`;
}

/**
 * Helper function to sort segments by order
 */
export function sortSegments(segments: VideoSegment[]): VideoSegment[] {
  return [...segments].sort((a, b) => a.order - b.order);
}
