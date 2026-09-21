import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SensorReadingDocument = SensorReading & Document;

@Schema({ timestamps: true })
export class SensorReading {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: false, type: Number })
  indoorTemp?: number;

  @Prop({ required: false, type: Number })
  outdoorTemp?: number;

  @Prop({ required: false, type: Number })
  humidity?: number;

  @Prop({ required: false, type: Number })
  solarIrradiance?: number;

  @Prop({ required: false, type: Number })
  windSpeed?: number;
}
export const SensorReadingSchema = SchemaFactory.createForClass(SensorReading);
