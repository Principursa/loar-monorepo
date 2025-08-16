import { Agent, run, MCPServerStreamableHttp } from '@openai/agents';
import { config } from 'dotenv';
import fs from 'fs/promises';

config();

interface CharacterData {
  id: string;
  character_name: string;
  collection: string;
  token_id: string;
  traits: Record<string, string>;
  rarity_rank: number;
  rarity_percentage: number;
  image_url: string;
  description: string;
  created_at: string;
}

interface WikiData {
  metadata: {
    version: string;
    created_at: string;
    total_characters: number;
    last_updated: string;
  };
  characters: CharacterData[];
}

export class SimplifiedCharacterWiki {
  private mcpServer: MCPServerStreamableHttp;
  private agent: Agent;
  private wikiFile: string = 'simple_character_wiki.json';
  private wiki: WikiData;

  constructor() {
    // Create MCP server connection
    this.mcpServer = new MCPServerStreamableHttp({
      url: 'https://mcp.opensea.io/hCaTcrq7iFjnZO4ho0vhGtCMs2GiC7qP7xVFYvwX0I/mcp',
      name: 'OpenSea MCP Server',
    });

    // Create agent
    this.agent = new Agent({
      name: 'OpenSea Character Wiki Assistant',
      instructions: `You are an expert at extracting NFT information and creating character profiles. 
      When getting NFT details, always extract:
      - All traits/attributes 
      - Rarity rank and percentage
      - Image URL
      - Collection name
      - Token ID
      
      Present the information in a clear, structured format.`,
      mcpServers: [this.mcpServer],
    });

    this.wiki = {
      metadata: {
        version: '4.0',
        created_at: new Date().toISOString(),
        total_characters: 0,
        last_updated: new Date().toISOString()
      },
      characters: []
    };

    this.loadWiki();
  }

  async loadWiki(): Promise<void> {
    try {
      const data = await fs.readFile(this.wikiFile, 'utf-8');
      this.wiki = JSON.parse(data);
    } catch {
      console.log('📄 Creating new wiki file');
    }
  }

  async saveWiki(): Promise<void> {
    await fs.writeFile(this.wikiFile, JSON.stringify(this.wiki, null, 2));
    console.log(`💾 Wiki saved to ${this.wikiFile}`);
  }

  async connect(): Promise<void> {
    console.log('🔌 Connecting to OpenSea MCP server...');
    await this.mcpServer.connect();
    console.log('✅ Connected successfully');
  }

  async disconnect(): Promise<void> {
    await this.mcpServer.close();
    console.log('👋 Disconnected from MCP server');
  }

  cleanTraits(traits: Record<string, string>): Record<string, string> {
    const cleaned: Record<string, string> = {};

    for (const [traitName, traitValue] of Object.entries(traits)) {
      // Clean trait name - remove **, newlines, numbers, etc.
      let cleanName = traitName;
      cleanName = cleanName.replace(/(Traits\s*\n*)?(\d+\.\s*)?(\*\*)?([^*\n]+)(\*\*)?/, '$4');
      cleanName = cleanName.trim();

      // Clean trait value - remove ** and extra whitespace
      const cleanValue = traitValue.replace(/\*\*/g, '').trim();

      // Skip invalid traits (separators, headers, etc.)
      const skipPatterns = [
        /^-+$/, // Lines with only dashes
        /^=+$/, // Lines with only equals
        'Trait Type', 'Value', 'trait type', 'value',
        'Collection Name', 'Token ID', 'Image URL', 'Rarity Rank'
      ];

      const shouldSkip = skipPatterns.some(pattern => {
        if (typeof pattern === 'string') {
          return cleanName === pattern || cleanValue === pattern;
        } else {
          return pattern.test(cleanName) || pattern.test(cleanValue);
        }
      });

      if (!shouldSkip && cleanName && cleanValue) {
        cleaned[cleanName] = cleanValue;
      }
    }

    return cleaned;
  }

  async generateCharacterProfile(characterData: {
    collection: string;
    token_id: string;
    traits: Record<string, string>;
    rarity_rank: number;
  }): Promise<{ name: string; description: string }> {
    const traitsText = Object.entries(characterData.traits)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');

    const characterAgent = new Agent({
      name: 'Character Profile Generator',
      instructions: `You are a creative character designer. Create a unique character profile for an NFT.

IMPORTANT: You must respond with ONLY valid JSON in this exact format:
{"name": "Character Name", "description": "Character description"}

Do not include any other text, formatting, or explanation. Just the JSON.

The character should have:
- A unique, memorable name (not just "Collection #1234")  
- A creative 2-3 sentence description that brings them to life
- Personality traits based on their visual features
- Suitable for video storytelling`,
    });

    const prompt = `Create a character profile for this NFT from the ${characterData.collection} tribe:

Token ID: #${characterData.token_id}
Traits: ${traitsText}
Rarity Rank: #${characterData.rarity_rank}`;

    try {
      const result = await run(characterAgent, prompt);
      let content = result.finalOutput?.trim() || '';

      // Extract JSON if wrapped in markdown
      if (content.includes('```json')) {
        const jsonMatch = content.match(/```json\s*(.*?)\s*```/s);
        if (jsonMatch) {
          content = jsonMatch[1];
        }
      } else if (content.includes('```')) {
        const jsonMatch = content.match(/```\s*(.*?)\s*```/s);
        if (jsonMatch) {
          content = jsonMatch[1];
        }
      }

      const profileData = JSON.parse(content);
      return profileData;

    } catch (error) {
      console.log(`Error generating profile: ${error}`);
      return {
        name: `Member of ${characterData.collection} #${characterData.token_id}`,
        description: `A unique character from the ${characterData.collection} tribe with distinctive ${traitsText}.`
      };
    }
  }

