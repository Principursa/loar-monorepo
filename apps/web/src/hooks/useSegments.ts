/**
 * useSegments Hook
 *
 * Manages video segments for multi-segment events.
 * Provides CRUD operations and utilities for segment management.
 */

import { useState, useCallback, useEffect } from 'react';
import type {
  VideoSegment,
  MultiSegmentEvent,
  LegacyEvent,
  CreateSegmentInput,
  UpdateSegmentInput,
} from '@/types/segments';
import {
  migrateLegacyEvent,
  isMultiSegmentEvent,
  generateSegmentId,
  sortSegments,
} from '@/types/segments';

interface UseSegmentsOptions {
  universeId: string;
  eventId: string;
}

export function useSegments({ universeId, eventId }: UseSegmentsOptions) {
  const [segments, setSegments] = useState<VideoSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Storage key for universe events
  const storageKey = `universe_events_${universeId}`;

  /**
   * Load segments from localStorage
   */
  const loadSegments = useCallback(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) {
        setSegments([]);
        setIsLoading(false);
        return;
      }

      const eventsData = JSON.parse(stored);
      const eventData = eventsData[eventId];

      if (!eventData) {
        setSegments([]);
        setIsLoading(false);
        return;
      }

      // Check if it's already multi-segment format
      if (isMultiSegmentEvent(eventData)) {
        setSegments(sortSegments(eventData.segments));
      } else {
        // Migrate legacy single-video event
        const migratedEvent = migrateLegacyEvent(eventData as LegacyEvent);
        setSegments(migratedEvent.segments);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load segments:', error);
      setSegments([]);
      setIsLoading(false);
    }
  }, [storageKey, eventId]);

  /**
   * Save segments to localStorage
   */
  const saveSegments = useCallback(
    (updatedSegments: VideoSegment[]) => {
      try {
        const stored = localStorage.getItem(storageKey);
        const eventsData = stored ? JSON.parse(stored) : {};
        const eventData = eventsData[eventId] || {};

        // Update event with new segments
        const updatedEvent: MultiSegmentEvent = {
          ...eventData,
          eventId,
          segments: sortSegments(updatedSegments),
          updatedAt: Date.now(),
        };

        eventsData[eventId] = updatedEvent;
        localStorage.setItem(storageKey, JSON.stringify(eventsData));

        setSegments(sortSegments(updatedSegments));
      } catch (error) {
        console.error('Failed to save segments:', error);
        throw error;
      }
    },
    [storageKey, eventId]
  );

  /**
   * Add a new segment
   */
  const addSegment = useCallback(
    (newSegment: Omit<VideoSegment, 'id' | 'order' | 'generatedAt'>) => {
      const segment: VideoSegment = {
        ...newSegment,
        id: generateSegmentId(eventId, segments.length),
        order: segments.length,
        generatedAt: Date.now(),
      };

      const updatedSegments = [...segments, segment];
      saveSegments(updatedSegments);

      return segment;
    },
    [segments, eventId, saveSegments]
  );

  /**
   * Update an existing segment
   */
  const updateSegment = useCallback(
    (segmentId: string, updates: Partial<VideoSegment>) => {
      const updatedSegments = segments.map((seg) =>
        seg.id === segmentId ? { ...seg, ...updates } : seg
      );

      saveSegments(updatedSegments);
    },
    [segments, saveSegments]
  );

  /**
   * Delete a segment
   */
  const deleteSegment = useCallback(
    (segmentId: string) => {
      const updatedSegments = segments
        .filter((seg) => seg.id !== segmentId)
        .map((seg, index) => ({ ...seg, order: index })); // Reorder remaining segments

      saveSegments(updatedSegments);
    },
    [segments, saveSegments]
  );

  /**
   * Reorder segments
   */
  const reorderSegments = useCallback(
    (segmentIds: string[]) => {
      const reordered = segmentIds
        .map((id) => segments.find((seg) => seg.id === id))
        .filter((seg): seg is VideoSegment => seg !== undefined)
        .map((seg, index) => ({ ...seg, order: index }));

      saveSegments(reordered);
    },
    [segments, saveSegments]
  );

  /**
   * Get segment by ID
   */
  const getSegment = useCallback(
    (segmentId: string) => {
      return segments.find((seg) => seg.id === segmentId);
    },
    [segments]
  );

  /**
   * Get total duration of all segments
   */
  const getTotalDuration = useCallback(() => {
    return segments.reduce((total, seg) => total + seg.duration, 0);
  }, [segments]);

  /**
   * Clear all segments
   */
  const clearSegments = useCallback(() => {
    saveSegments([]);
  }, [saveSegments]);

  // Load segments on mount
  useEffect(() => {
    loadSegments();
  }, [loadSegments]);

  return {
    segments,
    isLoading,
    addSegment,
    updateSegment,
    deleteSegment,
    reorderSegments,
    getSegment,
    getTotalDuration,
    clearSegments,
    refresh: loadSegments,
  };
}
