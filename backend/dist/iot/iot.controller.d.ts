import { IoTService } from './iot.service';
import { SensorReading } from './schemas/iot.schema';
export declare class IoTController {
    private readonly iotService;
    constructor(iotService: IoTService);
    logReading(body: Partial<SensorReading>): Promise<import("./schemas/iot.schema").SensorReadingDocument>;
    getReadings(deviceId: string, limit: number): Promise<import("./schemas/iot.schema").SensorReadingDocument[]>;
}
