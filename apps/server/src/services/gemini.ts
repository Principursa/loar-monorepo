import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY || "");

export interface WikiData {
  title: string;
  summary: string;
  videoAnalysis: {
    setting: string;
    visualStyle: string;
    subjects: string;
    action: string;
  };
  plot: string;
  elements: Array<{
    name: string;
    description: string;
    actions: string[];
  }>;
  keyMoments: string[];
  duration?: string;
  visualDetails?: string[];
}

export interface VideoAnalysisResult {
  wikiData: WikiData;
  metadata: {
    tokensUsed: number;
    inputTokens: number;
    outputTokens: number;
    costUsd: number;
    generatedBy: string;
  };
}

/**
 * Generate wiki entry from video using Gemini 2.5 Pro
 */
export async function generateWikiFromVideo(
  videoUrl: string,
  eventData: {
    eventId: string;
    title: string;
    description: string;
    characterIds?: string[];
    characters?: Array<{
      name: string;
      userDescription: string;
      visualDescription?: string;
    }>;
    previousEvents?: Array<{ title: string; description: string }>;
  }
): Promise<VideoAnalysisResult> {
  console.log(`🎬 Generating wiki for event ${eventData.eventId}`);
  console.log(`📝 Characters provided: ${eventData.characters?.length || 0}`);
  if (eventData.characters && eventData.characters.length > 0) {
    console.log(`👥 Character names: ${eventData.characters.map(c => c.name).join(', ')}`);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  // Build context from characters
  let characterContext = "";
  let characterNames: string[] = [];
  if (eventData.characters && eventData.characters.length > 0) {
    characterContext = "\n\nCHARACTERS IN THIS SCENE:\n";
    eventData.characters.forEach((char) => {
      characterNames.push(char.name);
      characterContext += `- **${char.name}**: ${char.userDescription}`;
      if (char.visualDescription) {
        characterContext += `\n  Visual appearance: ${char.visualDescription}`;
      }
      characterContext += "\n";
    });
  }

  // Build context from previous events
  let context = "";
  if (eventData.previousEvents && eventData.previousEvents.length > 0) {
    context = "\n\nPREVIOUS EVENTS IN THIS TIMELINE:\n";
    eventData.previousEvents.forEach((evt, idx) => {
      context += `${idx + 1}. ${evt.title}: ${evt.description}\n`;
    });
  }

  // Create prompt focused on factual observation
  const prompt = `You are analyzing a video to extract factual information for a story wiki.

EVENT CONTEXT:
Event ID: ${eventData.eventId}
User Description: ${eventData.description}
${characterContext}${context}

YOUR TASK:
1. Watch the video carefully
2. Identify what is actually visible and happening
3. Extract key elements (people, objects, actions, setting)
4. Describe events factually without adding fictional details
${eventData.characters && eventData.characters.length > 0 ? `5. Use the provided character names and descriptions to identify characters in the video` : ''}

CRITICAL RULES:
- Describe ONLY what you see in the video
- Do NOT invent objects, dialogue, or actions not visible
- Do NOT add dramatic interpretations unless clearly shown
${eventData.characters && eventData.characters.length > 0
  ? `- **IMPORTANT**: The following characters are in this scene: ${characterNames.join(', ')}. When you recognize these characters in the video based on their descriptions, you MUST use their exact names (e.g., "${eventData.characters[0]?.name}"). Do NOT use generic terms like "elf", "wizard", "man", "woman" - always use the specific character names provided.`
  : '- Identify characters/subjects based on what\'s visible (e.g., "person in red shirt", "eagle", "car")'}
- Focus on observable actions and events
${eventData.characters && eventData.characters.length > 0 ? '- In the "elements" array, the "name" field should use the provided character names when describing those characters' : ''}

Generate a JSON response:
{
  "title": "Descriptive title based on main action",
  "summary": "1-2 sentence factual summary of video content",
  "videoAnalysis": {
    "setting": "Visible environment (terrain, location, time of day, weather)",
    "visualStyle": "Camera work (handheld, aerial, static, etc.) and video quality",
    "subjects": "Who/what appears in the video",
    "action": "What happens in the video, chronologically"
  },
  "plot": "2-3 paragraphs describing the sequence of events visible in the video. Use present tense. Be factual.",
  "elements": [
    {
      "name": "Subject name (person, animal, object)",
      "description": "Observable characteristics",
      "actions": ["visible action 1", "visible action 2"]
    }
  ],
  "keyMoments": [
    "Moment 1: specific visible event",
    "Moment 2: specific visible event",
    "Moment 3: specific visible event"
  ],
  "duration": "Approximate video length",
  "visualDetails": ["notable visual detail 1", "notable visual detail 2"]
}

Output valid JSON only. Be precise and factual.`;

  try {
    // Download video to buffer first (required for uploadFile)
    console.log(`📤 Downloading video: ${videoUrl}`);
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }
    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
    console.log(`✅ Downloaded ${videoBuffer.length} bytes`);

    // Upload video file to Gemini
    console.log(`📤 Uploading video to Gemini...`);
    const uploadResult = await fileManager.uploadFile(videoBuffer, {
      mimeType: "video/mp4",
      displayName: `event-${eventData.eventId}.mp4`,
    });

    // Wait for video to be processed
    let file = uploadResult.file;
    while (file.state === "PROCESSING") {
      console.log("⏳ Video processing...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      file = await fileManager.getFile(file.name);
    }

    if (file.state === "FAILED") {
      throw new Error("Video processing failed");
    }

    console.log("✅ Video ready, analyzing...");

    // Generate content
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: file.mimeType,
          fileUri: file.uri,
        },
      },
      { text: prompt },
    ]);

    const response = result.response;
    const text = response.text();

    // Extract JSON from markdown if needed
    let jsonText = text.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.split("```json")[1].split("```")[0].trim();
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.split("```")[1].split("```")[0].trim();
    }

    const wikiData = JSON.parse(jsonText) as WikiData;

    // Calculate costs
    const usage = response.usageMetadata;
    if (!usage) {
      throw new Error("No usage metadata returned");
    }

    const inputTokens = usage.promptTokenCount || 0;
    const outputTokens = usage.candidatesTokenCount || 0;
    const tokensUsed = usage.totalTokenCount || inputTokens + outputTokens;

    // Gemini 2.5 Pro pricing: $1.25/1M input, $10/1M output
    const inputCost = (inputTokens / 1_000_000) * 1.25;
    const outputCost = (outputTokens / 1_000_000) * 10.0;
    const costUsd = inputCost + outputCost;

    console.log(`✅ Wiki generated!`);
    console.log(`📊 Tokens: ${tokensUsed} (in: ${inputTokens}, out: ${outputTokens})`);
    console.log(`💰 Cost: $${costUsd.toFixed(6)}`);

    return {
      wikiData,
      metadata: {
        tokensUsed,
        inputTokens,
        outputTokens,
        costUsd,
        generatedBy: "gemini-2.5-pro",
      },
    };
  } catch (error) {
    console.error("❌ Wiki generation failed:", error);
    throw error;
  }
}

