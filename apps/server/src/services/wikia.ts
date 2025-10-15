import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface WikiaEntry {
  title: string;
  summary: string;
  plot: string;
  characters: string[];
  themes: string[];
  significance: string;
  connectedEvents: string[];
  keyMoments: string[];
}

/**
 * Generate a well-formatted wikia entry from a video node description
 * using OpenAI's GPT model
 */
export async function generateWikiaEntry(
  nodeId: number,
  title: string,
  description: string,
  videoUrl: string,
  previousNodes?: Array<{ title: string; plot: string }>,
  nextNodes?: Array<{ title: string; plot: string }>
): Promise<WikiaEntry> {
  const context = buildContextFromConnectedNodes(previousNodes, nextNodes);

  const systemPrompt = `You are a master storyteller and wikia writer for a collaborative cinematic universe.
Your primary goal is to craft compelling, detailed storylines that bring events to life.
Write in a narrative, engaging style that makes readers feel immersed in the story.
Be creative and expansive - turn brief descriptions into rich, cinematic narratives with vivid details, character depth, and emotional resonance.`;

  const userPrompt = `Create a detailed storyline wikia entry for the following event:

Title: ${title}
Description: ${description}
Video URL: ${videoUrl}
Event ID: ${nodeId}

${context}

Your task is to expand this brief description into a full cinematic storyline. Imagine you're watching this scene unfold and describing everything that happens.

Generate a wikia entry with the following structure (respond in JSON format):
{
  "title": "The event title (make it dramatic and compelling)",
  "summary": "A gripping 2-3 sentence hook that captures the essence of this event's storyline",
  "plot": "THE MAIN STORYLINE (4-6 detailed paragraphs): Write this as a vivid narrative that describes exactly what happens in this event. Include:
    - Opening: How the scene begins, the setting, the atmosphere
    - Rising Action: What events unfold, character actions and reactions
    - Conflict/Tension: The central dramatic moment or challenge
    - Climax: The peak of action or emotion in this event
    - Resolution: How this event concludes and what it sets up

    Write in present tense, as if describing a movie scene. Include sensory details, emotions, dialogue snippets (if applicable), and make the reader visualize the scene.",

  "characters": ["List main characters and their roles in THIS specific event (e.g., 'Alex - The reluctant hero who makes the critical decision')"],
  "themes": ["2-4 themes explored (e.g., 'sacrifice', 'trust', 'redemption')"],
  "significance": "2-3 sentences explaining why this storyline moment matters to the larger narrative arc",
  "connectedEvents": ["How the storyline flows from previous events and into future ones"],
  "keyMoments": ["4-6 specific story beats or memorable moments from this event's narrative (e.g., 'The moment when Sarah realizes the truth about her past')"]
}

IMPORTANT: The "plot" field should be the heart of this wikia - a complete, engaging storyline that tells readers exactly what happens in this event from beginning to end. Write it like you're narrating a movie scene.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.9, // Higher creativity for storytelling
      max_tokens: 3000, // More tokens for detailed storylines
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    const wikiaEntry = JSON.parse(content) as WikiaEntry;

    // Validate the response has required fields
    if (!wikiaEntry.title || !wikiaEntry.plot) {
      throw new Error('Invalid wikia entry format from OpenAI');
    }

    return wikiaEntry;
  } catch (error) {
    console.error('Error generating wikia entry:', error);

    // Return a basic fallback entry if OpenAI fails
    return {
      title,
      summary: description.substring(0, 200),
      plot: description,
      characters: [],
      themes: [],
      significance: 'Part of the ongoing narrative timeline.',
      connectedEvents: [],
      keyMoments: [],
    };
  }
}

/**
 * Build context string from connected nodes
 */
function buildContextFromConnectedNodes(
  previousNodes?: Array<{ title: string; plot: string }>,
  nextNodes?: Array<{ title: string; plot: string }>
): string {
  let context = '';

  if (previousNodes && previousNodes.length > 0) {
    context += '\n\nPREVIOUS EVENTS:\n';
    previousNodes.forEach((node, idx) => {
      context += `${idx + 1}. ${node.title}: ${node.plot}\n`;
    });
  }

  if (nextNodes && nextNodes.length > 0) {
    context += '\n\nSUBSEQUENT EVENTS:\n';
    nextNodes.forEach((node, idx) => {
      context += `${idx + 1}. ${node.title}: ${node.plot}\n`;
    });
  }

  return context;
}

/**
 * Generate a detailed storyline description from a simple user prompt
 * This is used DURING event creation to expand the user's idea into a full narrative
 */
export async function generateStorylineFromPrompt(
  userPrompt: string,
  characters: string[],
  previousEvents?: Array<{ title: string; description: string }>
): Promise<{ title: string; description: string }> {
  // Build context from previous events
  let context = '';
  if (previousEvents && previousEvents.length > 0) {
    context = '\n\nPREVIOUS EVENTS IN THIS UNIVERSE:\n';
    previousEvents.forEach((event, idx) => {
      context += `${idx + 1}. ${event.title}: ${event.description}\n`;
    });
  }

  // Build character context
  let characterContext = '';
  if (characters && characters.length > 0) {
    characterContext = `\n\nCHARACTERS IN THIS SCENE: ${characters.join(', ')}`;
  }

  const systemPrompt = `You are a creative storyteller for a cinematic universe.
Your job is to take a simple user prompt and expand it into a rich, detailed scene description.
Write in a cinematic, visual style that would work well for AI image and video generation.
Focus on visual details, atmosphere, action, and emotion.`;

  const fullPrompt = `The user wants to create a new event in their cinematic universe with this idea:

"${userPrompt}"
${characterContext}
${context}

Based on this prompt and the context above, generate:
1. A compelling event title (dramatic, 3-6 words)
2. A detailed scene description (3-4 paragraphs) that:
   - Incorporates the characters mentioned
   - Flows naturally from previous events (if any)
   - Describes what visually happens in this scene
   - Includes atmosphere, setting, character actions, and emotions
   - Is written in a way that's perfect for AI image/video generation

Respond in JSON format:
{
  "title": "The Event Title",
  "description": "The detailed visual description..."
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: fullPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    const result = JSON.parse(content) as { title: string; description: string };
    return result;
  } catch (error) {
    console.error('Error generating storyline from prompt:', error);
    // Return the user's original input as fallback
    return {
      title: userPrompt.substring(0, 50),
      description: userPrompt,
    };
  }
}

/**
 * Generate a shorter summary for display in lists
 */
export async function generateEventSummary(
  title: string,
  description: string
): Promise<string> {
  const systemPrompt = `You are a concise editor. Create brief, engaging summaries for story events.`;

  const userPrompt = `Create a single engaging sentence (max 20 words) that summarizes this event:

Title: ${title}
Description: ${description}

Return only the summary sentence, no additional text.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    return response.choices[0]?.message?.content?.trim() || description.substring(0, 100);
  } catch (error) {
    console.error('Error generating summary:', error);
    return description.substring(0, 100);
  }
}

export const wikiaService = {
  generateWikiaEntry,
  generateEventSummary,
  generateStorylineFromPrompt,
};
