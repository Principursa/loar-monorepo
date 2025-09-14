import { Synapse, RPC_URLS} from "@filoz/synapse-sdk"
import { promises as fs } from "fs"
import {Readable} from "stream"
import type { PieceCID } from "@filoz/synapse-sdk"


export class SynapseService {
  private constructor(private synapse: Synapse) {}

  static async init() {
    const synapse = await Synapse.create({
      privateKey: `0x${process.env.PRIVATE_KEY}`,
      rpcURL: RPC_URLS.calibration.http
    })
    return new SynapseService(synapse)
  }

  async upload(buffer: Buffer): Promise<any>
  async upload(path: string): Promise<any>
  //async upload(stream: Readable): Promise<any>

  async upload(input: Buffer | string): Promise<PieceCID>{ //figure out if it's better to turn this into a string
    let buffer: Buffer

    if (typeof input === "string") {
      buffer = await fs.readFile(input)
    } else {
      buffer = input
    }

    const uploadResult = await this.synapse.storage.upload(
      new Uint8Array(buffer)
    )
    console.log(`Upload complete! PieceCID: ${uploadResult.pieceCid}`)
    return uploadResult.pieceCid
  }


  async download(pieceCid: PieceCID): Promise<any> {
    const data = await this.synapse.storage.download(pieceCid)
    console.log("Retrieved:", new TextDecoder().decode(data))
    return data
  }

}
//export const snyapseService = new SynapseService();