/**
 * Analyze character image to generate detailed visual description
 */
export async function analyzeCharacterImage(
  imageUrl: string,
  userDescription: string,
  characterName: string
): Promise<string> {
  console.log(`🎨 Analyzing character image for: ${characterName}`);

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  const prompt = `You are analyzing a character image to create a detailed visual description for narrative consistency.

CHARACTER NAME: ${characterName}
USER DESCRIPTION: ${userDescription}

YOUR TASK:
Analyze this character image and provide a detailed visual description that will help maintain consistency when this character appears in different scenes.

FOCUS ON:
1. Physical appearance (hair color/style, eye color, facial features, skin tone, body type)
2. Clothing and accessories (colors, style, distinctive items)
3. Distinctive features or markings (scars, tattoos, jewelry, props)
4. Pose and expression in this image
5. Art style characteristics (realistic, anime, stylized, etc.)

CRITICAL RULES:
- Be specific and precise (e.g., "shoulder-length brown hair" not "dark hair")
- Focus on visual details that are consistent across scenes
- Include colors, patterns, and textures
- Describe distinctive features that make this character recognizable
- Keep it concise but informative (3-5 sentences)
- Use present tense
- No dramatic interpretation, just visual facts

Generate a detailed visual description in plain text (no JSON, no formatting).`;

  try {
    // Generate content with image
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/png",
          data: await fetch(imageUrl).then(r => r.arrayBuffer()).then(b => Buffer.from(b).toString('base64'))
        }
      },
      { text: prompt },
    ]);

    const response = result.response;
    const description = response.text().trim();

    // Calculate costs
    const usage = response.usageMetadata;
    const inputTokens = usage?.promptTokenCount || 0;
    const outputTokens = usage?.candidatesTokenCount || 0;
    const costUsd = ((inputTokens / 1_000_000) * 1.25) + ((outputTokens / 1_000_000) * 10.0);

    console.log(`✅ Character analysis complete!`);
    console.log(`📊 Tokens: ${inputTokens + outputTokens} (in: ${inputTokens}, out: ${outputTokens})`);
    console.log(`💰 Cost: $${costUsd.toFixed(6)}`);

    return description;
  } catch (error) {
    console.error("❌ Character analysis failed:", error);
    throw error;
  }
}

export const geminiService = {
  generateWikiFromVideo,
  analyzeCharacterImage,
};
