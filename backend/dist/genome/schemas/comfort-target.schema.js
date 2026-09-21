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
exports.ComfortTargetSchema = exports.ComfortTarget = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let ComfortTarget = class ComfortTarget {
    minIndoorTempC;
    maxIndoorTempC;
    comfortDurationHours;
    sunsetHour;
    maxExternalHeatingWh;
    maxShelterLengthM;
    estimatedBudgetINR;
    climateProfileId;
    avgOutdoorTempC;
    tempAmplitudeC;
    peakSolarIrradianceW;
    candidateCount;
    optimizationIterations;
};
exports.ComfortTarget = ComfortTarget;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], ComfortTarget.prototype, "minIndoorTempC", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], ComfortTarget.prototype, "maxIndoorTempC", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], ComfortTarget.prototype, "comfortDurationHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number, default: 18 }),
    __metadata("design:type", Number)
], ComfortTarget.prototype, "sunsetHour", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: Number, default: 0 }),
    __metadata("design:type", Number)
], ComfortTarget.prototype, "maxExternalHeatingWh", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: Number }),
    __metadata("design:type", Number)
], ComfortTarget.prototype, "maxShelterLengthM", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: Number }),
    __metadata("design:type", Number)
], ComfortTarget.prototype, "estimatedBudgetINR", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: String }),
    __metadata("design:type", String)
], ComfortTarget.prototype, "climateProfileId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: Number, default: -5 }),
    __metadata("design:type", Number)
], ComfortTarget.prototype, "avgOutdoorTempC", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: Number, default: 10 }),
    __metadata("design:type", Number)
], ComfortTarget.prototype, "tempAmplitudeC", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: Number, default: 800 }),
    __metadata("design:type", Number)
], ComfortTarget.prototype, "peakSolarIrradianceW", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: Number, default: 20 }),
    __metadata("design:type", Number)
], ComfortTarget.prototype, "candidateCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: Number, default: 3 }),
    __metadata("design:type", Number)
], ComfortTarget.prototype, "optimizationIterations", void 0);
exports.ComfortTarget = ComfortTarget = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ComfortTarget);
exports.ComfortTargetSchema = mongoose_1.SchemaFactory.createForClass(ComfortTarget);
//# sourceMappingURL=comfort-target.schema.js.map