import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ThermalGenomeDocument = ThermalGenome & Document;
export type GenomeRunDocument = GenomeRun & Document;

export type GenomeStatus = 'Evaluating' | 'Rejected' | 'Candidate' | 'Optimized' | 'Recommended';
export type RecommendationCategory = 'MaxThermalAutonomy' | 'MinEnergyDemand' | 'Balanced';

@Schema()
export class FailurePrediction {
  @Prop({ type: Number })
  hoursToComfortFailure: number;

  @Prop({ type: Number })
  wallLossPercent: number;

  @Prop({ type: Number })
  roofLossPercent: number;

  @Prop({ type: Number })
  windowLossPercent: number;

  @Prop({ type: Number })
  otherLossPercent: number;
}

@Schema()
export class WhyRecommendedItem {
  @Prop() factor: string;
  @Prop() explanation: string;
}

@Schema({ timestamps: true })
export class ThermalGenome {
  @Prop({ required: true })
  runId: string;

  @Prop({ required: true, type: Number })
  genomeIndex: number;

  @Prop({ required: true, enum: ['Rectangular', 'A-Frame', 'Trapezoidal', 'Dome'], default: 'Rectangular' })
  shape: string;

  @Prop({ required: true, type: Number })
  length: number;

  @Prop({ required: true, type: Number })
  width: number;

  @Prop({ required: true, type: Number })
  height: number;

  @Prop({ required: true, type: Number })
  orientationAngle: number;

  @Prop({ required: true, type: Number })
  wallUValue: number;

  @Prop({ required: true, type: Number })
  roofUValue: number;

  @Prop({ required: true, enum: ['Mineral Wool', 'EPS', 'Aerogel', 'Composite'], default: 'EPS' })
  insulationType: string;

  @Prop({ required: true, type: Number })
  insulationThicknessMm: number;

  @Prop({ required: true, type: Number })
  windowRatio: number;

  @Prop({ required: true, enum: ['South', 'East', 'West', 'North'], default: 'South' })
  windowOrientation: string;

  @Prop({ required: false, type: String, default: null })
  pcmType: string | null;

  @Prop({ required: true, type: Number, default: 0 })
  pcmMassKg: number;

  @Prop({ required: true, enum: ['Wall', 'Roof', 'Floor', 'None'], default: 'None' })
  pcmPlacement: string;

  @Prop({ required: true, enum: ['Low', 'Medium', 'High'], default: 'Medium' })
  thermalMassRating: string;

  // Evaluated Results
  @Prop({ required: true, enum: ['Evaluating', 'Rejected', 'Candidate', 'Optimized', 'Recommended'], default: 'Evaluating' })
  status: GenomeStatus;

  @Prop({ type: Number, default: 0 })
  thermalAutonomyHours: number;

  @Prop({ type: Number, default: 0 })
  minNightTemp: number;

  @Prop({ type: Number, default: 0 })
  peakDayTemp: number;

  @Prop({ type: Number, default: 0 })
  totalHeatLossWh: number;

  @Prop({ type: Number, default: 0 })
  totalSolarGainWh: number;

  @Prop({ type: Number, default: 0 })
  externalHeatingDemandWh: number;

  @Prop({ type: Number, default: 0 })
  climateResilienceScore: number;

  @Prop({ type: Object, default: {} })
  climateShockResults: Record<string, 'PASS' | 'WARNING' | 'FAIL'>;

  @Prop({ type: Object, default: null })
  failurePrediction: FailurePrediction | null;

  @Prop({ type: [String], default: [] })
  improvementSuggestions: string[];

  @Prop({ type: [Object], default: [] })
  whyRecommended: WhyRecommendedItem[];

  @Prop({ type: [Object], default: [] })
  sunsetSurvivalCurve: Array<{ hour: number; indoorTemp: number; phase: string }>;

  @Prop({ type: String, default: null })
  recommendationCategory: RecommendationCategory | null;
}

export const ThermalGenomeSchema = SchemaFactory.createForClass(ThermalGenome);

@Schema({ timestamps: true })
export class GenomeRun {
  @Prop({ required: true })
  runId: string;

  @Prop({ required: true })
  status: 'running' | 'completed' | 'failed';

  @Prop({ type: Object })
  comfortTarget: Record<string, unknown>;

  @Prop({ type: Number, default: 0 })
  totalCandidates: number;

  @Prop({ type: Number, default: 0 })
  evaluatedCandidates: number;
}

export const GenomeRunSchema = SchemaFactory.createForClass(GenomeRun);
