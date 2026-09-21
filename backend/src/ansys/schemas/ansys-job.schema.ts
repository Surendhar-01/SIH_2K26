import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AnsysJobDocument = AnsysJob & Document;

@Schema({ timestamps: true })
export class AnsysJob {
  @Prop({
    required: true,
    enum: ['QUEUED', 'PREPARING', 'RUNNING', 'COMPLETED', 'FAILED'],
    default: 'QUEUED',
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Shelter', required: true })
  shelterId: Types.ObjectId;

  @Prop({ required: false })
  exportFilePath?: string;

  @Prop({ type: Object, required: false })
  results?: any; // Validation metrics
}
export const AnsysJobSchema = SchemaFactory.createForClass(AnsysJob);
