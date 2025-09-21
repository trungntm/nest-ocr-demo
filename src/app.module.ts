import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OcrModule } from './modules/ocr/ocr.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OcrModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
