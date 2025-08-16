# Character Wiki

AI-powered NFT character generation and video creation using OpenSea data and Luma AI.

## Quick Start

```bash
# Install dependencies
bun install
bun add lumaai node-fetch
bun add -D @types/node-fetch

# Generate characters from NFTs
bun run src/character-wiki-openai.ts

# Create videos
bun run src/test-lumaai.ts text
bun run src/test-lumaai.ts image "https://images.weserv.nl/?url=[OPENSEA_IMAGE_URL]"
```

## Environment Variables

Create `.env` file:
```env
OPENAI_API_KEY=your-openai-api-key
LUMAAI_API_KEY=your-lumaai-api-key
DATABASE_URL=postgresql://postgres:password@127.0.0.1:5432/loar-fullstack
```

## Video Generation with OpenSea Images

OpenSea images require a proxy to work with Luma AI:

```bash
# ✅ Working command with proxy
bun run src/test-lumaai.ts image "https://images.weserv.nl/?url=https://i2.seadn.io/ethereum/0x8a90cab2b38dba80c64b7734e58ee1db38b8992e/48af7f10ae12f8c7cfd676cf8dcb67b4.png"
```

### How to use the proxy:
1. Take your OpenSea URL: `https://i2.seadn.io/...`
2. Add proxy prefix: `https://images.weserv.nl/?url=`
3. Combine them for the full URL

## Scripts

- `character-wiki-openai.ts` - Generate character profiles from NFTs
- `test-lumaai.ts` - Test video generation (text & image)
- `test-mcp.ts` - Test OpenSea MCP connection
- `get-nft-images.ts` - Extract alternative image URLs

## Output

- Character data: Saved to database + `simple_character_wiki.json`
- Videos: Saved to `output/` directory