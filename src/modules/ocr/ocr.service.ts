import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Job } from 'bullmq';
import { OcrJobData, OcrJobResult } from './ocr.type';
import Redis from 'ioredis/built/Redis';

@Injectable()
export class OcrService {
  constructor(
    @InjectQueue('ocr') private readonly ocrQueue: Queue,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  async enqueueJob(
    imageBuffer: Buffer,
  ): Promise<Job<OcrJobData, OcrJobResult>> {
    const job = await this.ocrQueue.add('scan', {
      image: imageBuffer.toString('base64'),
    });

    await this.redisClient.set(
      `ocr:status:${job.id}`,
      JSON.stringify({ status: 'pending' }),
      'EX',
      3600,
    );
    return job;
  }

  async saveResult(jobId?: string, text?: string) {
    if (jobId && text) {
      await this.redisClient.set(
        `ocr:status:${jobId}`,
        JSON.stringify({ text }),
        'EX',
        3600,
      );
    }
  }

  async getResult(jobId: string): Promise<OcrJobResult | null> {
    const result = await this.redisClient.get(`ocr:status:${jobId}`);
    return result ? (JSON.parse(result) as OcrJobResult) : null;
  }
}
