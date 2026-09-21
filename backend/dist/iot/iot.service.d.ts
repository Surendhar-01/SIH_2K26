import { Model } from 'mongoose';
import { SensorReading, SensorReadingDocument } from './schemas/iot.schema';
export declare class IoTService {
    private sensorModel;
    constructor(sensorModel: Model<SensorReadingDocument>);
    logReading(readingDto: Partial<SensorReading>): Promise<SensorReadingDocument>;
    getReadingsByDevice(deviceId: string, limit?: number): Promise<SensorReadingDocument[]>;
}