  parseOpenSeaResponse(response: string, collectionName: string, tokenId: string) {
    const data = {
      traits: {} as Record<string, string>,
      rarity: { rank: 0, percentage: 0 },
      image_url: ''
    };

    console.log('🔍 Parsing OpenSea response...');
    console.log('First 500 chars of response:');
    console.log(response.substring(0, 500));

    // Extract traits - multiple patterns to try
    const traitPatterns = [
      // Pattern 1: **Traits:** followed by list
      /\*\*Traits:\*\*\s*([\s\S]*?)(?:\*\*Rarity|\*\*Price|\*\*Recent|---|\Z)/,
      // Pattern 2: **Attributes:** followed by list  
      /\*\*Attributes:\*\*\s*([\s\S]*?)(?:\*\*Rarity|\*\*Price|\*\*Recent|---|\Z)/,
      // Pattern 3: Just traits section
      /(?:^|\n)\s*-\s*Eyes:[\s\S]*?(?=\n\*\*|\Z)/m
    ];

    for (const pattern of traitPatterns) {
      const traitMatches = response.match(pattern);
      if (traitMatches) {
        const traitsSection = traitMatches[1] || traitMatches[0];
        console.log('Found traits section:', traitsSection.substring(0, 200));

        const traitLines = traitsSection.split('\n');

        for (const line of traitLines) {
          // Match patterns like "- Eyes: Sleepy" or "Eyes: Sleepy"
          const match = line.match(/^\s*-?\s*([^:]+):\s*(.+)$/);
          if (match) {
            const traitName = match[1].trim();
            const traitValue = match[2].trim();
            if (traitName && traitValue) {
              data.traits[traitName] = traitValue;
              console.log(`  Found trait: ${traitName} = ${traitValue}`);
            }
          }
        }

        if (Object.keys(data.traits).length > 0) {
          break; // Found traits, stop trying other patterns
        }
      }
    }

    // If no traits found with structured approach, try table format and line by line
    if (Object.keys(data.traits).length === 0) {
      console.log('Trying table format parsing...');

      // Look for table format: | Trait Type | Value |
      const tableMatches = response.match(/\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g);
      if (tableMatches) {
        for (const row of tableMatches) {
          const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
          if (cells.length === 2) {
            const traitName = cells[0];
            const traitValue = cells[1];

            // Skip header row, separator rows, and invalid data
            const skipPatterns = [
              'Trait Type', 'Value', 'trait type', 'value',
              /^-+$/, // Lines with only dashes
              /^=+$/, // Lines with only equals
              '', // Empty cells
            ];

            const shouldSkip = skipPatterns.some(pattern => {
              if (typeof pattern === 'string') {
                return traitName === pattern || traitValue === pattern;
              } else {
                return pattern.test(traitName) || pattern.test(traitValue);
              }
            });

            if (!shouldSkip && traitName && traitValue) {
              data.traits[traitName] = traitValue;
              console.log(`  Found table trait: ${traitName} = ${traitValue}`);
            }
          }
        }
      }

      // If still no traits, try line by line
      if (Object.keys(data.traits).length === 0) {
        console.log('Trying line-by-line parsing...');
        const lines = response.split('\n');
        for (const line of lines) {
          // Match various patterns: "- Trait: Value", "Trait: Value", "  - Trait: Value"
          const match = line.match(/^\s*-?\s*([A-Za-z\s]+):\s*([A-Za-z\s0-9]+)$/);
          if (match) {
            const traitName = match[1].trim();
            const traitValue = match[2].trim();
            // Filter out non-trait lines like "Collection Name", "Token ID"
            if (!['Collection Name', 'Token ID', 'Image URL', 'Rarity Rank'].includes(traitName)) {
              data.traits[traitName] = traitValue;
              console.log(`  Found trait: ${traitName} = ${traitValue}`);
            }
          }
        }
      }
    }

    // Extract rarity with multiple patterns
    const rankPatterns = [
      /Rank:\s*([0-9,]+)/,
      /rank:\s*([0-9,]+)/i,
      /Rank\s*([0-9,]+)/
    ];

    for (const pattern of rankPatterns) {
      const rankMatch = response.match(pattern);
      if (rankMatch) {
        data.rarity.rank = parseInt(rankMatch[1].replace(/,/g, ''));
        console.log(`Found rank: ${data.rarity.rank}`);
        break;
      }
    }

    const pctPatterns = [
      /Top\s*([\d.]+)%/,
      /Rank Percentile:\s*Top\s*([\d.]+)%/,
      /([\d.]+)%\s*rarity/i
    ];

    for (const pattern of pctPatterns) {
      const pctMatch = response.match(pattern);
      if (pctMatch) {
        data.rarity.percentage = parseFloat(pctMatch[1]);
        console.log(`Found percentage: ${data.rarity.percentage}%`);
        break;
      }
    }

    // Extract image URL - try multiple patterns
    const imgPatterns = [
      /!\[.*?\]\((https?:\/\/[^\s\)]+)\)/,  // ![alt](url) format
      /\[View.*?\]\((https?:\/\/[^\s\)]+)\)/, // [View text](url) format
      /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|webp))/  // Direct URL pattern
    ];

    for (const pattern of imgPatterns) {
      const imgMatch = response.match(pattern);
      if (imgMatch) {
        data.image_url = imgMatch[1];
        console.log(`Found image: ${data.image_url}`);
        break;
      }
    }

    console.log('Final parsed data:', data);
    return data;
  }

  async createCharacterFromOpenSea(collectionName: string, tokenId: string): Promise<CharacterData> {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Creating: ${collectionName} #${tokenId}`);
    console.log('='.repeat(60));

    // Fetch NFT data using OpenAI agent
    const query = `Get detailed information for ${collectionName} token #${tokenId}. Include ALL traits, rarity rank, percentage, and image URL.`;

    console.log('🤖 Querying OpenSea MCP...');
    const result = await run(this.agent, query);

    // Parse the result
    const nftData = this.parseOpenSeaResponse(result.finalOutput || '', collectionName, tokenId);

    console.log('🎨 Extracted traits:', nftData.traits);

    // Clean traits
    const cleanTraits = this.cleanTraits(nftData.traits);

    // Generate AI character profile
    console.log('🧠 Generating AI character profile...');
    const profile = await this.generateCharacterProfile({
      collection: collectionName,
      token_id: tokenId,
      traits: cleanTraits,
      rarity_rank: nftData.rarity.rank
    });

    // Create character entry
    const character: CharacterData = {
      id: `${collectionName.toLowerCase().replace(/\s+/g, '_')}_${tokenId}`,
      character_name: profile.name,
      collection: collectionName,
      token_id: tokenId,
      traits: cleanTraits,
      rarity_rank: nftData.rarity.rank,
      rarity_percentage: nftData.rarity.percentage,
      image_url: nftData.image_url,
      description: profile.description,
      created_at: new Date().toISOString()
    };

    // Add to wiki
    this.addCharacter(character);

    return character;
  }

  addCharacter(character: CharacterData): void {
    // Remove if exists (update)
    this.wiki.characters = this.wiki.characters.filter(c => c.id !== character.id);

    // Add new character
    this.wiki.characters.push(character);

    // Update metadata
    this.wiki.metadata.total_characters = this.wiki.characters.length;
    this.wiki.metadata.last_updated = new Date().toISOString();

    // Save
    this.saveWiki();
  }

  getCharacter(characterId: string): CharacterData | null {
    const character = this.wiki.characters.find(c => c.id === characterId);
    return character || null;
  }

  getAllCharacters(): CharacterData[] {
    return this.wiki.characters;
  }

  exportVideoContext(characterId: string): string | null {
    const character = this.getCharacter(characterId);
    if (!character) {
      return null;
    }

    const traitsText = Object.entries(character.traits)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');

    const context = `# ${character.character_name} - Video Character Profile

## Collection
${character.collection} Tribe (Token #${character.token_id})

## Visual Reference
${character.image_url}

## Physical Traits
${traitsText}

## Character Description
${character.description}

## Rarity
Rank #${character.rarity_rank} (${character.rarity_percentage}% rarity)
`;
    return context;
  }
}

// Main test function
async function main(): Promise<void> {
  const wiki = new SimplifiedCharacterWiki();

  try {
    await wiki.connect();

    const testNFTs: [string, string][] = [
      ['Bored Ape Yacht Club', '1234'],
      ['Doodles', '999']
    ];

    for (const [collection, tokenId] of testNFTs) {
      try {
        const character = await wiki.createCharacterFromOpenSea(collection, tokenId);

        console.log(`\n✅ Created: ${character.character_name}`);
        console.log(`📊 Traits:`, character.traits);
        console.log(`🎭 Description: ${character.description.substring(0, 200)}...`);

        // Export video context
        const context = wiki.exportVideoContext(character.id);
        console.log('\n🎬 Video Context saved');

      } catch (error) {
        console.log(`❌ Error: ${error}`);
      }
    }

    console.log(`\n📁 Saved to: simple_character_wiki.json`);

  } finally {
    await wiki.disconnect();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}