import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class TurnosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTurnoDto: CreateTurnoDto): import("@prisma/client").Prisma.Prisma__TurnoClient<{
        estado: string;
        servicio_id: number;
        empleado_id: number;
        cliente_id: number;
        fecha_hora: Date;
        turno_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        servicio: {
            nombre: string;
            descripcion: string | null;
            precio: number;
            duracion: number;
            servicio_id: number;
        };
        empleado: {
            nombre: string;
            apellido: string;
            puesto: string | null;
            empleado_id: number;
        };
        cliente: {
            nombre: string;
            apellido: string;
            telefono: string | null;
            email: string | null;
            cliente_id: number;
        };
    } & {
        estado: string;
        servicio_id: number;
        empleado_id: number;
        cliente_id: number;
        fecha_hora: Date;
        turno_id: number;
    })[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__TurnoClient<({
        servicio: {
            nombre: string;
            descripcion: string | null;
            precio: number;
            duracion: number;
            servicio_id: number;
        };
        empleado: {
            nombre: string;
            apellido: string;
            puesto: string | null;
            empleado_id: number;
        };
        cliente: {
            nombre: string;
            apellido: string;
            telefono: string | null;
            email: string | null;
            cliente_id: number;
        };
    } & {
        estado: string;
        servicio_id: number;
        empleado_id: number;
        cliente_id: number;
        fecha_hora: Date;
        turno_id: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateTurnoDto: UpdateTurnoDto): import("@prisma/client").Prisma.Prisma__TurnoClient<{
        estado: string;
        servicio_id: number;
        empleado_id: number;
        cliente_id: number;
        fecha_hora: Date;
        turno_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__TurnoClient<{
        estado: string;
        servicio_id: number;
        empleado_id: number;
        cliente_id: number;
        fecha_hora: Date;
        turno_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
