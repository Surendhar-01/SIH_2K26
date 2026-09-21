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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenomeController = void 0;
const common_1 = require("@nestjs/common");
const genome_service_1 = require("./genome.service");
let GenomeController = class GenomeController {
    genomeService;
    constructor(genomeService) {
        this.genomeService = genomeService;
    }
    async startRun(body) {
        return this.genomeService.startRun({
            minIndoorTempC: body.minIndoorTempC ?? 15,
            maxIndoorTempC: body.maxIndoorTempC ?? 28,
            comfortDurationHours: body.comfortDurationHours ?? 8,
            sunsetHour: body.sunsetHour ?? 18,
            maxExternalHeatingWh: body.maxExternalHeatingWh ?? 0,
            avgOutdoorTempC: body.avgOutdoorTempC ?? -5,
            tempAmplitudeC: body.tempAmplitudeC ?? 10,
            peakSolarIrradianceW: body.peakSolarIrradianceW ?? 800,
            candidateCount: body.candidateCount ?? 20,
            optimizationIterations: body.optimizationIterations ?? 3,
        });
    }
    async getRun(runId) {
        return this.genomeService.getRun(runId);
    }
    async getRecommendations(runId) {
        return this.genomeService.getRecommendations(runId);
    }
    async improveGenome(genomeId, target) {
        return this.genomeService.improveGenome(genomeId, {
            minIndoorTempC: target.minIndoorTempC ?? 15,
            maxIndoorTempC: target.maxIndoorTempC ?? 28,
            comfortDurationHours: target.comfortDurationHours ?? 8,
            sunsetHour: target.sunsetHour ?? 18,
            maxExternalHeatingWh: target.maxExternalHeatingWh ?? 0,
            avgOutdoorTempC: target.avgOutdoorTempC ?? -5,
            tempAmplitudeC: target.tempAmplitudeC ?? 10,
            peakSolarIrradianceW: target.peakSolarIrradianceW ?? 800,
        });
    }
    async ansysValidate(genomeId) {
        return this.genomeService.ansysValidate(genomeId);
    }
};
exports.GenomeController = GenomeController;
__decorate([
    (0, common_1.Post)('run'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GenomeController.prototype, "startRun", null);
__decorate([
    (0, common_1.Get)('run/:runId'),
    __param(0, (0, common_1.Param)('runId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GenomeController.prototype, "getRun", null);
__decorate([
    (0, common_1.Get)('run/:runId/recommendations'),
    __param(0, (0, common_1.Param)('runId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GenomeController.prototype, "getRecommendations", null);
__decorate([
    (0, common_1.Post)('genome/:genomeId/improve'),
    __param(0, (0, common_1.Param)('genomeId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GenomeController.prototype, "improveGenome", null);
__decorate([
    (0, common_1.Post)('ansys-validate/:genomeId'),
    __param(0, (0, common_1.Param)('genomeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GenomeController.prototype, "ansysValidate", null);
exports.GenomeController = GenomeController = __decorate([
    (0, common_1.Controller)('genome'),
    __metadata("design:paramtypes", [genome_service_1.GenomeService])
], GenomeController);
//# sourceMappingURL=genome.controller.js.map