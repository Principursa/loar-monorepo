import { Synapse, RPC_URLS} from "@filoz/synapse-sdk"
import { promises as fs } from "fs"
import {Readable} from "stream"
import type { PieceCID } from "@filoz/synapse-sdk"


export class SynapseService {
  private static instance: SynapseService | null = null
  private failedDownloads = new Set<string>() // Track failed PieceCIDs
  private consecutiveFailures = 0
  private lastFailureTime = 0
  
  private constructor(private synapse: Synapse) {}

  static async init() {
    const privateKey = process.env.PRIVATE_KEY?.startsWith('0x')
      ? process.env.PRIVATE_KEY
      : `0x${process.env.PRIVATE_KEY}`;

    const synapse = await Synapse.create({
      privateKey,
      rpcURL: RPC_URLS.calibration.http
    })
    return new SynapseService(synapse)
  }

  static async getInstance(): Promise<SynapseService> {
    if (!this.instance) {
      const privateKey = process.env.PRIVATE_KEY?.startsWith('0x')
        ? process.env.PRIVATE_KEY
        : `0x${process.env.PRIVATE_KEY}`;

      const synapse = await Synapse.create({
        privateKey,
        rpcURL: RPC_URLS.calibration.http,
      })
      this.instance = new SynapseService(synapse)
    }
    return this.instance
  }


  async upload(buffer: Buffer): Promise<any>
  async upload(path: string): Promise<any>
  //async upload(stream: Readable): Promise<any>

  async upload(input: Buffer | string): Promise<string>{ //return string instead of PieceCID object
    let buffer: Buffer

    if (typeof input === "string") {
      buffer = await fs.readFile(input)
    } else {
      buffer = input
    }

    const uploadResult = await this.synapse.storage.upload(
      new Uint8Array(buffer)
    )
    console.log(`Upload complete! PieceCID:`, uploadResult.pieceCid)
    console.log(`PieceCID type:`, typeof uploadResult.pieceCid)
    console.log(`PieceCID stringified:`, JSON.stringify(uploadResult.pieceCid))
    
    // Convert PieceCID to string - try different methods
    const pieceCidString = uploadResult.pieceCid.toString?.() || 
                          uploadResult.pieceCid.value || 
                          uploadResult.pieceCid.cid || 
                          String(uploadResult.pieceCid);
    
    console.log(`PieceCID as string:`, pieceCidString)
    return pieceCidString
  }
  async uploadFromUrl(input: string): Promise<string>{
    console.log(`Attempting to fetch URL: ${input}`)

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(input, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FilecoinUploader/1.0)'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      console.log(`Successfully fetched URL, content-type: ${response.headers.get('content-type')}, size: ${response.headers.get('content-length')}`)
      
      const buffer = Buffer.from(await response.arrayBuffer())
      console.log(`Buffer created, size: ${buffer.length} bytes`)
      
      return this.upload(buffer)
    } catch (error) {
      console.error(`Failed to fetch URL ${input}:`, error)
      throw new Error(`Unable to connect. Is the computer able to access the url?`)
    }
  }


  async download(pieceCid: string): Promise<Uint8Array> {
    try {
      console.log(`🔽 Starting Filecoin download for PieceCID: ${pieceCid}`);
      
      // Check circuit breaker - if too many recent failures, reject immediately
      const now = Date.now();
      if (this.consecutiveFailures >= 3 && (now - this.lastFailureTime) < 60000) {
        throw new Error(`Circuit breaker open: Too many consecutive failures (${this.consecutiveFailures}). Try again later.`);
      }
      
      // Check if this specific PieceCID has failed before
      if (this.failedDownloads.has(pieceCid)) {
        console.log(`⚠️ PieceCID ${pieceCid} has failed before, attempting anyway...`);
      }
      
      // Validate PieceCID format
      if (!pieceCid || typeof pieceCid !== 'string' || pieceCid.length < 10) {
        throw new Error(`Invalid PieceCID format: ${pieceCid}`);
      }
      
      // Log the specific PieceCID being processed
      console.log(`📋 Processing PieceCID: ${pieceCid}`);
      console.log(`📋 PieceCID length: ${pieceCid.length}`);
      console.log(`📋 PieceCID starts with: ${pieceCid.substring(0, 10)}`);
      
      // Add timeout wrapper around the synapse download
      const downloadTimeout = 120000; // 2 minutes for slow Filecoin retrievals
      let timeoutId: NodeJS.Timeout;
      
      const downloadPromise = new Promise<Uint8Array>((resolve, reject) => {
        // Set timeout
        timeoutId = setTimeout(() => {
          reject(new Error(`Download timeout after ${downloadTimeout/1000} seconds for PieceCID: ${pieceCid}`));
        }, downloadTimeout);
        
        // Attempt download
        this.synapse.storage.download(pieceCid)
          .then((data) => {
            clearTimeout(timeoutId);
            resolve(data);
          })
          .catch((error) => {
            clearTimeout(timeoutId);
            reject(error);
          });
      });
      
      console.log(`📡 Calling synapse.storage.download with timeout...`);
      const data = await downloadPromise;
      
      if (!data || !(data instanceof Uint8Array)) {
        throw new Error(`Invalid data received from Filecoin for PieceCID: ${pieceCid}`);
      }
      
      console.log(`✅ Download successful! Retrieved ${data.length} bytes for ${pieceCid}`);
      
      // Reset failure tracking on success
      this.consecutiveFailures = 0;
      this.failedDownloads.delete(pieceCid); // Remove from failed set if it succeeded
      
      // Validate file size
      if (data.length === 0) {
        throw new Error(`Empty file downloaded from Filecoin for PieceCID: ${pieceCid}`);
      }
      
      if (data.length > 200 * 1024 * 1024) { // 200MB limit
        throw new Error(`File too large: ${Math.round(data.length / 1024 / 1024)}MB for PieceCID: ${pieceCid}`);
      }
      
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Filecoin download failed for PieceCID ${pieceCid}:`, errorMessage);
      console.error(`❌ Error type: ${error?.constructor?.name}`);
      console.error(`❌ Full error:`, error);
      
      // Track failure for circuit breaker
      this.consecutiveFailures++;
      this.lastFailureTime = Date.now();
      this.failedDownloads.add(pieceCid);
      
      console.error(`📊 Failure tracking: ${this.consecutiveFailures} consecutive failures, ${this.failedDownloads.size} unique failed PieceCIDs`);
      
      // Throw a more descriptive error
      throw new Error(`Filecoin download failed for ${pieceCid}: ${errorMessage}`);
    }
  }

}
export const synapseService = SynapseService.init();
