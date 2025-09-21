export interface OcrJobData {
  image: string;
}

export interface OcrJobResult {
  status: string;
  text?: string | null;
  error?: string | null;
}
