"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenomeModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const genome_controller_1 = require("./genome.controller");
const genome_service_1 = require("./genome.service");
const genome_schema_1 = require("./schemas/genome.schema");
const thermal_module_1 = require("../thermal/thermal.module");
let GenomeModule = class GenomeModule {
};
exports.GenomeModule = GenomeModule;
exports.GenomeModule = GenomeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: genome_schema_1.ThermalGenome.name, schema: genome_schema_1.ThermalGenomeSchema },
                { name: genome_schema_1.GenomeRun.name, schema: genome_schema_1.GenomeRunSchema },
            ]),
            thermal_module_1.ThermalModule,
        ],
        controllers: [genome_controller_1.GenomeController],
        providers: [genome_service_1.GenomeService],
        exports: [genome_service_1.GenomeService],
    })
], GenomeModule);
//# sourceMappingURL=genome.module.js.map