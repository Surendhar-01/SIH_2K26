"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenomeRunSchema = exports.GenomeRun = exports.ThermalGenomeSchema = exports.ThermalGenome = exports.WhyRecommendedItem = exports.FailurePrediction = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let FailurePrediction = class FailurePrediction {
    hoursToComfortFailure;
    wallLossPercent;
    roofLossPercent;
    windowLossPercent;
    otherLossPercent;
};
exports.FailurePrediction = FailurePrediction;
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], FailurePrediction.prototype, "hoursToComfortFailure", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], FailurePrediction.prototype, "wallLossPercent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], FailurePrediction.prototype, "roofLossPercent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], FailurePrediction.prototype, "windowLossPercent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], FailurePrediction.prototype, "otherLossPercent", void 0);
exports.FailurePrediction = FailurePrediction = __decorate([
    (0, mongoose_1.Schema)()
], FailurePrediction);
let WhyRecommendedItem = class WhyRecommendedItem {
    factor;
    explanation;
};
exports.WhyRecommendedItem = WhyRecommendedItem;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WhyRecommendedItem.prototype, "factor", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WhyRecommendedItem.prototype, "explanation", void 0);
exports.WhyRecommendedItem = WhyRecommendedItem = __decorate([
    (0, mongoose_1.Schema)()
], WhyRecommendedItem);
let ThermalGenome = class ThermalGenome {
    runId;
    genomeIndex;
    shape;
    length;
    width;
    height;
    orientationAngle;
    wallUValue;
    roofUValue;
    insulationType;
    insulationThicknessMm;
    windowRatio;
    windowOrientation;
    pcmType;
    pcmMassKg;
    pcmPlacement;
    thermalMassRating;
    status;
    thermalAutonomyHours;
    minNightTemp;
    peakDayTemp;
    totalHeatLossWh;
    totalSolarGainWh;
    externalHeatingDemandWh;
    climateResilienceScore;
    climateShockResults;
    failurePrediction;
    improvementSuggestions;
    whyRecommended;
    sunsetSurvivalCurve;
    recommendationCategory;
};
exports.ThermalGenome = ThermalGenome;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ThermalGenome.prototype, "runId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], ThermalGenome.prototype, "genomeIndex", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Rectangular', 'A-Frame', 'Trapezoidal', 'Dome'], default: 'Rectangular' }),
    __metadata("design:type", String)
], ThermalGenome.prototype, "shape", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], ThermalGenome.prototype, "length", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], ThermalGenome.prototype, "width", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], ThermalGenome.prototype, "height", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], ThermalGenome.prototype, "orientationAngle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], ThermalGenome.prototype, "wallUValue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], ThermalGenome.prototype, "roofUValue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Mineral Wool', 'EPS', 'Aerogel', 'Composite'], default: 'EPS' }),
    __metadata("design:type", String)
], ThermalGenome.prototype, "insulationType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], ThermalGenome.prototype, "insulationThicknessMm", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], ThermalGenome.prototype, "windowRatio", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['South', 'East', 'West', 'North'], default: 'South' }),
    __metadata("design:type", String)
], ThermalGenome.prototype, "windowOrientation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: String, default: null }),
    __metadata("design:type", Object)
], ThermalGenome.prototype, "pcmType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number, default: 0 }),
    __metadata("design:type", Number)
], ThermalGenome.prototype, "pcmMassKg", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Wall', 'Roof', 'Floor', 'None'], default: 'None' }),
    __metadata("design:type", String)
], ThermalGenome.prototype, "pcmPlacement", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Low', 'Medium', 'High'], default: 'Medium' }),
    __metadata("design:type", String)
], ThermalGenome.prototype, "thermalMassRating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Evaluating', 'Rejected', 'Candidate', 'Optimized', 'Recommended'], default: 'Evaluating' }),
    __metadata("design:type", String)
], ThermalGenome.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], ThermalGenome.prototype, "thermalAutonomyHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], ThermalGenome.prototype, "minNightTemp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], ThermalGenome.prototype, "peakDayTemp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], ThermalGenome.prototype, "totalHeatLossWh", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], ThermalGenome.prototype, "totalSolarGainWh", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], ThermalGenome.prototype, "externalHeatingDemandWh", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], ThermalGenome.prototype, "climateResilienceScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], ThermalGenome.prototype, "climateShockResults", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: null }),
    __metadata("design:type", Object)
], ThermalGenome.prototype, "failurePrediction", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], ThermalGenome.prototype, "improvementSuggestions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], ThermalGenome.prototype, "whyRecommended", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], ThermalGenome.prototype, "sunsetSurvivalCurve", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], ThermalGenome.prototype, "recommendationCategory", void 0);
exports.ThermalGenome = ThermalGenome = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ThermalGenome);
exports.ThermalGenomeSchema = mongoose_1.SchemaFactory.createForClass(ThermalGenome);
let GenomeRun = class GenomeRun {
    runId;
    status;
    comfortTarget;
    totalCandidates;
    evaluatedCandidates;
};
exports.GenomeRun = GenomeRun;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GenomeRun.prototype, "runId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], GenomeRun.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], GenomeRun.prototype, "comfortTarget", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], GenomeRun.prototype, "totalCandidates", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], GenomeRun.prototype, "evaluatedCandidates", void 0);
exports.GenomeRun = GenomeRun = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], GenomeRun);
exports.GenomeRunSchema = mongoose_1.SchemaFactory.createForClass(GenomeRun);
//# sourceMappingURL=genome.schema.js.map