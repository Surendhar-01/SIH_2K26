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
exports.IoTController = void 0;
const common_1 = require("@nestjs/common");
const iot_service_1 = require("./iot.service");
const swagger_1 = require("@nestjs/swagger");
let IoTController = class IoTController {
    iotService;
    constructor(iotService) {
        this.iotService = iotService;
    }
    logReading(body) {
        return this.iotService.logReading(body);
    }
    getReadings(deviceId, limit) {
        return this.iotService.getReadingsByDevice(deviceId, limit || 24);
    }
};
exports.IoTController = IoTController;
__decorate([
    (0, common_1.Post)('readings'),
    (0, swagger_1.ApiOperation)({
        summary: 'Ingest hardware telemetry payload from ESP32/Sensors',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IoTController.prototype, "logReading", null);
__decorate([
    (0, common_1.Get)('devices/:id/readings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get latest readings for a given device id to map Digital Twin',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], IoTController.prototype, "getReadings", null);
exports.IoTController = IoTController = __decorate([
    (0, swagger_1.ApiTags)('iot'),
    (0, common_1.Controller)('iot'),
    __metadata("design:paramtypes", [iot_service_1.IoTService])
], IoTController);
//# sourceMappingURL=iot.controller.js.map