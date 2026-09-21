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
exports.ComparisonService = void 0;
const common_1 = require("@nestjs/common");
const thermal_service_1 = require("../thermal/thermal.service");
let ComparisonService = class ComparisonService {
    thermalService;
    constructor(thermalService) {
        this.thermalService = thermalService;
    }
    compareDesigns(designs, indoorTemp, outdoorTemps, solarIrradiance) {
        const results = [];
        for (const shelter of designs) {
            const thermalProfile = this.thermalService.predictIndoorTemperature(shelter, indoorTemp, outdoorTemps, solarIrradiance);
            const totalSolarGain = thermalProfile.reduce((sum, h) => sum + h.solarGainWatts, 0);
            const totalHeatLoss = thermalProfile.reduce((sum, h) => sum + h.heatLossWatts, 0);
            const minTemp = Math.min(...thermalProfile.map((h) => h.indoorTemp));
            const maxTemp = Math.max(...thermalProfile.map((h) => h.indoorTemp));
            const nightHours = thermalProfile.filter((h) => h.hour >= 18 || h.hour <= 6);
            const avgNightTemp = nightHours.reduce((sum, h) => sum + h.indoorTemp, 0) /
                (nightHours.length || 1);
            results.push({
                shelterId: shelter.id || shelter.name,
                thermalProfile,
                metrics: {
                    totalSolarGain: Number(totalSolarGain.toFixed(2)),
                    totalHeatLoss: Number(totalHeatLoss.toFixed(2)),
                    minTemp,
                    maxTemp,
                    avgNightTemp: Number(avgNightTemp.toFixed(2)),
                },
            });
        }
        return results.sort((a, b) => b.metrics.avgNightTemp - a.metrics.avgNightTemp);
    }
    calculateEnergySaving(baselineShelter, optimizedShelter, indoorTemp, outdoorTemps, solarIrradiance) {
        const baselineProfile = this.thermalService.predictIndoorTemperature(baselineShelter, indoorTemp, outdoorTemps, solarIrradiance);
        const optimizedProfile = this.thermalService.predictIndoorTemperature(optimizedShelter, indoorTemp, outdoorTemps, solarIrradiance);
        const baselineHeatLoss = baselineProfile.reduce((sum, h) => sum + h.heatLossWatts, 0);
        const optimizedHeatLoss = optimizedProfile.reduce((sum, h) => sum + h.heatLossWatts, 0);
        let energySaved = 0;
        let percentageReduction = 0;
        if (baselineHeatLoss > 0) {
            energySaved = baselineHeatLoss - optimizedHeatLoss;
            percentageReduction =
                ((baselineHeatLoss - optimizedHeatLoss) / baselineHeatLoss) * 100;
        }
        return {
            baselineHeatingRequirement: Number(baselineHeatLoss.toFixed(2)),
            optimizedHeatingRequirement: Number(optimizedHeatLoss.toFixed(2)),
            energySaved: energySaved > 0 ? Number(energySaved.toFixed(2)) : 0,
            percentageReduction: percentageReduction > 0 ? Number(percentageReduction.toFixed(2)) : 0,
        };
    }
};
exports.ComparisonService = ComparisonService;
exports.ComparisonService = ComparisonService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [thermal_service_1.ThermalService])
], ComparisonService);
//# sourceMappingURL=comparison.service.js.map