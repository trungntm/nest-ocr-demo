import { WorkerHost, Processor } from '@nestjs/bullmq';
import { OcrService } from './ocr.service';
import Tesseract from 'tesseract.js';
import { OcrJobData, OcrJobResult } from './ocr.type';
import { Job } from 'bullmq';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis/built/Redis';

@Processor('ocr')
export class OcrProcessor extends WorkerHost {
  constructor(
    private readonly ocrService: OcrService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {
    super();
  }

  async process(job: Job<OcrJobData, OcrJobResult>): Promise<OcrJobResult> {
    const key = `ocr:status:${job.id}`;

    // Mark as processing
    await this.redis.set(
      key,
      JSON.stringify({ status: 'processing' }),
      'EX',
      3600,
    );

    try {
      const buffer = Buffer.from(job.data.image, 'base64');
      const {
        data: { text },
      } = await Tesseract.recognize(buffer, 'vie+eng');

      const trimedText = text.trim();

      const result: OcrJobResult = { status: 'done', text: trimedText };

      await this.ocrService.saveResult(job.id, trimedText);
      await this.redis.set(key, JSON.stringify(result), 'EX', 3600);

      return result;
    } catch (error) {
      let errorMsg = 'Unknown error';
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      const failedResult: OcrJobResult = {
        status: 'error',
        error: errorMsg,
      };
      await this.redis.set(key, JSON.stringify(failedResult), 'EX', 3600);
      return failedResult;
    }
  }
}
