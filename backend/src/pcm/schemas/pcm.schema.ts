import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PcmDocument = Pcm & Document;

@Schema({ timestamps: true })
export class Pcm {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number })
  phaseChangeTemperature: number; // °C

  @Prop({ required: true, type: Number })
  meltingRange: number; // Delta °C

  @Prop({ required: true, type: Number })
  latentHeat: number; // J/kg

  @Prop({ required: true, type: Number })
  density: number; // kg/m³

  @Prop({ required: true, type: Number })
  specificHeatSolid: number; // J/(kg*K)

  @Prop({ required: true, type: Number })
  specificHeatLiquid: number; // J/(kg*K)

  @Prop({ required: true, type: Number })
  thermalConductivity: number; // W/(m*K)

  @Prop({ required: false, type: Number })
  cost?: number;

  @Prop({ required: false })
  source?: string;
}

export const PcmSchema = SchemaFactory.createForClass(Pcm);
