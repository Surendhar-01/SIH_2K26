import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SheltersService } from './shelters.service';
import { SheltersController } from './shelters.controller';
import { Shelter, ShelterSchema } from './schemas/shelter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shelter.name, schema: ShelterSchema }]),
  ],
  controllers: [SheltersController],
  providers: [SheltersService],
  exports: [SheltersService],
})
export class SheltersModule {}
