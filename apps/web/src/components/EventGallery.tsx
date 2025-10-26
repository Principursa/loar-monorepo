import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3x3, List, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Event {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
  timestamp?: number;
}

interface EventGalleryProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export function EventGallery({ events, onEventClick }: EventGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'favorites'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.id?.toLowerCase().includes(query)
      );
    }

    // Favorites filter
    if (viewMode === 'favorites') {
      filtered = filtered.filter(event => favorites.has(event.id));
    }

    return filtered;
  }, [events, searchQuery, viewMode, favorites]);

  const toggleFavorite = (eventId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  };

  if (events.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center space-y-2">
          <p className="text-lg">No events yet</p>
          <p className="text-sm">Click "Create Event" to generate your first scene</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col space-y-4 p-6 overflow-hidden">
      {/* Search and View Controls */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/50"
          />
        </div>
        <div className="flex items-center gap-1 bg-muted/50 rounded-md p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 w-8 p-0"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'favorites' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('favorites')}
            className="h-8 w-8 p-0"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Events Display */}
      <div className="flex-1 overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No events match your search</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="group cursor-pointer overflow-hidden hover:border-primary transition-colors"
                onClick={() => onEventClick(event)}
              >
                <div className="aspect-video bg-muted relative">
                  {event.videoUrl ? (
                    <video
                      src={event.videoUrl}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                  ) : event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No preview
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(event.id);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.has(event.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                </div>
                <div className="p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Event {event.id}</span>
                  </div>
                  <h3 className="font-medium text-sm line-clamp-1">
                    {event.title || `Event ${event.id}`}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {event.description || 'No description'}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="p-4 cursor-pointer hover:border-primary transition-colors"
                onClick={() => onEventClick(event)}
              >
                <div className="flex gap-4">
                  <div className="w-32 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    {event.videoUrl ? (
                      <video
                        src={event.videoUrl}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">Event {event.id}</span>
                        </div>
                        <h3 className="font-medium mt-1">{event.title || `Event ${event.id}`}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {event.description || 'No description'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(event.id);
                        }}
                        className="p-1"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            favorites.has(event.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
