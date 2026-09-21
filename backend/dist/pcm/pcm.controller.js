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
exports.PcmController = void 0;
const common_1 = require("@nestjs/common");
const pcm_service_1 = require("./pcm.service");
const swagger_1 = require("@nestjs/swagger");
let PcmController = class PcmController {
    pcmService;
    constructor(pcmService) {
        this.pcmService = pcmService;
    }
    create(createPcmDto) {
        return this.pcmService.create(createPcmDto);
    }
    findAll() {
        return this.pcmService.findAll();
    }
};
exports.PcmController = PcmController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Inject new Phase Change Material (PCM) into DB' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PcmController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch all PCMs' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PcmController.prototype, "findAll", null);
exports.PcmController = PcmController = __decorate([
    (0, swagger_1.ApiTags)('pcm'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('pcm'),
    __metadata("design:paramtypes", [pcm_service_1.PcmService])
], PcmController);
//# sourceMappingURL=pcm.controller.js.map