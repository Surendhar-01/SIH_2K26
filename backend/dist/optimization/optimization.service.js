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
exports.OptimizationService = void 0;
const common_1 = require("@nestjs/common");
const thermal_service_1 = require("../thermal/thermal.service");
let OptimizationService = class OptimizationService {
    thermalService;
    constructor(thermalService) {
        this.thermalService = thermalService;
    }
    runOptimization(baseShelter, indoorTemp, outdoorTemps, solarIrradiance) {
        const candidates = [];
        const orientations = [0, 90, 180, 270];
        const uValuesTest = [0.2, 0.4, 0.8, 1.2, 1.5];
        let ind = 0;
        for (const orient of orientations) {
            for (const uv of uValuesTest) {
                const candidate = JSON.parse(JSON.stringify(baseShelter));
                candidate.name = `Option-${ind}`;
                candidate.orientationAngle = orient;
                if ((candidate.wallAssemblies?.length ?? 0) > 0)
                    candidate.wallAssemblies[0].uValue = uv;
                candidates.push(candidate);
                ind++;
            }
        }
        const evaluated = [];
        for (const shelter of candidates) {
            const thermalProfile = this.thermalService.predictIndoorTemperature(shelter, indoorTemp, outdoorTemps, solarIrradiance);
            const totalSolarGain = thermalProfile.reduce((sum, h) => sum + h.solarGainWatts, 0);
            const totalHeatLoss = thermalProfile.reduce((sum, h) => sum + h.heatLossWatts, 0);
            const nightHours = thermalProfile.filter((h) => h.hour >= 18 || h.hour <= 6);
            const avgNightTemp = nightHours.reduce((sum, h) => sum + h.indoorTemp, 0) /
                (nightHours.length || 1);
            const costRaw = (1 / (shelter.wallAssemblies?.[0]?.uValue || 1.5)) * 1000;
            evaluated.push({
                shelter,
                rawMetrics: {
                    heatLoss: totalHeatLoss,
                    solarGain: totalSolarGain,
                    nightTemp: avgNightTemp,
                    cost: costRaw,
                },
            });
        }
        const maxHeatLoss = Math.max(...evaluated.map((e) => e.rawMetrics.heatLoss)) || 1;
        const maxSolarGain = Math.max(...evaluated.map((e) => e.rawMetrics.solarGain)) || 1;
        const maxNightTemp = Math.max(...evaluated.map((e) => e.rawMetrics.nightTemp)) || 1;
        const maxCost = Math.max(...evaluated.map((e) => e.rawMetrics.cost)) || 1;
        const wNightTemp = 2.0;
        const wSolarGain = 1.0;
        const wHeatLoss = 1.5;
        const wCost = 1.0;
        for (const e of evaluated) {
            const nNightTemp = e.rawMetrics.nightTemp / maxNightTemp;
            const nSolarGain = e.rawMetrics.solarGain / maxSolarGain;
            const nHeatLoss = e.rawMetrics.heatLoss / maxHeatLoss;
            const nCost = e.rawMetrics.cost / maxCost;
            e.score =
                wNightTemp * nNightTemp +
                    wSolarGain * nSolarGain -
                    wHeatLoss * nHeatLoss -
                    wCost * nCost;
        }
        evaluated.sort((a, b) => (b.score || 0) - (a.score || 0));
        const best = evaluated[0];
        const explanations = [];
        if (best.rawMetrics.cost > 2500) {
            explanations.push({
                factor: 'Insulation',
                impact: 'Reduced wall heat transfer significantly via thicker composite layers.',
            });
        }
        if (best.shelter.orientationAngle === 180) {
            explanations.push({
                factor: 'Orientation',
                impact: 'South-facing alignment maximizes useful winter solar gain.',
            });
        }
        return {
            recommendedDesign: best.shelter,
            performance: best.rawMetrics,
            reasons: explanations.length > 0
                ? explanations
                : [
                    {
                        factor: 'Balanced Utility',
                        impact: 'Best trade-off between insulation cost and thermal stability.',
                    },
                ],
            paretoFront: evaluated.slice(0, 5),
        };
    }
};
exports.OptimizationService = OptimizationService;
exports.OptimizationService = OptimizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [thermal_service_1.ThermalService])
], OptimizationService);
//# sourceMappingURL=optimization.service.js.map