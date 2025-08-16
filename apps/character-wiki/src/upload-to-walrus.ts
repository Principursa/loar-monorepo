import * as fs from 'fs/promises';

interface WalrusStoreResponse {
  newlyCreated?: {
    blobObject: {
      id: string;
      registeredEpoch: number;
      blobId: string;
      size: number;
      encodingType: string;
      certifiedEpoch: number | null;
      storage: {
        id: string;
        startEpoch: number;
        endEpoch: number;
        storageSize: number;
      };
      deletable: boolean;
    };
    resourceOperation: any;
    cost: number;
  };
  alreadyCertified?: {
    blobId: string;
    event: {
      txDigest: string;
      eventSeq: string;
    };
    endEpoch: number;
  };
}

export class WalrusUploader {
  private aggregatorUrl: string;
  private publisherUrl: string;

  constructor(
    aggregatorUrl: string = 'https://aggregator.walrus-testnet.walrus.space',
    publisherUrl: string = 'https://publisher.walrus-testnet.walrus.space'
  ) {
    this.aggregatorUrl = aggregatorUrl;
    this.publisherUrl = publisherUrl;
  }

  /**
   * Upload an image to Walrus
   * @param imagePath - Path to the image file
   * @param epochs - Number of storage epochs (default: 5)
   * @param deletable - Whether the blob should be deletable (default: false)
   * @returns The blob ID and store response
   */
  async uploadImage(
    imagePath: string,
    epochs: number = 5,
    deletable: boolean = false
  ): Promise<{ blobId: string; response: WalrusStoreResponse }> {
    try {
      // Read the image file
      const imageBuffer = await fs.readFile(imagePath);
      
      // Construct the URL with query parameters
      const params = new URLSearchParams();
      params.append('epochs', epochs.toString());
      if (deletable) {
        params.append('deletable', 'true');
      }

      const url = `${this.publisherUrl}/v1/blobs?${params.toString()}`;

      // Upload the image
      const response = await fetch(url, {
        method: 'PUT',
        body: imageBuffer,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to upload: ${response.status} ${response.statusText}`);
      }

      const result: WalrusStoreResponse = await response.json();

      // Extract blob ID from the response
      let blobId: string;
      if (result.newlyCreated) {
        blobId = result.newlyCreated.blobObject.blobId;
        console.log('✅ Image uploaded successfully!');
        console.log(`📦 Blob ID: ${blobId}`);
        console.log(`💾 Size: ${result.newlyCreated.blobObject.size} bytes`);
        console.log(`📅 Storage: Epoch ${result.newlyCreated.blobObject.storage.startEpoch} to ${result.newlyCreated.blobObject.storage.endEpoch}`);
      } else if (result.alreadyCertified) {
        blobId = result.alreadyCertified.blobId;
        console.log('ℹ️  Image already exists on Walrus');
        console.log(`📦 Blob ID: ${blobId}`);
        console.log(`📅 Valid until epoch: ${result.alreadyCertified.endEpoch}`);
      } else {
        throw new Error('Unexpected response format');
      }

      return { blobId, response: result };
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Read an image from Walrus
   * @param blobId - The blob ID to retrieve
   * @param outputPath - Path to save the retrieved image (optional)
   * @returns The image data as a Buffer
   */
  async readImage(blobId: string, outputPath?: string): Promise<Buffer> {
    try {
      const url = `${this.aggregatorUrl}/v1/blobs/${blobId}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to read: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (outputPath) {
        await fs.writeFile(outputPath, buffer);
        console.log(`✅ Image saved to: ${outputPath}`);
      }

      return buffer;
    } catch (error) {
      console.error('❌ Error reading image:', error);
      throw error;
    }
  }

  /**
   * Get the public URL for a blob
   * @param blobId - The blob ID
   * @returns The public URL to access the blob
   */
  getPublicUrl(blobId: string): string {
    return `${this.aggregatorUrl}/v1/blobs/${blobId}`;
  }
}

// Example usage
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  Upload: bun run upload-to-walrus.ts upload <image-path> [epochs] [--deletable]');
    console.log('  Read:   bun run upload-to-walrus.ts read <blob-id> [output-path]');
    console.log('  URL:    bun run upload-to-walrus.ts url <blob-id>');
    console.log('\nExamples:');
    console.log('  bun run upload-to-walrus.ts upload ./myimage.png 10');
    console.log('  bun run upload-to-walrus.ts read M4hsZGQ1oCktdzegB6HnI6Mi28S2nqOPHxK-W7_4BUk ./downloaded.png');
    console.log('  bun run upload-to-walrus.ts url M4hsZGQ1oCktdzegB6HnI6Mi28S2nqOPHxK-W7_4BUk');
    process.exit(1);
  }

  const command = args[0];
  const uploader = new WalrusUploader();

  switch (command) {
    case 'upload': {
      const imagePath = args[1];
      if (!imagePath) {
        console.error('❌ Please provide an image path');
        process.exit(1);
      }

      const epochs = args[2] ? parseInt(args[2]) : 5;
      const deletable = args.includes('--deletable');

      console.log(`📤 Uploading image: ${imagePath}`);
      console.log(`⏱️  Storage epochs: ${epochs}`);
      console.log(`🗑️  Deletable: ${deletable}`);

      const { blobId } = await uploader.uploadImage(imagePath, epochs, deletable);
      console.log(`\n🌐 Public URL: ${uploader.getPublicUrl(blobId)}`);
      break;
    }

    case 'read': {
      const blobId = args[1];
      if (!blobId) {
        console.error('❌ Please provide a blob ID');
        process.exit(1);
      }

      const outputPath = args[2];
      console.log(`📥 Reading blob: ${blobId}`);
      
      await uploader.readImage(blobId, outputPath);
      
      if (!outputPath) {
        console.log('ℹ️  Image data loaded into memory (no output path specified)');
      }
      break;
    }

    case 'url': {
      const blobId = args[1];
      if (!blobId) {
        console.error('❌ Please provide a blob ID');
        process.exit(1);
      }

      console.log(`🌐 Public URL: ${uploader.getPublicUrl(blobId)}`);
      break;
    }

    default:
      console.error(`❌ Unknown command: ${command}`);
      process.exit(1);
  }
}

// Run the CLI if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

// Export for use in other modules
export { WalrusStoreResponse };