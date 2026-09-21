"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheltersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const shelters_service_1 = require("./shelters.service");
const shelters_controller_1 = require("./shelters.controller");
const shelter_schema_1 = require("./schemas/shelter.schema");
let SheltersModule = class SheltersModule {
};
exports.SheltersModule = SheltersModule;
exports.SheltersModule = SheltersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: shelter_schema_1.Shelter.name, schema: shelter_schema_1.ShelterSchema }]),
        ],
        controllers: [shelters_controller_1.SheltersController],
        providers: [shelters_service_1.SheltersService],
        exports: [shelters_service_1.SheltersService],
    })
], SheltersModule);
//# sourceMappingURL=shelters.module.js.map