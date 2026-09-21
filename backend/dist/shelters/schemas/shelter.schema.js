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
exports.ShelterSchema = exports.Shelter = exports.OpeningSchema = exports.Opening = exports.WallAssemblySchema = exports.WallAssembly = exports.LayerSchema = exports.Layer = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Layer = class Layer {
    materialId;
    thickness;
};
exports.Layer = Layer;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Material', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Layer.prototype, "materialId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Layer.prototype, "thickness", void 0);
exports.Layer = Layer = __decorate([
    (0, mongoose_1.Schema)()
], Layer);
exports.LayerSchema = mongoose_1.SchemaFactory.createForClass(Layer);
let WallAssembly = class WallAssembly {
    name;
    layers;
    totalRValue;
    uValue;
};
exports.WallAssembly = WallAssembly;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WallAssembly.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.LayerSchema], default: [] }),
    __metadata("design:type", Array)
], WallAssembly.prototype, "layers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], WallAssembly.prototype, "totalRValue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], WallAssembly.prototype, "uValue", void 0);
exports.WallAssembly = WallAssembly = __decorate([
    (0, mongoose_1.Schema)()
], WallAssembly);
exports.WallAssemblySchema = mongoose_1.SchemaFactory.createForClass(WallAssembly);
let Opening = class Opening {
    type;
    width;
    height;
    uValue;
    shgc;
    orientation;
};
exports.Opening = Opening;
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Window', 'Door'] }),
    __metadata("design:type", String)
], Opening.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Opening.prototype, "width", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Opening.prototype, "height", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Opening.prototype, "uValue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: Number }),
    __metadata("design:type", Number)
], Opening.prototype, "shgc", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Opening.prototype, "orientation", void 0);
exports.Opening = Opening = __decorate([
    (0, mongoose_1.Schema)()
], Opening);
exports.OpeningSchema = mongoose_1.SchemaFactory.createForClass(Opening);
let Shelter = class Shelter {
    name;
    length;
    width;
    height;
    orientationAngle;
    wallAssemblies;
    openings;
    occupancyCount;
};
exports.Shelter = Shelter;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Shelter.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Shelter.prototype, "length", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Shelter.prototype, "width", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Shelter.prototype, "height", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Shelter.prototype, "orientationAngle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.WallAssemblySchema], default: [] }),
    __metadata("design:type", Array)
], Shelter.prototype, "wallAssemblies", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.OpeningSchema], default: [] }),
    __metadata("design:type", Array)
], Shelter.prototype, "openings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: Number }),
    __metadata("design:type", Number)
], Shelter.prototype, "occupancyCount", void 0);
exports.Shelter = Shelter = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Shelter);
exports.ShelterSchema = mongoose_1.SchemaFactory.createForClass(Shelter);
//# sourceMappingURL=shelter.schema.js.map