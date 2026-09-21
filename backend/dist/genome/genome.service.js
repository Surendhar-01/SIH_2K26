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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GenomeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenomeService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const crypto_1 = require("crypto");
const thermal_service_1 = require("../thermal/thermal.service");
const genome_schema_1 = require("./schemas/genome.schema");
const SHOCK_SCENARIOS = {
    normal_winter: { name: 'Normal Winter Day', avgTemp: -5, amplitude: 10, solarMod: 1.0, windPenalty: 0 },
    extreme_cold: { name: 'Extreme Cold Night', avgTemp: -18, amplitude: 4, solarMod: 1.0, windPenalty: 0 },
    low_solar: { name: 'Low Solar Day', avgTemp: -5, amplitude: 10, solarMod: 0.25, windPenalty: 0 },
    cloudy_day: { name: 'Cloudy Day', avgTemp: -3, amplitude: 8, solarMod: 0.4, windPenalty: 0 },
    high_wind: { name: 'High Wind Condition', avgTemp: -5, amplitude: 10, solarMod: 1.0, windPenalty: 0.3 },
    sudden_drop: { name: 'Sudden Temperature Drop', avgTemp: -5, amplitude: 10, solarMod: 1.0, windPenalty: 0 },
};
const SHAPES = ['Rectangular', 'A-Frame', 'Trapezoidal', 'Dome'];
const INSULATION_TYPES = ['Mineral Wool', 'EPS', 'Aerogel', 'Composite'];
const ORIENTATIONS = [0, 90, 135, 180, 225, 270];
const WINDOW_ORIENTATIONS = ['South', 'East', 'West', 'North'];
const PCM_PLACEMENT = ['Wall', 'Roof', 'Floor', 'None'];
const THERMAL_MASS = ['Low', 'Medium', 'High'];
const U_VALUES = [0.15, 0.25, 0.35, 0.5, 0.8, 1.2];
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}
let GenomeService = GenomeService_1 = class GenomeService {
    genomeModel;
    runModel;
    thermalService;
    logger = new common_1.Logger(GenomeService_1.name);
    constructor(genomeModel, runModel, thermalService) {
        this.genomeModel = genomeModel;
        this.runModel = runModel;
        this.thermalService = thermalService;
    }
    async startRun(target) {
        const runId = (0, crypto_1.randomUUID)();
        const candidateCount = target.candidateCount ?? 20;
        const iterations = target.optimizationIterations ?? 3;
        const run = await this.runModel.create({
            runId,
            status: 'running',
            comfortTarget: target,
            totalCandidates: candidateCount,
            evaluatedCandidates: 0,
        });
        this.executeGenomeLoop(runId, target, candidateCount, iterations).then(async () => {
            await this.runModel.updateOne({ runId }, { status: 'completed' });
        }).catch(async (err) => {
            this.logger.error(`Genome run ${runId} failed: ${err}`);
            await this.runModel.updateOne({ runId }, { status: 'failed' });
        });
        return { runId };
    }
    async getRun(runId) {
        const run = await this.runModel.findOne({ runId });
        const genomes = await this.genomeModel.find({ runId }).sort({ thermalAutonomyHours: -1 });
        return { run, genomes };
    }
    async getRecommendations(runId) {
        const all = await this.genomeModel
            .find({ runId, status: { $in: ['Recommended', 'Optimized', 'Candidate'] } })
            .sort({ thermalAutonomyHours: -1 });
        const maxTA = all[0] ?? null;
        const minEnergy = [...all].sort((a, b) => a.externalHeatingDemandWh - b.externalHeatingDemandWh)[0] ?? null;
        const balanced = [...all].sort((a, b) => b.climateResilienceScore - a.climateResilienceScore)[0] ?? null;
        return { maxThermalAutonomy: maxTA, minEnergyDemand: minEnergy, balanced };
    }
    async improveGenome(genomeId, target) {
        const genome = await this.genomeModel.findById(genomeId);
        if (!genome)
            return null;
        const params = this.extractParams(genome);
        const improved = this.applyImprovementMutations(params, genome.failurePrediction);
        const outdoorTemps = this.buildOutdoorProfile(target.avgOutdoorTempC, target.tempAmplitudeC);
        const solar = this.buildSolarProfile(target.peakSolarIrradianceW);
        const evaluated = this.evaluateSingleGenome(improved, target, outdoorTemps, solar, genome.genomeIndex + 1000, genome.runId);
        const saved = await this.genomeModel.create(evaluated);
        return saved;
    }
    async ansysValidate(genomeId) {
        const genome = await this.genomeModel.findById(genomeId);
        if (!genome)
            return null;
        await this.genomeModel.updateOne({ _id: genomeId }, { 'climateShockResults.ansysStatus': 'Queued' });
        return { genomeId, ansysStatus: 'Queued', message: 'ANSYS validation queued. Use /api/ansys/jobs endpoint to track.' };
    }
    async executeGenomeLoop(runId, target, candidateCount, iterations) {
        const outdoorTemps = this.buildOutdoorProfile(target.avgOutdoorTempC, target.tempAmplitudeC);
        const solar = this.buildSolarProfile(target.peakSolarIrradianceW);
        const seedPool = this.generateSeedPool(candidateCount);
        const evaluatedGenomes = [];
        for (let i = 0; i < seedPool.length; i++) {
            const params = seedPool[i];
            const evaluated = this.evaluateSingleGenome(params, target, outdoorTemps, solar, i, runId);
            const doc = await this.genomeModel.create(evaluated);
            evaluatedGenomes.push(doc);
            await this.runModel.updateOne({ runId }, { evaluatedCandidates: i + 1 });
        }
        for (let iter = 0; iter < iterations; iter++) {
            const candidates = evaluatedGenomes.filter((g) => g.status === 'Candidate' || g.status === 'Rejected');
            if (candidates.length === 0)
                break;
            for (let i = 0; i < Math.min(5, candidates.length); i++) {
                const worst = candidates[candidates.length - 1 - i];
                const improvedParams = this.applyImprovementMutations(this.extractParams(worst), worst.failurePrediction);
                const improved = this.evaluateSingleGenome(improvedParams, target, outdoorTemps, solar, candidateCount + iter * 5 + i, runId);
                const doc = await this.genomeModel.create(improved);
                evaluatedGenomes.push(doc);
            }
        }
        const sorted = [...evaluatedGenomes].sort((a, b) => b.thermalAutonomyHours - a.thermalAutonomyHours);
        if (sorted[0])
            await this.genomeModel.updateOne({ _id: sorted[0]._id }, { status: 'Recommended', recommendationCategory: 'MaxThermalAutonomy' });
        const byEnergy = [...evaluatedGenomes].sort((a, b) => a.externalHeatingDemandWh - b.externalHeatingDemandWh);
        if (byEnergy[0])
            await this.genomeModel.updateOne({ _id: byEnergy[0]._id }, { status: 'Recommended', recommendationCategory: 'MinEnergyDemand' });
        const byScore = [...evaluatedGenomes].sort((a, b) => b.climateResilienceScore - a.climateResilienceScore);
        if (byScore[0])
            await this.genomeModel.updateOne({ _id: byScore[0]._id }, { status: 'Recommended', recommendationCategory: 'Balanced' });
    }
    generateSeedPool(n) {
        const pool = [];
        for (const orient of [0, 90, 180, 270]) {
            for (const uv of [0.2, 0.5, 1.0]) {
                pool.push(this.makeSeed({ orientationAngle: orient, wallUValue: uv }));
                if (pool.length >= n)
                    break;
            }
            if (pool.length >= n)
                break;
        }
        while (pool.length < n) {
            pool.push(this.makeSeed({}));
        }
        return pool;
    }
    makeSeed(overrides) {
        const wallU = overrides.wallUValue ?? pick(U_VALUES);
        const thickness = Math.round(clamp(200 / wallU, 40, 300) / 10) * 10;
        return {
            shape: overrides.shape ?? pick(SHAPES),
            length: 8,
            width: 4,
            height: 3,
            orientationAngle: overrides.orientationAngle ?? pick(ORIENTATIONS),
            wallUValue: wallU,
            roofUValue: wallU * 1.2,
            insulationType: wallU < 0.3 ? 'Aerogel' : wallU < 0.5 ? 'Mineral Wool' : pick(INSULATION_TYPES),
            insulationThicknessMm: thickness,
            windowRatio: overrides.windowRatio ?? pick([0.06, 0.08, 0.10, 0.12, 0.15]),
            windowOrientation: 'South',
            pcmType: overrides.pcmType !== undefined ? overrides.pcmType : Math.random() > 0.5 ? 'Paraffin RT28' : null,
            pcmMassKg: overrides.pcmMassKg ?? pick([0, 20, 35, 50]),
            pcmPlacement: overrides.pcmPlacement ?? pick(PCM_PLACEMENT),
            thermalMassRating: overrides.thermalMassRating ?? pick(THERMAL_MASS),
            ...overrides,
        };
    }
    evaluateSingleGenome(params, target, outdoorTemps, solarIrradiance, index, runId) {
        const shelterShape = this.buildShelterShape(params);
        const thermalProfile = this.thermalService.predictIndoorTemperature(shelterShape, params.wallUValue < 0.5 ? target.minIndoorTempC + 3 : target.minIndoorTempC, outdoorTemps, solarIrradiance);
        const pcmEnergyReleaseJ = params.pcmMassKg * 200_000;
        const pcmBoostPerHour = pcmEnergyReleaseJ / (3600 * 8);
        const pcmBoostTempC = pcmBoostPerHour / (shelterShape.length * shelterShape.width * shelterShape.height * 1.2 * 1000);
        const adjustedProfile = thermalProfile.map((h) => {
            if (h.hour >= target.sunsetHour && params.pcmMassKg > 0) {
                return { ...h, indoorTemp: h.indoorTemp + pcmBoostTempC };
            }
            return h;
        });
        const peakDayTemp = Math.max(...adjustedProfile.slice(6, 18).map((h) => h.indoorTemp));
        const minNightTemp = Math.min(...adjustedProfile.slice(18).concat(adjustedProfile.slice(0, 6)).map((h) => h.indoorTemp));
        const totalHeatLoss = adjustedProfile.reduce((s, h) => s + Math.max(0, h.heatLossWatts), 0);
        const totalSolarGain = adjustedProfile.reduce((s, h) => s + h.solarGainWatts, 0);
        const sunsetSurvivalCurve = [];
        let autonomyHours = 0;
        let comfortFailed = false;
        for (let h = target.sunsetHour; h < 24; h++) {
            const pt = adjustedProfile[h];
            const phase = pt.indoorTemp >= target.minIndoorTempC ? 'comfort' : 'failure';
            if (!comfortFailed && phase === 'comfort')
                autonomyHours++;
            if (phase === 'failure' && !comfortFailed)
                comfortFailed = true;
            sunsetSurvivalCurve.push({ hour: h, indoorTemp: Number(pt.indoorTemp.toFixed(2)), phase });
        }
        const volume = shelterShape.length * shelterShape.width * shelterShape.height;
        const thermalMassAir = volume * 1.2 * 1000;
        let externalHeatingDemandWh = 0;
        if (comfortFailed) {
            for (const pt of adjustedProfile.slice(target.sunsetHour)) {
                if (pt.indoorTemp < target.minIndoorTempC) {
                    const deficitJ = (target.minIndoorTempC - pt.indoorTemp) * thermalMassAir;
                    externalHeatingDemandWh += deficitJ / 3600;
                }
            }
        }
        const wallArea = 2 * shelterShape.length * shelterShape.height + 2 * shelterShape.width * shelterShape.height;
        const roofArea = shelterShape.length * shelterShape.width;
        const windowArea = shelterShape.openings?.reduce((s, o) => s + (o.type === 'Window' ? o.width * o.height : 0), 0) ?? 4;
        const dT = adjustedProfile[target.sunsetHour]?.indoorTemp - outdoorTemps[target.sunsetHour] || 5;
        const wallLoss = params.wallUValue * wallArea * dT;
        const roofLoss = params.roofUValue * roofArea * dT;
        const winLoss = 2.0 * windowArea * dT;
        const totalLoss = wallLoss + roofLoss + winLoss;
        const wallPct = totalLoss > 0 ? Math.round((wallLoss / totalLoss) * 100) : 33;
        const roofPct = totalLoss > 0 ? Math.round((roofLoss / totalLoss) * 100) : 27;
        const winPct = totalLoss > 0 ? Math.round((winLoss / totalLoss) * 100) : 20;
        const otherPct = 100 - wallPct - roofPct - winPct;
        const climateShockResults = this.runClimateShockTests(params, target);
        const passCount = Object.values(climateShockResults).filter((r) => r === 'PASS').length;
        const shockScore = passCount / Object.keys(climateShockResults).length;
        const autonomyScore = Math.min(autonomyHours / target.comfortDurationHours, 1);
        const energyScore = externalHeatingDemandWh < 100 ? 1 : Math.max(0, 1 - externalHeatingDemandWh / 5000);
        const climateResilienceScore = Number((0.4 * autonomyScore + 0.35 * shockScore + 0.25 * energyScore).toFixed(3));
        const meetsTarget = autonomyHours >= target.comfortDurationHours;
        const status = meetsTarget ? 'Candidate' : 'Rejected';
        const improvementSuggestions = [];
        if (wallPct > 35)
            improvementSuggestions.push('Increase wall insulation thickness to reduce dominant wall conductive losses');
        if (roofPct > 25)
            improvementSuggestions.push('Reduce roof U-value with additional insulation layer to cut largest nighttime loss');
        if (winPct > 20)
            improvementSuggestions.push('Reduce window-to-wall ratio to limit nighttime opening losses');
        if (params.pcmMassKg < 25)
            improvementSuggestions.push('Increase PCM mass to extend post-sunset thermal energy storage');
        if (params.orientationAngle !== 180)
            improvementSuggestions.push('Reorient to South-facing (180°) for maximum useful solar gain');
        const whyRecommended = [];
        if (params.orientationAngle === 180)
            whyRecommended.push({ factor: 'South Orientation', explanation: 'Calculated maximum useful solar exposure for the selected climate conditions.' });
        if (params.wallUValue <= 0.25)
            whyRecommended.push({ factor: 'Wall Assembly', explanation: `U-value of ${params.wallUValue} W/m²K provides low calculated conductive heat transfer.` });
        if (params.roofUValue <= 0.35)
            whyRecommended.push({ factor: 'Roof Insulation', explanation: 'Roof U-value reduces the largest identified nighttime loss path.' });
        if (params.windowRatio <= 0.10)
            whyRecommended.push({ factor: 'Opening Ratio', explanation: 'Balances useful solar gain against nighttime opening losses.' });
        if (params.pcmMassKg >= 30)
            whyRecommended.push({ factor: 'Thermal Storage', explanation: `${params.pcmMassKg}kg PCM shifts daytime thermal energy into the post-sunset period.` });
        return {
            runId,
            genomeIndex: index,
            shape: params.shape,
            length: params.length,
            width: params.width,
            height: params.height,
            orientationAngle: params.orientationAngle,
            wallUValue: params.wallUValue,
            roofUValue: params.roofUValue,
            insulationType: params.insulationType,
            insulationThicknessMm: params.insulationThicknessMm,
            windowRatio: params.windowRatio,
            windowOrientation: params.windowOrientation,
            pcmType: params.pcmType,
            pcmMassKg: params.pcmMassKg,
            pcmPlacement: params.pcmPlacement,
            thermalMassRating: params.thermalMassRating,
            status,
            thermalAutonomyHours: autonomyHours,
            minNightTemp: Number(minNightTemp.toFixed(2)),
            peakDayTemp: Number(peakDayTemp.toFixed(2)),
            totalHeatLossWh: Number(totalHeatLoss.toFixed(1)),
            totalSolarGainWh: Number(totalSolarGain.toFixed(1)),
            externalHeatingDemandWh: Number(externalHeatingDemandWh.toFixed(1)),
            climateResilienceScore,
            climateShockResults,
            failurePrediction: {
                hoursToComfortFailure: autonomyHours,
                wallLossPercent: wallPct,
                roofLossPercent: roofPct,
                windowLossPercent: winPct,
                otherLossPercent: Math.max(0, otherPct),
            },
            improvementSuggestions,
            whyRecommended,
            sunsetSurvivalCurve,
            recommendationCategory: null,
        };
    }
    runClimateShockTests(params, target) {
        const results = {};
        for (const [key, scenario] of Object.entries(SHOCK_SCENARIOS)) {
            const outdoors = this.buildOutdoorProfile(scenario.avgTemp, key === 'sudden_drop' ? 6 : scenario.amplitude);
            const solarArr = this.buildSolarProfile(800 * scenario.solarMod);
            const effectiveWallU = params.wallUValue * (1 + scenario.windPenalty);
            const effectiveParams = { ...params, wallUValue: effectiveWallU, roofUValue: params.roofUValue * (1 + scenario.windPenalty) };
            const shelter = this.buildShelterShape(effectiveParams);
            const profile = this.thermalService.predictIndoorTemperature(shelter, target.minIndoorTempC + 3, outdoors, solarArr);
            if (key === 'sudden_drop') {
                for (let h = 14; h < 24; h++)
                    profile[h].indoorTemp = profile[h].indoorTemp - 15;
            }
            let autonomy = 0;
            for (let h = target.sunsetHour; h < 24; h++) {
                if (profile[h].indoorTemp >= target.minIndoorTempC)
                    autonomy++;
                else
                    break;
            }
            const ratio = autonomy / target.comfortDurationHours;
            results[key] = ratio >= 1 ? 'PASS' : ratio >= 0.6 ? 'WARNING' : 'FAIL';
        }
        return results;
    }
    applyImprovementMutations(params, failure) {
        const improved = { ...params };
        const wallDom = failure?.wallLossPercent > 35;
        const roofDom = failure?.roofLossPercent > 25;
        const winDom = failure?.windowLossPercent > 20;
        if (wallDom) {
            improved.wallUValue = clamp(improved.wallUValue - 0.1, 0.1, 2.0);
            improved.insulationThicknessMm = clamp(improved.insulationThicknessMm + 20, 40, 350);
            if (improved.wallUValue < 0.25)
                improved.insulationType = 'Aerogel';
        }
        if (roofDom) {
            improved.roofUValue = clamp(improved.roofUValue - 0.1, 0.1, 2.5);
        }
        if (winDom) {
            improved.windowRatio = clamp(improved.windowRatio - 0.02, 0.04, 0.20);
        }
        if ((failure?.hoursToComfortFailure ?? 0) < (params.pcmMassKg > 0 ? 6 : 4)) {
            improved.pcmMassKg = clamp(improved.pcmMassKg + 15, 0, 100);
            if (improved.pcmPlacement === 'None')
                improved.pcmPlacement = 'Wall';
            if (!improved.pcmType)
                improved.pcmType = 'Paraffin RT28';
        }
        improved.orientationAngle = 180;
        improved.windowOrientation = 'South';
        return improved;
    }
    buildOutdoorProfile(avgTemp, amplitude) {
        return Array.from({ length: 24 }, (_, i) => avgTemp + Math.sin((i * Math.PI) / 12) * amplitude);
    }
    buildSolarProfile(peakIrradiance) {
        return Array.from({ length: 24 }, (_, i) => i > 6 && i < 18 ? Math.sin(((i - 6) * Math.PI) / 12) * peakIrradiance : 0);
    }
    buildShelterShape(params) {
        const windowArea = params.length * params.height * params.windowRatio;
        return {
            length: params.length,
            width: params.width,
            height: params.height,
            orientationAngle: params.orientationAngle,
            wallAssemblies: [{ uValue: params.wallUValue }],
            openings: [{ type: 'Window', width: Math.sqrt(windowArea), height: Math.sqrt(windowArea), uValue: 2.0, orientation: params.windowOrientation }],
        };
    }
    extractParams(genome) {
        return {
            shape: genome.shape,
            length: genome.length,
            width: genome.width,
            height: genome.height,
            orientationAngle: genome.orientationAngle,
            wallUValue: genome.wallUValue,
            roofUValue: genome.roofUValue,
            insulationType: genome.insulationType,
            insulationThicknessMm: genome.insulationThicknessMm,
            windowRatio: genome.windowRatio,
            windowOrientation: genome.windowOrientation,
            pcmType: genome.pcmType,
            pcmMassKg: genome.pcmMassKg,
            pcmPlacement: genome.pcmPlacement,
            thermalMassRating: genome.thermalMassRating,
        };
    }
};
exports.GenomeService = GenomeService;
exports.GenomeService = GenomeService = GenomeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(genome_schema_1.ThermalGenome.name)),
    __param(1, (0, mongoose_1.InjectModel)(genome_schema_1.GenomeRun.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        thermal_service_1.ThermalService])
], GenomeService);
//# sourceMappingURL=genome.service.js.map