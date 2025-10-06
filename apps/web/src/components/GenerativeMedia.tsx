import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { trpcClient } from '../utils/trpc'

interface GeneratedContent {
  imageUrl?: string
  videoUrl?: string
  isGenerating: boolean
  error?: string
  generationId?: string
}

export function GenerativeMedia() {
  const [imagePrompt, setImagePrompt] = useState('A simple cartoon drawing of a cute orange cat sitting on grass. Clean, minimal illustration with soft pastel colors.')
  const [videoPrompt, setVideoPrompt] = useState('A cute cat gently swaying in a soft breeze')
  const [content, setContent] = useState<GeneratedContent>({ isGenerating: false })

  const generateImageMutation = useMutation({
    mutationFn: (input: {
      prompt: string;
      model: 'fal-ai/nano-banana' | 'fal-ai/flux/dev' | 'fal-ai/flux-pro' | 'fal-ai/flux/schnell';
      imageSize: 'square_hd' | 'square' | 'portrait_4_3' | 'portrait_16_9' | 'landscape_4_3' | 'landscape_16_9';
      numImages: number
    }) =>
      trpcClient.fal.generateImage.mutate(input),
  })

  const generateVideoMutation = useMutation({
    mutationFn: (input: { prompt: string; imageUrl: string; duration: 5 | 10; aspectRatio: '16:9' | '9:16' | '1:1'; motionStrength: number }) =>
      trpcClient.fal.veo3ImageToVideo.mutate(input),
  })

  const handleGenerate = async () => {
    setContent({ isGenerating: true })

    try {
      // Step 1: Generate image with Fal AI
      const imageResult = await generateImageMutation.mutateAsync({
        prompt: imagePrompt,
        model: 'fal-ai/nano-banana',
        imageSize: 'landscape_16_9',
        numImages: 1,
      })

      if (imageResult.status !== 'completed' || !imageResult.imageUrl) {
        throw new Error(imageResult.error || 'Failed to generate image')
      }

      // Step 2: Generate video with Veo3 using the image
      const videoResult = await generateVideoMutation.mutateAsync({
        prompt: videoPrompt,
        imageUrl: imageResult.imageUrl,
        duration: 5,
        aspectRatio: '16:9',
        motionStrength: 127,
      })

      setContent({
        isGenerating: false,
        imageUrl: imageResult.imageUrl,
        videoUrl: videoResult.videoUrl,
        generationId: videoResult.id
      })
    } catch (error) {
      setContent({
        isGenerating: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      })
    }
  }

  const downloadVideo = async () => {
    if (!content.videoUrl || !content.generationId) return
    
    try {
      const response = await fetch(content.videoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `${content.generationId}.mp4`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download video:', error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Media Generation</CardTitle>
        <p className="text-sm text-gray-600">Generate an image with Fal AI (Nano Banana), then create a video with Veo3</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="imagePrompt">Image Prompt</Label>
          <Input
            id="imagePrompt"
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            disabled={content.isGenerating}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="videoPrompt">Video Animation Prompt</Label>
          <Input
            id="videoPrompt"
            value={videoPrompt}
            onChange={(e) => setVideoPrompt(e.target.value)}
            placeholder="Describe how the image should be animated..."
            disabled={content.isGenerating}
          />
        </div>

        <Button 
          onClick={handleGenerate}
          disabled={content.isGenerating || !imagePrompt.trim() || !videoPrompt.trim()}
          className="w-full"
        >
          {content.isGenerating ? 'Generating...' : 'Generate Image & Video'}
        </Button>

        {content.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{content.error}</p>
          </div>
        )}

        {content.isGenerating && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-600">
              Generating image and video... This may take a few minutes.
            </p>
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <div>1. Generating image with Fal AI (Nano Banana)...</div>
              <div>2. Processing image...</div>
              <div>3. Creating video with Veo3...</div>
            </div>
          </div>
        )}

        {content.imageUrl && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Generated Image</h3>
              <img 
                src={content.imageUrl} 
                alt="Generated image"
                className="w-full rounded-lg border max-h-96 object-contain"
              />
            </div>

            {content.videoUrl && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Generated Video</h3>
                  <Button 
                    onClick={downloadVideo}
                    variant="outline" 
                    size="sm"
                  >
                    Download
                  </Button>
                </div>
                <video 
                  src={content.videoUrl}
                  controls
                  className="w-full rounded-lg border"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}