import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ShelterDocument = Shelter & Document;

@Schema()
export class Layer {
  @Prop({ type: Types.ObjectId, ref: 'Material', required: true })
  materialId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  thickness: number; // meters
}
export const LayerSchema = SchemaFactory.createForClass(Layer);

@Schema()
export class WallAssembly {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [LayerSchema], default: [] })
  layers: Layer[];

  @Prop({ required: true, type: Number })
  totalRValue: number;

  @Prop({ required: true, type: Number })
  uValue: number;
}
export const WallAssemblySchema = SchemaFactory.createForClass(WallAssembly);

@Schema()
export class Opening {
  @Prop({ required: true, enum: ['Window', 'Door'] })
  type: string;

  @Prop({ required: true, type: Number })
  width: number;

  @Prop({ required: true, type: Number })
  height: number;

  @Prop({ required: true, type: Number })
  uValue: number;

  @Prop({ required: false, type: Number })
  shgc?: number;

  @Prop({ required: true })
  orientation: string;
}
export const OpeningSchema = SchemaFactory.createForClass(Opening);

@Schema({ timestamps: true })
export class Shelter {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number })
  length: number;

  @Prop({ required: true, type: Number })
  width: number;

  @Prop({ required: true, type: Number })
  height: number;

  @Prop({ required: true, type: Number })
  orientationAngle: number; // degrees

  @Prop({ type: [WallAssemblySchema], default: [] })
  wallAssemblies: WallAssembly[];

  @Prop({ type: [OpeningSchema], default: [] })
  openings: Opening[];

  @Prop({ required: false, type: Number })
  occupancyCount?: number;
}
export const ShelterSchema = SchemaFactory.createForClass(Shelter);
