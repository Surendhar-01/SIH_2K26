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
exports.AnsysController = void 0;
const common_1 = require("@nestjs/common");
const ansys_service_1 = require("./ansys.service");
const swagger_1 = require("@nestjs/swagger");
let AnsysController = class AnsysController {
    ansysService;
    constructor(ansysService) {
        this.ansysService = ansysService;
    }
    createJob(body) {
        return this.ansysService.createJob(body.shelterId);
    }
    runJob(jobId) {
        return this.ansysService.processJob(jobId);
    }
    getJob(jobId) {
        return this.ansysService.getJob(jobId);
    }
};
exports.AnsysController = AnsysController;
__decorate([
    (0, common_1.Post)('jobs'),
    (0, swagger_1.ApiOperation)({ summary: 'Creates a new async ANSYS validation job' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnsysController.prototype, "createJob", null);
__decorate([
    (0, common_1.Post)('jobs/:id/run'),
    (0, swagger_1.ApiOperation)({
        summary: 'Processes the ANSYS APDL export generation adapter',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnsysController.prototype, "runJob", null);
__decorate([
    (0, common_1.Get)('jobs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ANSYS job status' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnsysController.prototype, "getJob", null);
exports.AnsysController = AnsysController = __decorate([
    (0, swagger_1.ApiTags)('ansys'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('ansys'),
    __metadata("design:paramtypes", [ansys_service_1.AnsysService])
], AnsysController);
//# sourceMappingURL=ansys.controller.js.map