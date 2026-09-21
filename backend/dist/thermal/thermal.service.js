"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThermalService = void 0;
const common_1 = require("@nestjs/common");
let ThermalService = class ThermalService {
    calculateConductiveHeatTransfer(uValue, area, tIn, tOut) {
        return uValue * area * (tIn - tOut);
    }
    calculateSolarGain(area, irradiance, shgc, orientationFactor = 0.5) {
        return area * irradiance * shgc * orientationFactor;
    }
    predictIndoorTemperature(shelter, startTemp, outdoorTemps, solarIrradiance) {
        const wallArea = 2 * shelter.length * shelter.height + 2 * shelter.width * shelter.height;
        const roofArea = shelter.length * shelter.width;
        const avgWallUValue = shelter.wallAssemblies?.[0]?.uValue ?? 1.5;
        let currentTemp = startTemp;
        const volume = shelter.length * shelter.width * shelter.height;
        const thermalMassAir = volume * 1.2 * 1000;
        const dtSeconds = 3600;
        return outdoorTemps.map((outTemp, hourIndex) => {
            const qWallLoss = this.calculateConductiveHeatTransfer(avgWallUValue, wallArea, currentTemp, outTemp);
            const qRoofLoss = this.calculateConductiveHeatTransfer(avgWallUValue * 1.2, roofArea, currentTemp, outTemp);
            const totalHeatLoss = qWallLoss + qRoofLoss;
            const currentIrradiance = solarIrradiance[hourIndex] || 0;
            const windowArea = shelter.openings?.reduce((sum, op) => op.type === 'Window' ? sum + op.width * op.height : sum, 0) || 5;
            const qSolar = this.calculateSolarGain(windowArea, currentIrradiance, 0.7, 0.5);
            const netHeatRate = qSolar - totalHeatLoss;
            const deltaT = (netHeatRate * dtSeconds) / thermalMassAir;
            currentTemp = currentTemp + deltaT;
            return {
                hour: hourIndex,
                outdoorTemp: outTemp,
                indoorTemp: Number(currentTemp.toFixed(2)),
                heatLossWatts: Number(totalHeatLoss.toFixed(2)),
                solarGainWatts: Number(qSolar.toFixed(2)),
            };
        });
    }
};
exports.ThermalService = ThermalService;
exports.ThermalService = ThermalService = __decorate([
    (0, common_1.Injectable)()
], ThermalService);
//# sourceMappingURL=thermal.service.js.map