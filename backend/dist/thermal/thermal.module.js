"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThermalModule = void 0;
const common_1 = require("@nestjs/common");
const thermal_service_1 = require("./thermal.service");
const thermal_controller_1 = require("./thermal.controller");
let ThermalModule = class ThermalModule {
};
exports.ThermalModule = ThermalModule;
exports.ThermalModule = ThermalModule = __decorate([
    (0, common_1.Module)({
        controllers: [thermal_controller_1.ThermalController],
        providers: [thermal_service_1.ThermalService],
        exports: [thermal_service_1.ThermalService],
    })
], ThermalModule);
//# sourceMappingURL=thermal.module.js.map