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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialSchema = exports.Material = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Material = class Material {
    name;
    category;
    thermalConductivity;
    density;
    specificHeat;
    emissivity;
    solarAbsorptivity;
    defaultThickness;
    costPerUnit;
    source;
};
exports.Material = Material;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Material.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Material.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Material.prototype, "thermalConductivity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Material.prototype, "density", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Material.prototype, "specificHeat", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: Number }),
    __metadata("design:type", Number)
], Material.prototype, "emissivity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: Number }),
    __metadata("design:type", Number)
], Material.prototype, "solarAbsorptivity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: Number }),
    __metadata("design:type", Number)
], Material.prototype, "defaultThickness", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: Number }),
    __metadata("design:type", Number)
], Material.prototype, "costPerUnit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Material.prototype, "source", void 0);
exports.Material = Material = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Material);
exports.MaterialSchema = mongoose_1.SchemaFactory.createForClass(Material);
//# sourceMappingURL=material.schema.js.map