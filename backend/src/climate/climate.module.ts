import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClimateService } from './climate.service';
import { ClimateController } from './climate.controller';
import { Climate, ClimateSchema } from './schemas/climate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Climate.name, schema: ClimateSchema }]),
  ],
  controllers: [ClimateController],
  providers: [ClimateService],
  exports: [ClimateService],
})
export class ClimateModule {}
