declare module '@squoosh/lib' {
  export class ImagePool {
    constructor(concurrency?: number);
    ingestImage(input: ArrayBuffer | Uint8Array | Buffer): any;
    close(): Promise<void>;
  }
}

