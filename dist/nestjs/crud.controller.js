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
exports.CrudController = void 0;
const common_1 = require("@nestjs/common");
class CrudController {
    constructor(service) {
        this.service = service;
        this.pk = this.service.getPK();
    }
    async items(query) {
        const items = await this.service.getItems({
            query,
        });
        return {
            status: true,
            data: {
                items: items,
            },
        };
    }
    async item(id) {
        const item = await this.service.findOne({
            where: {
                [this.pk]: id,
            },
        });
        return {
            status: true,
            data: {
                item: item,
            },
        };
    }
    async create(data) {
        const item = await this.service.create(data);
        return {
            status: true,
            data: {
                item: item,
            },
        };
    }
    async update(id, data) {
        const item = await this.service.update(id, data);
        return {
            status: true,
            data: {
                item: item,
            },
        };
    }
    async delete(id) {
        const result = await this.service.delete({
            [this.pk]: id,
        });
        return {
            status: true,
            data: {
                result: result,
            },
        };
    }
}
exports.CrudController = CrudController;
__decorate([
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "items", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "item", null);
__decorate([
    (0, common_1.Post)('/create'),
    __param(0, (0, common_1.Body)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('/update'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_1.Body)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('/delete'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "delete", null);
//# sourceMappingURL=crud.controller.js.map