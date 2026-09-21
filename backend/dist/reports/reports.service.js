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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const optimization_service_1 = require("../optimization/optimization.service");
let ReportsService = class ReportsService {
    optService;
    constructor(optService) {
        this.optService = optService;
    }
    generateParetoReport(baseShelter, indoorTemp, outdoorTemps, solarIrradiance) {
        const optResult = this.optService.runOptimization(baseShelter, indoorTemp, outdoorTemps, solarIrradiance);
        const paretoFront = optResult.paretoFront;
        const recommendedDesign = optResult.recommendedDesign;
        const reasons = optResult.reasons;
        return {
            title: 'ThermoShelter AI Pareto Optimization Report',
            timestamp: new Date().toISOString(),
            recommendedDesign,
            paretoFrontierOptions: paretoFront.map((p, idx) => ({
                rank: idx + 1,
                designName: p.shelter.name || `Option-${idx}`,
                nightTempRetention: Number(p.rawMetrics.nightTemp.toFixed(2)),
                solarGainUtility: Number(p.rawMetrics.solarGain.toFixed(2)),
                heatLossRestriction: Number(p.rawMetrics.heatLoss.toFixed(2)),
                insulationCost: Number(p.rawMetrics.cost.toFixed(2)),
            })),
            aiReasoning: reasons,
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [optimization_service_1.OptimizationService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map