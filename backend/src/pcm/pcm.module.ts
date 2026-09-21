import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PcmService } from './pcm.service';
import { PcmController } from './pcm.controller';
import { Pcm, PcmSchema } from './schemas/pcm.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Pcm.name, schema: PcmSchema }])],
  controllers: [PcmController],
  providers: [PcmService],
  exports: [PcmService],
})
export class PcmModule {}
