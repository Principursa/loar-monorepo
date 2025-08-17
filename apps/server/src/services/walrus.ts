import { FormData } from 'formdata-node';

export interface WalrusUploadResult {
  blobId: string;
  url: string;
  size?: number;
}

export interface WalrusUploadResponse {
  newlyCreated?: {
    blobObject: {
      id: string;
      registeredEpoch: number;
      blobId: string;
      size: number;
      encodingType: string;
      certifiedEpoch: number;
      storage: {
        id: string;
        startEpoch: number;
        endEpoch: number;
        storageSize: number;
      };
    };
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

export class WalrusService {
  private publisherUrl: string;
  private aggregatorUrl: string;

  constructor() {
    this.publisherUrl = process.env.WALRUS_PUBLISHER || 'https://publisher.walrus-testnet.walrus.space';
    this.aggregatorUrl = process.env.WALRUS_AGGREGATOR || 'https://aggregator.walrus-testnet.walrus.space';
    
    console.log('🐙 Walrus Service initialized:');
    console.log(`📤 Publisher URL: ${this.publisherUrl}`);
    console.log(`📥 Aggregator URL: ${this.aggregatorUrl}`);
  }

  async uploadFile(fileBuffer: Buffer, filename?: string): Promise<WalrusUploadResult> {
    try {
      const uploadUrl = `${this.publisherUrl}/v1/blobs`;
      console.log(`🔗 Uploading to: ${uploadUrl}`);
      
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: new Uint8Array(fileBuffer),
      });

      console.log(`📊 Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`❌ Error response: ${errorText}`);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const result: WalrusUploadResponse = await response.json();
      console.log('📝 Raw Walrus response:', JSON.stringify(result, null, 2));
      
      let blobId: string;
      let size: number | undefined;

      if (result.newlyCreated) {
        blobId = result.newlyCreated.blobObject.blobId;
        size = result.newlyCreated.blobObject.size;
        console.log('🆕 Using newlyCreated blob ID:', blobId);
      } else if (result.alreadyCertified) {
        blobId = result.alreadyCertified.blobId;
        console.log('♻️ Using alreadyCertified blob ID:', blobId);
      } else {
        console.error('❌ Unexpected response format:', result);
        throw new Error('Unexpected response format from Walrus');
      }

      return {
        blobId,
        url: `${this.aggregatorUrl}/v1/blobs/${blobId}`,
        size,
      };
    } catch (error) {
      console.error('Walrus upload failed:', error);
      throw new Error(`Failed to upload to Walrus: ${error}`);
    }
  }

  async uploadFromUrl(fileUrl: string): Promise<WalrusUploadResult> {
    try {
      console.log(`🔗 Downloading and uploading: ${fileUrl}`);
      
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const fs = require('fs');
      const execAsync = promisify(exec);

      // Step 1: Download the file
      const urlPath = new URL(fileUrl).pathname;
      const extension = urlPath.split('.').pop() || 'tmp';
      const tempFileName = `./temp_${Date.now()}.${extension}`;
      console.log(`📥 Downloading to: ${tempFileName}`);
      
      await execAsync(`curl -s -o "${tempFileName}" "${fileUrl}"`);
      
      // Step 2: Upload to Walrus
      console.log(`📤 Uploading to Walrus...`);
      const curlCommand = `curl -s -X PUT "${this.publisherUrl}/v1/blobs" --upload-file "${tempFileName}"`;
      
      const { stdout, stderr } = await execAsync(curlCommand);
      
      console.log(`💾 Temp file kept for inspection: ${tempFileName}`);
      
      if (stderr) {
        console.error('❌ Curl error:', stderr);
        throw new Error(`Curl failed: ${stderr}`);
      }

      const result: WalrusUploadResponse = JSON.parse(stdout);
      console.log('📝 Raw Walrus response:', JSON.stringify(result, null, 2));
      
      let blobId: string;
      let size: number | undefined;

      if (result.newlyCreated) {
        blobId = result.newlyCreated.blobObject.blobId;
        size = result.newlyCreated.blobObject.size;
        console.log('🆕 Using newlyCreated blob ID:', blobId);
      } else if (result.alreadyCertified) {
        blobId = result.alreadyCertified.blobId;
        console.log('♻️ Using alreadyCertified blob ID:', blobId);
      } else {
        console.error('❌ Unexpected response format:', result);
        throw new Error('Unexpected response format from Walrus');
      }

      return {
        blobId,
        url: `${this.aggregatorUrl}/v1/blobs/${blobId}`,
        size,
      };
    } catch (error) {
      console.error('Walrus upload from URL failed:', error);
      throw new Error(`Failed to upload from URL to Walrus: ${error}`);
    }
  }

  async uploadLocalFile(filePath: string): Promise<WalrusUploadResult> {
    try {
      console.log(`📤 Uploading local file: ${filePath}`);
      
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);

      // Upload local file directly
      const curlCommand = `curl -s -X PUT "${this.publisherUrl}/v1/blobs" --upload-file "${filePath}"`;
      
      const { stdout, stderr } = await execAsync(curlCommand);
      
      if (stderr) {
        console.error('❌ Curl error:', stderr);
        throw new Error(`Curl failed: ${stderr}`);
      }

      const result: WalrusUploadResponse = JSON.parse(stdout);
      console.log('📝 Raw Walrus response:', JSON.stringify(result, null, 2));
      
      let blobId: string;
      let size: number | undefined;

      if (result.newlyCreated) {
        blobId = result.newlyCreated.blobObject.blobId;
        size = result.newlyCreated.blobObject.size;
        console.log('🆕 Using newlyCreated blob ID:', blobId);
      } else if (result.alreadyCertified) {
        blobId = result.alreadyCertified.blobId;
        console.log('♻️ Using alreadyCertified blob ID:', blobId);
      } else {
        console.error('❌ Unexpected response format:', result);
        throw new Error('Unexpected response format from Walrus');
      }

      return {
        blobId,
        url: `${this.aggregatorUrl}/v1/blobs/${blobId}`,
        size,
      };
    } catch (error) {
      console.error('Walrus upload from local file failed:', error);
      throw new Error(`Failed to upload local file to Walrus: ${error}`);
    }
  }

  getFileUrl(blobId: string): string {
    return `${this.aggregatorUrl}/v1/blobs/${blobId}`;
  }

  async checkBlobExists(blobId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.aggregatorUrl}/v1/blobs/${blobId}`, {
        method: 'HEAD',
      });
      return response.ok;
    } catch (error) {
      console.error('Error checking blob existence:', error);
      return false;
    }
  }

  async getBlobInfo(blobId: string): Promise<{ exists: boolean; size?: number; contentType?: string }> {
    try {
      const response = await fetch(`${this.aggregatorUrl}/v1/blobs/${blobId}`, {
        method: 'HEAD',
      });
      
      if (!response.ok) {
        return { exists: false };
      }

      const size = response.headers.get('content-length');
      const contentType = response.headers.get('content-type');

      return {
        exists: true,
        size: size ? parseInt(size) : undefined,
        contentType: contentType || undefined,
      };
    } catch (error) {
      console.error('Error getting blob info:', error);
      return { exists: false };
    }
  }
}

// Create a new instance for each request to ensure environment variables are loaded
export const walrusService = new WalrusService();