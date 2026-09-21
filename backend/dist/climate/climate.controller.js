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
exports.ClimateController = void 0;
const common_1 = require("@nestjs/common");
const climate_service_1 = require("./climate.service");
const swagger_1 = require("@nestjs/swagger");
let ClimateController = class ClimateController {
    climateService;
    constructor(climateService) {
        this.climateService = climateService;
    }
    create(createClimateDto) {
        return this.climateService.create(createClimateDto);
    }
    findAll() {
        return this.climateService.findAll();
    }
    findOne(id) {
        return this.climateService.findById(id);
    }
};
exports.ClimateController = ClimateController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new climate preset' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClimateController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all climate presets' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClimateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get climate by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClimateController.prototype, "findOne", null);
exports.ClimateController = ClimateController = __decorate([
    (0, swagger_1.ApiTags)('climate'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('climate'),
    __metadata("design:paramtypes", [climate_service_1.ClimateService])
], ClimateController);
//# sourceMappingURL=climate.controller.js.map