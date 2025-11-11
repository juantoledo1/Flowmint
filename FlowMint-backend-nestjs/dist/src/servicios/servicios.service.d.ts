import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class ServiciosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createServicioDto: CreateServicioDto): import("@prisma/client").Prisma.Prisma__ServicioClient<{
        nombre: string;
        descripcion: string | null;
        precio: number;
        duracion: number;
        servicio_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        descripcion: string | null;
        precio: number;
        duracion: number;
        servicio_id: number;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__ServicioClient<{
        nombre: string;
        descripcion: string | null;
        precio: number;
        duracion: number;
        servicio_id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateServicioDto: UpdateServicioDto): import("@prisma/client").Prisma.Prisma__ServicioClient<{
        nombre: string;
        descripcion: string | null;
        precio: number;
        duracion: number;
        servicio_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__ServicioClient<{
        nombre: string;
        descripcion: string | null;
        precio: number;
        duracion: number;
        servicio_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
