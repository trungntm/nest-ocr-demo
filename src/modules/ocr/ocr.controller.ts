import * as ocrType from './ocr.type';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from './ocr.service';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('scan')
  @UseInterceptors(FileInterceptor('file'))
  async enqueueScan(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    const job = await this.ocrService.enqueueJob(file.buffer);
    return { jobId: job.id };
  }

  @Get('result/:id')
  async getResult(
    @Param('id') id: string,
  ): Promise<ocrType.OcrJobResult | null> {
    return await this.ocrService.getResult(id);
  }
}
