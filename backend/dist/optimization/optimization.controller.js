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
exports.OptimizationController = void 0;
const common_1 = require("@nestjs/common");
const optimization_service_1 = require("./optimization.service");
const swagger_1 = require("@nestjs/swagger");
let OptimizationController = class OptimizationController {
    optimizationService;
    constructor(optimizationService) {
        this.optimizationService = optimizationService;
    }
    runOptimization(body) {
        return this.optimizationService.runOptimization(body.baseShelter, body.indoorTemp, body.outdoorTemps, body.solarIrradiance);
    }
};
exports.OptimizationController = OptimizationController;
__decorate([
    (0, common_1.Post)('run'),
    (0, swagger_1.ApiOperation)({
        summary: 'Run internal Genetic Algorithm optimizing geometric configurations',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OptimizationController.prototype, "runOptimization", null);
exports.OptimizationController = OptimizationController = __decorate([
    (0, swagger_1.ApiTags)('optimization'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('optimization'),
    __metadata("design:paramtypes", [optimization_service_1.OptimizationService])
], OptimizationController);
//# sourceMappingURL=optimization.controller.js.map