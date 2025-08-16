import { Agent, run, MCPServerStreamableHttp } from '@openai/agents';
import { config } from 'dotenv';

config();

async function main() {
  console.log('🚀 Testing OpenSea MCP with OpenAI SDK...');

  // Create MCP server connection
  const mcpServer = new MCPServerStreamableHttp({
    url: 'https://mcp.opensea.io/hCaTcrq7iFjnZO4ho0vhGtCMs2GiC7qP7xVFYvwX0I/mcp',
    name: 'OpenSea MCP Server',
  });

  // Create agent
  const agent = new Agent({
    name: 'OpenSea Assistant',
    instructions: 'Use the OpenSea tools to respond to user requests about NFTs.',
    mcpServers: [mcpServer],
  });

  try {
    // Connect to the MCP server
    console.log('🔌 Connecting to OpenSea MCP server...');
    await mcpServer.connect();
    console.log('✅ Connected successfully');

    // Run the query
    console.log('🤖 Getting details for Bored Ape Yacht Club token 1234...');
    const result = await run(agent, 'Get details for Bored Ape Yacht Club token 1234');
    
    console.log('\n📦 Result:');
    console.log(result.finalOutput);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Clean up connection
    await mcpServer.close();
    console.log('👋 Disconnected from MCP server');
  }
}

main().catch(console.error);