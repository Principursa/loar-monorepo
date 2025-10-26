/**
 * AddSegmentDialog Component
 *
 * Dialog for adding new video segments to an event.
 * Supports both text-to-video and image-to-video generation modes.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, Image, Video, Sparkles, Check } from 'lucide-react';
import type { GenerationMode, VideoModel, AspectRatio } from '@/types/segments';
import { cn } from '@/lib/utils';

interface AddSegmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (config: SegmentGenerationConfig) => Promise<void>;
  isGenerating: boolean;
  eventDescription?: string;
}

export interface SegmentGenerationConfig {
  mode: GenerationMode;
  prompt: string;
  model: VideoModel;
  duration: number;
  aspectRatio: AspectRatio;
  negativePrompt?: string;
}

export function AddSegmentDialog({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
  eventDescription = '',
}: AddSegmentDialogProps) {
  const [mode, setMode] = useState<GenerationMode>('text-to-video');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<VideoModel>('fal-veo3');
  const [duration, setDuration] = useState(8);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [negativePrompt, setNegativePrompt] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    await onGenerate({
      mode,
      prompt,
      model,
      duration,
      aspectRatio,
      negativePrompt: negativePrompt.trim() || undefined,
    });

    // Reset form
    setPrompt('');
    setNegativePrompt('');
  };

  const handleClose = () => {
    if (!isGenerating) {
      onClose();
    }
  };

  // Get available durations based on model
  const getAvailableDurations = (selectedModel: VideoModel): number[] => {
    switch (selectedModel) {
      case 'fal-kling':
      case 'fal-wan25':
        return [5, 10];
      case 'fal-sora':
        return [4, 8, 12];
      case 'fal-veo3':
      default:
        return [4, 5, 8, 10];
    }
  };

  const availableDurations = getAvailableDurations(model);

  // Ensure selected duration is valid for model
  if (!availableDurations.includes(duration)) {
    setDuration(availableDurations[0]);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Video Segment</DialogTitle>
          <DialogDescription>
            Create a new video segment for this event using AI generation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Generation Mode Selection */}
          <div className="space-y-3">
            <Label>Generation Mode</Label>
            <div className="space-y-3">
              <Card
                className={cn(
                  "p-4 cursor-pointer transition-all hover:shadow-md",
                  mode === 'text-to-video' ? 'ring-2 ring-primary shadow-sm' : ''
                )}
                onClick={() => setMode('text-to-video')}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "h-5 w-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0",
                    mode === 'text-to-video'
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  )}>
                    {mode === 'text-to-video' && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Text-to-Video</span>
                      <Badge variant="secondary" className="ml-auto">Faster</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Generate video directly from text prompt. Faster generation, ideal for scenes without specific characters.
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                className={cn(
                  "p-4 cursor-pointer transition-all hover:shadow-md",
                  mode === 'image-to-video' ? 'ring-2 ring-primary shadow-sm' : ''
                )}
                onClick={() => setMode('image-to-video')}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "h-5 w-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0",
                    mode === 'image-to-video'
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  )}>
                    {mode === 'image-to-video' && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Image className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Image-to-Video</span>
                      <Badge variant="secondary" className="ml-auto">With Characters</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Create image first with characters, then animate. More control over composition and character placement.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {mode === 'text-to-video' ? (
            /* Text-to-Video Form */
            <div className="space-y-4">
              {/* Prompt */}
              <div className="space-y-2">
                <Label htmlFor="prompt">Video Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the video segment you want to create..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Be specific about the action, camera movement, and scene details
                </p>
              </div>

              {/* Model Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">AI Model</Label>
                  <Select value={model} onValueChange={(v) => setModel(v as VideoModel)}>
                    <SelectTrigger id="model">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fal-veo3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          Veo 3.1 (Fastest)
                        </div>
                      </SelectItem>
                      <SelectItem value="fal-kling">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500" />
                          Kling 2.5
                        </div>
                      </SelectItem>
                      <SelectItem value="fal-wan25">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          Wan 2.5
                        </div>
                      </SelectItem>
                      <SelectItem value="fal-sora">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                          Sora 2
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={duration.toString()} onValueChange={(v) => setDuration(Number(v))}>
                    <SelectTrigger id="duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDurations.map((d) => (
                        <SelectItem key={d} value={d.toString()}>
                          {d} seconds
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={(v) => setAspectRatio(v as AspectRatio)}>
                  <SelectTrigger id="aspectRatio">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Negative Prompt (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="negativePrompt">Negative Prompt (Optional)</Label>
                <Textarea
                  id="negativePrompt"
                  placeholder="Things to avoid in the video (e.g., 'blur, low quality, distorted')"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  rows={2}
                  className="resize-none"
                />
              </div>
            </div>
          ) : (
            /* Image-to-Video Form */
            <div className="space-y-4">
              <Card className="p-4 bg-muted/50 border-dashed">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-1">Character Integration Coming Soon</p>
                    <p className="text-xs text-muted-foreground">
                      This mode will allow you to select characters and generate an image with them before creating the video.
                      For now, use Text-to-Video mode or add segments from the main event creation panel.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isGenerating}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating || mode === 'image-to-video'}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Video className="h-4 w-4 mr-2" />
                Generate Segment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
