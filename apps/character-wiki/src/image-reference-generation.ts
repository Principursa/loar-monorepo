import { LumaAI } from "lumaai";
import fs from "fs";

const client = new LumaAI({
  authToken: process.env.LUMAAI_API_KEY,
});

async function generateImageWithReferences() {
  // Character URLs with proxy - Bored Ape and Moonbird
  const character1ImageUrl = "https://images.weserv.nl/?url=https://i2.seadn.io/base/0x7e72abdf47bd21bf0ed6ea8cb8dad60579f3fb50/34234bf162d45933d645055a11c1b6/a834234bf162d45933d645055a11c1b6.png"; // Captain Somnus Blue (Bored Ape)
  const character2ImageUrl = "https://images.weserv.nl/?url=https://i2.seadn.io/ethereum/0x23581767a106ae21c074b2276d25e5c3e136a68b/0e26ff71e6c20d3b67f9eaa3283fbb/fa0e26ff71e6c20d3b67f9eaa3283fbb.png"; // Sunny Halo (Moonbird)

  console.log("🎨 Generating image with 50/50 character references...");

  const generation = await client.generations.image.create({
    prompt: "A detailed office scene with a large wooden desk in the center. On one side of the desk stands a blue-furred ape character wearing a brown fisherman's hat, dark leather jacket, and has sleepy eyes with a bubblegum bubble. On the opposite side of the desk stands a brown feathered bird character with tabby patterns, wearing dark sunglasses and a golden halo above its head, with a small beak. Both characters maintain their exact original appearance from the reference images. The setting is a professional office environment with warm lighting, bookshelves in the background, and papers scattered on the desk surface. The ape and bird are facing each other across the desk in a business meeting setup.",
    model: "photon-1",
    image_ref: [
      {
        url: character1ImageUrl,
        weight: 0.9
      },
      {
        url: character2ImageUrl,
        weight: 0.9
      }
    ]
  });

  console.log(`⏳ Image generation started. ID: ${generation.id}`);

  // Wait for generation to complete
  let currentGeneration = generation;
  while (currentGeneration.state === "queued" || currentGeneration.state === "dreaming") {
    await new Promise(resolve => setTimeout(resolve, 5000));
    currentGeneration = await client.generations.get(generation.id);
    console.log(`📊 Image generation status: ${currentGeneration.state}`);
  }

  if (currentGeneration.state === "completed" && currentGeneration.assets?.image) {
    console.log("✅ Image generation completed successfully!");
    const imageUrl = currentGeneration.assets.image;
    console.log(`🖼️  View the generated image at: ${imageUrl}`);

    // Save results to file
    const results = {
      method: "image-reference-50-50",
      timestamp: new Date().toISOString(),
      image_generation: {
        id: currentGeneration.id,
        url: imageUrl,
        prompt: "A detailed office scene with a large wooden desk in the center. On one side of the desk stands a blue-furred ape character wearing a brown fisherman's hat, dark leather jacket, and has sleepy eyes with a bubblegum bubble. On the opposite side of the desk stands a brown feathered bird character with tabby patterns, wearing dark sunglasses and a golden halo above its head, with a small beak. Both characters maintain their exact original appearance from the reference images. The setting is a professional office environment with warm lighting, bookshelves in the background, and papers scattered on the desk surface. The ape and bird are facing each other across the desk in a business meeting setup.",
        state: currentGeneration.state,
        image_references: [
          { url: character1ImageUrl, weight: 0.5 },
          { url: character2ImageUrl, weight: 0.5 }
        ]
      }
    };

    fs.writeFileSync("image-reference-results.json", JSON.stringify(results, null, 2));
    console.log("💾 Results saved to image-reference-results.json");

  } else {
    console.error("❌ Image generation failed:", currentGeneration.failure_reason);
    console.error("Full response:", JSON.stringify(currentGeneration, null, 2));
  }
}

// Run the image generation
generateImageWithReferences().catch(console.error);