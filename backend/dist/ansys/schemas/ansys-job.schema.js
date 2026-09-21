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
exports.AnsysJobSchema = exports.AnsysJob = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AnsysJob = class AnsysJob {
    status;
    shelterId;
    exportFilePath;
    results;
};
exports.AnsysJob = AnsysJob;
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['QUEUED', 'PREPARING', 'RUNNING', 'COMPLETED', 'FAILED'],
        default: 'QUEUED',
    }),
    __metadata("design:type", String)
], AnsysJob.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Shelter', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AnsysJob.prototype, "shelterId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], AnsysJob.prototype, "exportFilePath", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: false }),
    __metadata("design:type", Object)
], AnsysJob.prototype, "results", void 0);
exports.AnsysJob = AnsysJob = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], AnsysJob);
exports.AnsysJobSchema = mongoose_1.SchemaFactory.createForClass(AnsysJob);
//# sourceMappingURL=ansys-job.schema.js.map