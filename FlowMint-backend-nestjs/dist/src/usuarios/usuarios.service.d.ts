import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UsuariosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUsuarioDto: CreateUsuarioDto): Promise<{
        nombre: string;
        rol_id: number;
        apellido: string;
        dni: string | null;
        user: string;
        correo: string | null;
        estado: string;
        usuario_id: number;
    }>;
    findAll(): Promise<{
        nombre: string;
        rol_id: number;
        apellido: string;
        dni: string | null;
        user: string;
        correo: string | null;
        estado: string;
        usuario_id: number;
    }[]>;
    findOne(id: number): Promise<{
        nombre: string;
        rol_id: number;
        apellido: string;
        dni: string | null;
        user: string;
        correo: string | null;
        estado: string;
        usuario_id: number;
    } | null>;
    update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<{
        nombre: string;
        rol_id: number;
        apellido: string;
        dni: string | null;
        user: string;
        correo: string | null;
        estado: string;
        usuario_id: number;
    }>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__UsuarioClient<{
        nombre: string;
        rol_id: number;
        apellido: string;
        dni: string | null;
        user: string;
        pass: string;
        correo: string | null;
        estado: string;
        usuario_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByUsername(username: string): Promise<{
        nombre: string;
        rol_id: number;
        apellido: string;
        dni: string | null;
        user: string;
        pass: string;
        correo: string | null;
        estado: string;
        usuario_id: number;
    } | null>;
}
