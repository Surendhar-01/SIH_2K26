import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SensorReading, SensorReadingDocument } from './schemas/iot.schema';

@Injectable()
export class IoTService {
  constructor(
    @InjectModel(SensorReading.name)
    private sensorModel: Model<SensorReadingDocument>,
  ) {}

  async logReading(
    readingDto: Partial<SensorReading>,
  ): Promise<SensorReadingDocument> {
    return new this.sensorModel(readingDto).save();
  }

  async getReadingsByDevice(
    deviceId: string,
    limit: number = 100,
  ): Promise<SensorReadingDocument[]> {
    return this.sensorModel
      .find({ deviceId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
