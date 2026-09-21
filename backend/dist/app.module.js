"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const materials_module_1 = require("./materials/materials.module");
const climate_module_1 = require("./climate/climate.module");
const shelters_module_1 = require("./shelters/shelters.module");
const thermal_module_1 = require("./thermal/thermal.module");
const optimization_module_1 = require("./optimization/optimization.module");
const comparison_module_1 = require("./comparison/comparison.module");
const pcm_module_1 = require("./pcm/pcm.module");
const iot_module_1 = require("./iot/iot.module");
const ansys_module_1 = require("./ansys/ansys.module");
const reports_module_1 = require("./reports/reports.module");
const genome_module_1 = require("./genome/genome.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            materials_module_1.MaterialsModule,
            climate_module_1.ClimateModule,
            shelters_module_1.SheltersModule,
            thermal_module_1.ThermalModule,
            optimization_module_1.OptimizationModule,
            comparison_module_1.ComparisonModule,
            pcm_module_1.PcmModule,
            iot_module_1.IoTModule,
            ansys_module_1.AnsysModule,
            reports_module_1.ReportsModule,
            genome_module_1.GenomeModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map