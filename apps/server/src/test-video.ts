import { videoService } from './services/video';

async function testVideoGeneration() {
  console.log('🎬 Testing Luma AI Video Generation...\n');

  if (!process.env.LUMAAI_API_KEY) {
    console.error('❌ Error: LUMAAI_API_KEY environment variable is not set');
    console.log('💡 Add your API key to /apps/server/.env file');
    console.log('💡 Get your API key from: https://lumalabs.ai/dream-machine/api/keys');
    process.exit(1);
  }

  try {
    // Test 1: Quick generation with ray-flash-2
    console.log('🚀 Starting video generation with ray-flash-2...');
    const result = await videoService.generateVideo({
      prompt: "A majestic digital character from an NFT collection walking through a futuristic cyberpunk city",
      model: "ray-flash-2",
      resolution: "720p",
      duration: "5s"
    });

    console.log(`📝 Generation started with ID: ${result.id}`);
    console.log(`📊 Initial status: ${result.status}\n`);

    // Test 2: Poll for status updates
    console.log('⏳ Polling for completion...');
    let attempts = 0;
    const maxAttempts = 20; // 1 minute total

    while (attempts < maxAttempts) {
      const status = await videoService.getGenerationStatus(result.id);
      console.log(`📊 Status check ${attempts + 1}: ${status.status}`);

      if (status.status === 'completed') {
        console.log('✅ Video generation completed!');
        console.log(`🎥 Video URL: ${status.videoUrl}`);
        console.log('\n🎉 Test completed successfully!');
        return;
      } else if (status.status === 'failed') {
        console.error(`❌ Generation failed: ${status.failureReason}`);
        return;
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log('⏰ Test timed out - generation is still in progress');
    console.log('💡 You can check the status later using the generation ID:', result.id);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Test with different models
async function testAllModels() {
  const models = ['ray-flash-2', 'ray-2', 'ray-1-6'] as const;
  const prompt = "A cute animated character dancing";

  for (const model of models) {
    console.log(`\n🧪 Testing model: ${model}`);
    try {
      const result = await videoService.generateVideo({
        prompt,
        model,
        resolution: "720p",
        duration: "5s"
      });
      console.log(`✅ ${model}: Started successfully (ID: ${result.id})`);
    } catch (error) {
      console.error(`❌ ${model}: Failed -`, error);
    }
  }
}

// Run the test
const mode = process.argv[2] || 'single';

if (mode === 'all') {
  testAllModels().catch(console.error);
} else {
  testVideoGeneration().catch(console.error);
}