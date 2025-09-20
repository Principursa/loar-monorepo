import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { useMutation } from '@tanstack/react-query'
import { trpcClient } from '../utils/trpc'

interface VideoGenerationSelectorProps {
  imageUrl: string
  onVideoGenerated?: (videoUrl: string) => void
}

interface VideoModel {
  id: 'fal-ai/veo3/fast/image-to-video' | 'fal-ai/kling-video/v2.1/standard/image-to-video' | 'fal-ai/wan-pro/image-to-video'
  name: string
  description: string
  maxDuration: number
  features: string[]
  badge?: 'Fast' | 'Quality' | 'Pro'
}

const VIDEO_MODELS: VideoModel[] = [
  {
    id: 'fal-ai/veo3/fast/image-to-video',
    name: 'Veo3 Fast',
    description: 'Fast, high-quality image-to-video generation with natural motion',
    maxDuration: 5,
    features: ['Natural motion', 'Fast generation', 'Fixed format'],
    badge: 'Fast'
  },
  {
    id: 'fal-ai/kling-video/v2.1/standard/image-to-video',
    name: 'Kling Video v2.1',
    description: 'Professional-grade image-to-video with cinematic quality',
    maxDuration: 10,
    features: ['Cinematic quality', 'Smooth motion', 'Professional output'],
    badge: 'Quality'
  },
  {
    id: 'fal-ai/wan-pro/image-to-video',
    name: 'Wan Pro',
    description: 'Professional image-to-video with advanced motion control',
    maxDuration: 10,
    features: ['Professional quality', 'Advanced motion', 'High resolution'],
    badge: 'Pro'
  }
]


export function VideoGenerationSelector({ imageUrl, onVideoGenerated }: VideoGenerationSelectorProps) {
  const [selectedModel, setSelectedModel] = useState<VideoModel['id']>('fal-ai/veo3/fast/image-to-video')
  const [prompt, setPrompt] = useState('')
  const [duration, setDuration] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string>('')
  const [error, setError] = useState<string>('')

  const selectedModelData = VIDEO_MODELS.find(m => m.id === selectedModel)!

  // tRPC mutations for each model
  const veo3Mutation = useMutation({
    mutationFn: (params: any) => trpcClient.fal.veo3ImageToVideo.mutate(params)
  })
  const klingMutation = useMutation({
    mutationFn: (params: any) => trpcClient.fal.klingImageToVideo.mutate(params)
  })
  const wanProMutation = useMutation({
    mutationFn: (params: any) => trpcClient.fal.wanProImageToVideo.mutate(params)
  })

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      let result

      switch (selectedModel) {
        case 'fal-ai/veo3/fast/image-to-video':
          result = await veo3Mutation.mutateAsync({
            prompt,
            imageUrl
            // Veo3 only supports prompt and imageUrl
          })
          break

        case 'fal-ai/kling-video/v2.1/standard/image-to-video':
          result = await klingMutation.mutateAsync({
            prompt,
            imageUrl,
            duration,
            aspectRatio: '16:9',
            motionStrength: 0.8,
            fps: 25
          })
          break

        case 'fal-ai/wan-pro/image-to-video':
          result = await wanProMutation.mutateAsync({
            prompt,
            imageUrl,
            duration,
            aspectRatio: '16:9',
            motionStrength: 0.8,
            fps: 25
          })
          break
      }

      if (result.status === 'completed' && result.videoUrl) {
        setGeneratedVideoUrl(result.videoUrl)
        onVideoGenerated?.(result.videoUrl)
      } else if (result.status === 'failed') {
        setError(result.error || 'Video generation failed')
      } else {
        setError('Video generation is still in progress. Please check back later.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎬 Generate Video from Image
          {selectedModelData.badge && (
            <Badge variant={selectedModelData.badge === 'Fast' ? 'default' : selectedModelData.badge === 'Pro' ? 'secondary' : 'outline'}>
              {selectedModelData.badge}
            </Badge>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose a model and describe how you want your image to be animated
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Image Preview */}
        <div>
          <Label className="text-sm font-medium">Source Image</Label>
          <img 
            src={imageUrl} 
            alt="Source image" 
            className="w-full max-w-md mx-auto rounded-lg border mt-2"
          />
        </div>

        {/* Model Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Video Generation Model</Label>
          <div className="grid gap-3">
            {VIDEO_MODELS.map((model) => (
              <Card 
                key={model.id}
                className={`cursor-pointer transition-all ${
                  selectedModel === model.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedModel(model.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{model.name}</h3>
                        {model.badge && (
                          <Badge variant={model.badge === 'Fast' ? 'default' : model.badge === 'Pro' ? 'secondary' : 'outline'}>
                            {model.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{model.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {model.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Max {model.maxDuration}s
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <Label htmlFor="prompt">
            Animation Prompt
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe how you want the image to be animated..."
            disabled={isGenerating}
          />
        </div>

        {/* Duration option */}
        <div className="space-y-2">
          <Label>Duration (seconds)</Label>
          <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: selectedModelData.maxDuration }, (_, i) => i + 1).map((d) => (
                <SelectItem key={d} value={d.toString()}>
                  {d} second{d > 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating Video...
            </>
          ) : (
            `Generate Video with ${selectedModelData.name}`
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Generated Video */}
        {generatedVideoUrl && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Generated Video</Label>
            <video 
              src={generatedVideoUrl}
              controls
              className="w-full rounded-lg border"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
            <Button 
              variant="outline" 
              onClick={() => {
                const a = document.createElement('a')
                a.href = generatedVideoUrl
                a.download = `video-${Date.now()}.mp4`
                a.click()
              }}
              className="w-full"
            >
              Download Video
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}