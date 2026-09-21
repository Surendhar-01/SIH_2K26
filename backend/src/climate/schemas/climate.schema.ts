import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClimateDocument = Climate & Document;

@Schema({ timestamps: true })
export class Climate {
  @Prop({ required: true })
  locationName: string;

  @Prop({ required: true, type: Number })
  latitude: number;

  @Prop({ required: true, type: Number })
  longitude: number;

  @Prop({ required: true, type: Number })
  altitude: number; // meters

  @Prop({ required: true, type: Number })
  solarIrradiance: number; // W/m2 avg/peak baseline

  @Prop({ required: true, type: Number })
  averageTemp: number; // °C

  @Prop({ required: true, type: Number })
  minTemp: number; // °C

  @Prop({ required: true, type: Number })
  maxTemp: number; // °C
}

export const ClimateSchema = SchemaFactory.createForClass(Climate);
