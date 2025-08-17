import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface CreateTimelineNodeProps {
  previousNodeId: number;
  onSuccess: (nodeId: number) => void;
}

export function CreateTimelineNode({ previousNodeId, onSuccess }: CreateTimelineNodeProps) {
  const [plot, setPlot] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plot.trim()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock blockchain interaction - in real implementation this would call smart contract
      const mockNodeId = Math.floor(Math.random() * 10000) + previousNodeId + 1;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call success callback with the new node ID
      onSuccess(mockNodeId);
      
      // Reset form
      setPlot('');
    } catch (error) {
      console.error('Failed to create timeline node:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 w-full max-w-md">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Create New Timeline Event</h3>
          <p className="text-sm text-muted-foreground">
            Add a new narrative event to the timeline
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plot">Plot Description</Label>
            <textarea
              id="plot"
              value={plot}
              onChange={(e) => setPlot(e.target.value)}
              placeholder="Describe what happens in this part of the story..."
              className="w-full min-h-[100px] p-3 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            Previous Node ID: {previousNodeId}
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={!plot.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}