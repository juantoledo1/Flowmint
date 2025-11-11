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
exports.TurnosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TurnosService = class TurnosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createTurnoDto) {
        return this.prisma.turno.create({ data: createTurnoDto });
    }
    findAll() {
        return this.prisma.turno.findMany({
            include: {
                cliente: true,
                empleado: true,
                servicio: true,
            },
        });
    }
    findOne(id) {
        return this.prisma.turno.findUnique({
            where: { turno_id: id },
            include: {
                cliente: true,
                empleado: true,
                servicio: true,
            },
        });
    }
    update(id, updateTurnoDto) {
        return this.prisma.turno.update({
            where: { turno_id: id },
            data: updateTurnoDto,
        });
    }
    remove(id) {
        return this.prisma.turno.delete({ where: { turno_id: id } });
    }
};
exports.TurnosService = TurnosService;
exports.TurnosService = TurnosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TurnosService);
//# sourceMappingURL=turnos.service.js.map