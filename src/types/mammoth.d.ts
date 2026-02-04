declare module "mammoth" {
  interface ExtractRawTextResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
    }>;
  }

  interface ConvertOptions {
    buffer?: Buffer;
    path?: string;
    arrayBuffer?: ArrayBuffer;
  }

  export function extractRawText(options: ConvertOptions): Promise<ExtractRawTextResult>;
  export function convertToHtml(options: ConvertOptions): Promise<{ value: string; messages: unknown[] }>;
}
