import { storeImage } from '../routes/image';
import { walrusService } from './walrus';

interface GeminiImageRequest {
  prompt: string;
  universeId?: string;
  context?: string;
}

export async function generateImageWithGemini({ prompt }: GeminiImageRequest): Promise<{ success: boolean; imageUrl?: string; error?: string; enhancedPrompt?: string }> {
  try {
    // Use exactly the same API structure as working Python test.py
    // Python: contents="A kawaii-style sticker..."
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini image generation error:", errorText);
      
      return {
        success: false,
        error: `API Error: ${response.status} - ${errorText}`
      };
    }

    const data = await response.json();
    
    // Extract image data from response - API returns inlineData (camelCase) not inline_data (snake_case)
    if (data.candidates && data.candidates[0]?.content?.parts) {
      const imageParts = data.candidates[0].content.parts
        .filter((part: any) => part.inlineData)
        .map((part: any) => part.inlineData.data);
      
      if (imageParts.length > 0) {
        const imageData = imageParts[0];
        
        try {
          // Convert base64 to buffer for upload
          const imageBuffer = Buffer.from(imageData, 'base64');
          
          console.log('Uploading generated image to public service...');
          
          // Try multiple upload services like in test_lumaai.py
          const uploadUrl = await uploadImageToPublicService(imageBuffer);
          
          if (uploadUrl) {
            console.log('Image uploaded successfully:', uploadUrl);
            return {
              success: true,
              imageUrl: uploadUrl,
              enhancedPrompt: prompt
            };
          } else {
            throw new Error('All upload services failed');
          }
          
        } catch (uploadError) {
          console.error('Failed to upload to public services:', uploadError);
          
          // Fallback to temporary storage if all services fail
          const imageId = storeImage(imageData, 'image/png');
          const publicUrl = `http://localhost:${process.env.PORT || '3000'}`;
          const imageUrl = `${publicUrl}/images/temp/${imageId}`;
          
          return {
            success: true,
            imageUrl,
            enhancedPrompt: prompt,
            error: 'Using temporary storage - may not work with LumaAI'
          };
        }
      }
    }

    return {
      success: false,
      error: "No image data in response"
    };

  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate image"
    };
  }
}

// Alternative approach using Gemini Pro Vision with image understanding
async function generateWithGeminiProVision({ prompt, universeId, context }: GeminiImageRequest): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  try {
    // Since Gemini doesn't directly generate images, we'll create a detailed description
    // that can be used with external services or as a placeholder
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Create a detailed visual description for this scene that could be used for concept art or storyboarding: "${prompt}".
              
              Include:
              1. Visual composition and camera angle
              2. Color palette and lighting
              3. Key visual elements and their positions
              4. Atmosphere and mood
              5. Any special effects or unique visual features
              
              Format the response as a detailed art direction brief.`
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const artDirection = data.candidates[0].content.parts[0].text;
      
      // For now, return a placeholder with the art direction
      // In production, this could be sent to DALL-E, Midjourney, or another service
      return {
        success: true,
        imageUrl: `https://via.placeholder.com/1024x576/1a1a2e/eee?text=${encodeURIComponent(prompt.slice(0, 30))}`,
        error: `Art direction generated: ${artDirection.slice(0, 200)}...`
      };
    }

    throw new Error("No response from Gemini API");

  } catch (error) {
    console.error("Error with Gemini Pro Vision:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate image description"
    };
  }
}

// Fallback function to generate an enhanced image prompt using text generation
async function generateImagePromptWithGemini({ prompt, universeId }: { prompt: string; universeId?: string }): Promise<{ success: boolean; imageUrl?: string; error?: string; enhancedPrompt?: string }> {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY || "",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Create a detailed, vivid image description for this scene: "${prompt}". 
                  Include specific details about:
                  - Visual composition and framing
                  - Lighting and color palette
                  - Character positions and expressions
                  - Background and environment details
                  - Cinematic style and mood
                  Make it suitable for a movie production concept art.`
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const enhancedPrompt = data.candidates[0].content.parts[0].text;
      
      // Return the enhanced prompt as a placeholder
      // In production, this could be sent to another image generation service
      return {
        success: true,
        enhancedPrompt,
        imageUrl: `https://via.placeholder.com/800x450.png?text=${encodeURIComponent(prompt.slice(0, 50))}`,
        error: "Image generation not available, returning enhanced prompt instead"
      };
    }

    throw new Error("No response from Gemini API");

  } catch (error) {
    console.error("Error with Gemini text generation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate image or prompt"
    };
  }
}

// Upload function similar to test_lumaai.py
async function uploadImageToPublicService(imageBuffer: Buffer): Promise<string | null> {
  const services = [
    {
      name: 'tmpfiles.org',
      url: 'https://tmpfiles.org/api/v1/upload',
      fieldName: 'file'
    },
    {
      name: 'catbox.moe', 
      url: 'https://catbox.moe/user/api.php',
      fieldName: 'fileToUpload'
    }
  ];

  for (const service of services) {
    try {
      console.log(`Trying ${service.name}...`);
      
      const FormData = require('form-data');
      const form = new FormData();
      
      form.append(service.fieldName, imageBuffer, {
        filename: 'generated_image.png',
        contentType: 'image/png'
      });

      if (service.name === 'catbox.moe') {
        form.append('reqtype', 'fileupload');
      }

      const response = await fetch(service.url, {
        method: 'POST',
        body: form,
        headers: form.getHeaders()
      });

      if (response.ok) {
        if (service.name === 'tmpfiles.org') {
          const result = await response.json();
          if (result?.status === 'success') {
            const fileUrl = result.data.url;
            const uploadUrl = fileUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
            console.log(`✅ Image uploaded to ${service.name}: ${uploadUrl}`);
            return uploadUrl;
          }
        } else if (service.name === 'catbox.moe') {
          const uploadUrl = (await response.text()).trim();
          if (uploadUrl) {
            console.log(`✅ Image uploaded to ${service.name}: ${uploadUrl}`);
            return uploadUrl;
          }
        }
      } else {
        console.log(`❌ ${service.name} failed: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${service.name} error:`, error);
    }
  }

  console.log('❌ All upload services failed');
  return null;
}