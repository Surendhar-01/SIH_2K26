import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ComfortTargetDocument = ComfortTarget & Document;

@Schema({ timestamps: true })
export class ComfortTarget {
  @Prop({ required: true, type: Number })
  minIndoorTempC: number;

  @Prop({ required: true, type: Number })
  maxIndoorTempC: number;

  @Prop({ required: true, type: Number })
  comfortDurationHours: number;

  @Prop({ required: true, type: Number, default: 18 })
  sunsetHour: number;

  @Prop({ required: false, type: Number, default: 0 })
  maxExternalHeatingWh: number;

  @Prop({ required: false, type: Number })
  maxShelterLengthM?: number;

  @Prop({ required: false, type: Number })
  estimatedBudgetINR?: number;

  @Prop({ required: false, type: String })
  climateProfileId?: string;

  @Prop({ required: false, type: Number, default: -5 })
  avgOutdoorTempC: number;

  @Prop({ required: false, type: Number, default: 10 })
  tempAmplitudeC: number;

  @Prop({ required: false, type: Number, default: 800 })
  peakSolarIrradianceW: number;

  @Prop({ required: false, type: Number, default: 20 })
  candidateCount: number;

  @Prop({ required: false, type: Number, default: 3 })
  optimizationIterations: number;
}

export const ComfortTargetSchema = SchemaFactory.createForClass(ComfortTarget);
