interface LumaAIVideoRequest {
  imageUrl: string;
  prompt?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  loop?: boolean;
}

export async function generateVideoWithLumaAI({ 
  imageUrl, 
  prompt, 
  aspectRatio = '16:9', 
  loop = false 
}: LumaAIVideoRequest): Promise<{ success: boolean; videoUrl?: string; error?: string; jobId?: string }> {
  try {
    // LumaAI Dream Machine API endpoint
    const response = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LUMAAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dream-machine-v1",
        prompt: prompt || "Animate this scene with smooth camera movement and natural motion",
        keyframes: {
          frame0: {
            type: "image",
            url: imageUrl
          }
        },
        aspect_ratio: aspectRatio,
        loop: loop
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LumaAI video generation error:", errorText);
      
      return {
        success: false,
        error: `API Error: ${response.status} - ${errorText}`
      };
    }

    const data = await response.json();
    
    // LumaAI typically returns a job ID for async processing
    if (data.id) {
      // Poll for completion (simplified version)
      const videoUrl = await pollForCompletion(data.id);
      
      if (videoUrl) {
        return {
          success: true,
          videoUrl,
          jobId: data.id
        };
      } else {
        return {
          success: false,
          error: "Video generation timed out or failed"
        };
      }
    }

    return {
      success: false,
      error: "No job ID returned from LumaAI"
    };

  } catch (error) {
    console.error("Error generating video with LumaAI:", error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate video"
    };
  }
}

// Poll for video completion
async function pollForCompletion(jobId: string, maxAttempts = 30): Promise<string | null> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.LUMAAI_API_KEY}`,
        }
      });

      if (!response.ok) {
        console.error("Error polling LumaAI:", response.status);
        return null;
      }

      const data = await response.json();
      
      if (data.state === 'completed' && data.assets?.video) {
        return data.assets.video;
      } else if (data.state === 'failed') {
        console.error("LumaAI generation failed:", data);
        return null;
      }
      
      // Wait before next poll (LumaAI typically takes 30-60 seconds)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.error("Error polling for completion:", error);
      return null;
    }
  }
  
  console.error("Video generation timed out after", maxAttempts, "attempts");
  return null;
}

// Alternative implementation using Replicate's Luma model if direct API isn't available
export async function generateVideoWithReplicate({ 
  imageUrl, 
  prompt 
}: { imageUrl: string; prompt?: string }): Promise<{ success: boolean; videoUrl?: string; error?: string }> {
  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "a67ca8fe6339c0bc4e2a9c188640ab4c305dfd8c2e3f37a5c1badd74279b2c63", // Luma Dream Machine version
        input: {
          image: imageUrl,
          prompt: prompt || "Animate this scene with smooth camera movement and natural motion"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Replicate API error:", errorText);
      return {
        success: false,
        error: `Replicate API Error: ${response.status} - ${errorText}`
      };
    }

    const prediction = await response.json();
    
    // Poll for completion
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max
    
    while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        }
      });
      
      const statusData = await statusResponse.json();
      
      if (statusData.status === 'succeeded') {
        return {
          success: true,
          videoUrl: statusData.output
        };
      } else if (statusData.status === 'failed') {
        return {
          success: false,
          error: statusData.error || "Video generation failed"
        };
      }
      
      attempts++;
    }

    return {
      success: false,
      error: "Video generation timed out"
    };

  } catch (error) {
    console.error("Error with Replicate video generation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate video"
    };
  }
}