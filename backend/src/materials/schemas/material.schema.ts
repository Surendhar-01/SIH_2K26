import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MaterialDocument = Material & Document;

@Schema({ timestamps: true })
export class Material {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, type: Number })
  thermalConductivity: number;

  @Prop({ required: true, type: Number })
  density: number;

  @Prop({ required: true, type: Number })
  specificHeat: number;

  @Prop({ required: false, type: Number })
  emissivity?: number;

  @Prop({ required: false, type: Number })
  solarAbsorptivity?: number;

  @Prop({ required: false, type: Number })
  defaultThickness?: number;

  @Prop({ required: false, type: Number })
  costPerUnit?: number;

  @Prop({ required: false })
  source?: string;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);
