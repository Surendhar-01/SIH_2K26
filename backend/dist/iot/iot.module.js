"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoTModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const iot_service_1 = require("./iot.service");
const iot_controller_1 = require("./iot.controller");
const iot_schema_1 = require("./schemas/iot.schema");
let IoTModule = class IoTModule {
};
exports.IoTModule = IoTModule;
exports.IoTModule = IoTModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: iot_schema_1.SensorReading.name, schema: iot_schema_1.SensorReadingSchema },
            ]),
        ],
        controllers: [iot_controller_1.IoTController],
        providers: [iot_service_1.IoTService],
    })
], IoTModule);
//# sourceMappingURL=iot.module.js.map