import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand, CreateBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3";
import { promises as fs } from "fs";
import { Readable } from "stream";

export class MinIOService {
  private static instance: MinIOService | null = null;
  private client: S3Client;
  private bucketName: string;
  private bucketInitialized: boolean = false;

  private constructor() {
    // Initialize MinIO client with AWS SDK
    this.client = new S3Client({
      endpoint: process.env.MINIO_ENDPOINT || "http://localhost:9000",
      region: process.env.MINIO_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || "minioadmin",
        secretAccessKey: process.env.MINIO_SECRET_KEY || "minioadmin",
      },
      forcePathStyle: true, // Required for MinIO
    });

    this.bucketName = process.env.MINIO_BUCKET_NAME || "loar-videos";
  }

  static getInstance(): MinIOService {
    if (!this.instance) {
      this.instance = new MinIOService();
    }
    return this.instance;
  }

  /**
   * Ensure bucket exists and is publicly accessible
   */
  private async ensureBucket(): Promise<void> {
    if (this.bucketInitialized) return;

    try {
      // Try to create bucket (will fail if already exists, which is fine)
      try {
        await this.client.send(new CreateBucketCommand({
          Bucket: this.bucketName
        }));
        console.log(`✅ Created bucket: ${this.bucketName}`);
      } catch (error: any) {
        if (error.name === 'BucketAlreadyOwnedByYou' || error.Code === 'BucketAlreadyOwnedByYou') {
          console.log(`✅ Bucket already exists: ${this.bucketName}`);
        } else {
          throw error;
        }
      }

      // Set bucket policy to allow public read access
      const publicReadPolicy = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`]
          }
        ]
      };

      await this.client.send(new PutBucketPolicyCommand({
        Bucket: this.bucketName,
        Policy: JSON.stringify(publicReadPolicy)
      }));

      console.log(`✅ Set public read policy for bucket: ${this.bucketName}`);
      this.bucketInitialized = true;
    } catch (error) {
      console.error(`❌ Failed to ensure bucket setup:`, error);
      // Don't throw - let uploads proceed and fail if needed
    }
  }

  /**
   * Upload a file to MinIO from a buffer or file path
   */
  async upload(buffer: Buffer, filename: string): Promise<string>;
  async upload(path: string): Promise<string>;

  async upload(input: Buffer | string, filename?: string): Promise<string> {
    // Ensure bucket is set up before upload
    await this.ensureBucket();

    let buffer: Buffer;
    let key: string;

    if (typeof input === "string") {
      // If input is a file path, read it and use the filename from path
      buffer = await fs.readFile(input);
      key = filename || input.split("/").pop() || `file-${Date.now()}`;
    } else {
      // If input is a buffer, use the provided filename
      buffer = input;
      key = filename || `file-${Date.now()}`;
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: this.getContentType(key),
      });

      await this.client.send(command);

      console.log(`✅ Upload complete! Key: ${key}`);

      // Return the object key (can be used to construct URLs)
      return key;
    } catch (error) {
      console.error(`❌ MinIO upload failed:`, error);
      throw new Error(`MinIO upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload a file from a URL
   */
  async uploadFromUrl(url: string, filename?: string): Promise<string> {
    console.log(`Attempting to fetch URL: ${url}`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; MinIOUploader/1.0)",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log(
        `Successfully fetched URL, content-type: ${response.headers.get(
          "content-type"
        )}, size: ${response.headers.get("content-length")}`
      );

      const buffer = Buffer.from(await response.arrayBuffer());
      console.log(`Buffer created, size: ${buffer.length} bytes`);

      // Determine filename from URL if not provided
      const urlFilename = filename || url.split("/").pop()?.split("?")[0] || `video-${Date.now()}.mp4`;

      return await this.upload(buffer, urlFilename);
    } catch (error) {
      console.error(`Failed to fetch URL ${url}:`, error);
      throw new Error(`Unable to fetch and upload from URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Download a file from MinIO
   */
  async download(key: string): Promise<Uint8Array> {
    try {
      console.log(`🔽 Starting MinIO download for Key: ${key}`);

      // Validate key format
      if (!key || typeof key !== "string" || key.length < 1) {
        throw new Error(`Invalid key format: ${key}`);
      }

      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.client.send(command);

      if (!response.Body) {
        throw new Error(`No data received from MinIO for key: ${key}`);
      }

      // Convert stream to buffer
      const chunks: Uint8Array[] = [];
      const stream = response.Body as Readable;

      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);
      const data = new Uint8Array(buffer);

      console.log(`✅ Download successful! Retrieved ${data.length} bytes for ${key}`);

      // Validate file size
      if (data.length === 0) {
        throw new Error(`Empty file downloaded from MinIO for key: ${key}`);
      }

      if (data.length > 200 * 1024 * 1024) {
        // 200MB limit
        throw new Error(
          `File too large: ${Math.round(data.length / 1024 / 1024)}MB for key: ${key}`
        );
      }

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error(`❌ MinIO download failed for key ${key}:`, errorMessage);
      console.error(`❌ Full error:`, error);

      throw new Error(`MinIO download failed for ${key}: ${errorMessage}`);
    }
  }

  /**
   * Get the public URL for an object
   */
  getPublicUrl(key: string): string {
    const endpoint = process.env.MINIO_ENDPOINT || "http://localhost:9000";
    return `${endpoint}/${this.bucketName}/${key}`;
  }

  /**
   * Check if an object exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get content type based on file extension
   */
  private getContentType(filename: string): string {
    const ext = filename.split(".").pop()?.toLowerCase();

    const mimeTypes: Record<string, string> = {
      mp4: "video/mp4",
      webm: "video/webm",
      mov: "video/quicktime",
      avi: "video/x-msvideo",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      json: "application/json",
      txt: "text/plain",
    };

    return mimeTypes[ext || ""] || "application/octet-stream";
  }
}

export const minioService = MinIOService.getInstance();
