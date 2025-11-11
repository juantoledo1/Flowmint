import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class EmpleadosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createEmpleadoDto: CreateEmpleadoDto): import("@prisma/client").Prisma.Prisma__EmpleadoClient<{
        nombre: string;
        apellido: string;
        puesto: string | null;
        empleado_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        apellido: string;
        puesto: string | null;
        empleado_id: number;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__EmpleadoClient<{
        nombre: string;
        apellido: string;
        puesto: string | null;
        empleado_id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateEmpleadoDto: UpdateEmpleadoDto): import("@prisma/client").Prisma.Prisma__EmpleadoClient<{
        nombre: string;
        apellido: string;
        puesto: string | null;
        empleado_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__EmpleadoClient<{
        nombre: string;
        apellido: string;
        puesto: string | null;
        empleado_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
