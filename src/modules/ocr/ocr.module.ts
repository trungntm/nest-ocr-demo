import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OcrController } from './ocr.controller';
import { OcrService } from './ocr.service';
import { OcrProcessor } from './ocr.processor';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [
    RedisModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
          tls: {},
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({ name: 'ocr' }),
  ],
  controllers: [OcrController],
  providers: [OcrService, OcrProcessor],
})
export class OcrModule {}
