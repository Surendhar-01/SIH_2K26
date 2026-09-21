import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IoTService } from './iot.service';
import { IoTController } from './iot.controller';
import { SensorReading, SensorReadingSchema } from './schemas/iot.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SensorReading.name, schema: SensorReadingSchema },
    ]),
  ],
  controllers: [IoTController],
  providers: [IoTService],
})
export class IoTModule {}
