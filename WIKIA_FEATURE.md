# Wikia Storyline Feature Documentation

## Overview

The wikia feature automatically generates **detailed storylines** for video events/nodes using OpenAI's GPT models. The system creates rich narrative descriptions that tell the full story of what happens in each event, providing dramatic context and narrative continuity across your cinematic universe.

## Architecture

### Backend Components

#### 1. Wikia Service (`apps/server/src/services/wikia.ts`)

The service provides two main functions:

- **`generateWikiaEntry()`**: Generates a complete wikia entry with:
  - **Title**: Event title
  - **Summary**: 2-3 sentence overview
  - **Plot**: Detailed 3-5 paragraph narrative expansion
  - **Characters**: List of characters involved
  - **Themes**: Key themes explored (e.g., "redemption", "sacrifice")
  - **Significance**: Why this event matters to the overall narrative
  - **Connected Events**: How this connects to previous/next events
  - **Key Moments**: 3-5 key dramatic moments or quotes

- **`generateEventSummary()`**: Creates brief, engaging one-sentence summaries for list displays

#### 2. tRPC API Route (`apps/server/src/routers/index.ts`)

Exposed as `wiki.generateEventWikia` mutation endpoint:

```typescript
wiki.generateEventWikia.mutate({
  nodeId: number,
  title: string,
  description: string,
  videoUrl: string,
  previousNodes?: Array<{ title: string; plot: string }>,
  nextNodes?: Array<{ title: string; plot: string }>
})
```

### Frontend Components

#### Event Page Integration (`apps/web/src/routes/event/$universeId.$eventId.tsx`)

The wikia feature is integrated into the event detail page with:

1. **Generate Button**: Triggers wikia generation
2. **Loading State**: Shows spinner during generation
3. **Error Handling**: Displays error messages if generation fails
4. **Rich Display**: Formatted wikia entry with sections for:
   - Summary (highlighted)
   - Plot (prose format)
   - Characters (badges)
   - Themes (outlined badges)
   - Narrative Significance (highlighted)
   - Key Moments (bulleted list)
   - Connected Events (list)
5. **Regenerate Option**: Allows regenerating wikia with different results

## Setup Instructions

### 1. Configure OpenAI API Key

Add your OpenAI API key to the server environment:

**`apps/server/.env`**:
```bash
OPENAI_API_KEY=your-openai-api-key-here
```

Get your API key from: https://platform.openai.com/api-keys

### 2. Dependencies

The OpenAI package is already included in the server dependencies:

```json
"openai": "^6.3.0"
```

### 3. Start the Development Server

```bash
# From the monorepo root
bun dev

# Or start services individually
bun dev:server  # Start backend
bun dev:web     # Start frontend
```

## Usage

### Generating a Wikia Entry

1. Navigate to any event page: `/event/{universeId}/{eventId}`
2. Scroll to the "Event Wikia" section
3. Click "Generate Wikia" button
4. Wait for AI generation (typically 3-10 seconds)
5. Review the generated content
6. Optionally click "Regenerate Wikia" for different results

### API Usage

You can also call the wikia generation directly via tRPC:

```typescript
import { trpcClient } from '@/utils/trpc';

const wikiaEntry = await trpcClient.wiki.generateEventWikia.mutate({
  nodeId: 1,
  title: "The Neon Awakening",
  description: "Our heroes discover the truth behind the corporate conspiracy",
  videoUrl: "https://example.com/video.mp4",
  previousNodes: [
    { title: "Previous Event", plot: "What happened before..." }
  ],
  nextNodes: [
    { title: "Next Event", plot: "What happens next..." }
  ]
});

console.log(wikiaEntry.plot); // Detailed narrative
console.log(wikiaEntry.themes); // ["conspiracy", "discovery", "truth"]
```

## Features

### Contextual Generation

The wikia service considers:
- The event's description and title
- Previous events (for narrative continuity)
- Next events (for foreshadowing)
- Video content (via URL)

### Fallback Handling

If OpenAI fails or is unavailable, the service returns a basic wikia entry using the original description.

### Customization

You can modify the prompts in `wikia.ts` to:
- Change the tone (e.g., more dramatic, technical, humorous)
- Adjust length (shorter summaries, longer plots)
- Focus on specific aspects (character development, world-building)
- Match your universe's style

Example prompt modification:

```typescript
const systemPrompt = `You are a professional wikia editor for a [CYBERPUNK/FANTASY/SCI-FI] cinematic universe.
Your tone should be [DRAMATIC/TECHNICAL/CASUAL].
Format responses as structured wikia articles with clear sections.`;
```

## Model Configuration

Current settings:
- **Model**: `gpt-4o-mini` (fast and cost-effective)
- **Temperature**: 0.8 (creative but consistent)
- **Max Tokens**: 2000 (allows detailed responses)
- **Response Format**: JSON object (structured data)

To use a more powerful model:

```typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4o',  // Change to gpt-4o for better quality
  // ... rest of config
});
```

## Cost Considerations

With `gpt-4o-mini`:
- ~$0.15 per 1M input tokens
- ~$0.60 per 1M output tokens
- Typical wikia generation: ~$0.001-0.003 per entry

For production, consider:
- Caching generated wikias in database
- Rate limiting generation requests
- Using webhooks for background processing

## Future Enhancements

Potential improvements:
1. **Database Storage**: Save generated wikias to avoid regeneration
2. **Version History**: Track wikia edits and versions
3. **User Editing**: Allow manual wikia editing with AI suggestions
4. **Batch Generation**: Generate wikias for multiple events at once
5. **Image Analysis**: Use GPT-4 Vision to analyze video content
6. **Cross-References**: Auto-link to related events and characters
7. **Export Options**: Export wikias as Markdown, HTML, or PDF

## Troubleshooting

### "Failed to generate wikia"

1. **Check API Key**: Ensure `OPENAI_API_KEY` is set in `.env`
2. **Check Balance**: Verify your OpenAI account has credits
3. **Check Network**: Ensure server can reach OpenAI API
4. **Check Logs**: Review server console for detailed error messages

### "No content returned from OpenAI"

This usually means:
- The response was empty (rare)
- The API request timed out
- The model refused the request (content policy violation)

Check the server logs for the full error.

### Slow Generation

If wikia generation is slow:
- Switch to `gpt-4o-mini` (already default)
- Reduce `max_tokens` to 1000 for shorter content
- Consider background processing with webhooks

## Related Files

- Backend Service: [apps/server/src/services/wikia.ts](apps/server/src/services/wikia.ts)
- API Route: [apps/server/src/routers/index.ts](apps/server/src/routers/index.ts)
- Frontend Component: [apps/web/src/routes/event/$universeId.$eventId.tsx](apps/web/src/routes/event/$universeId.$eventId.tsx)
- Environment Config: [apps/server/.env](apps/server/.env)

## License

This feature is part of the LOAR project and follows the same license terms.
