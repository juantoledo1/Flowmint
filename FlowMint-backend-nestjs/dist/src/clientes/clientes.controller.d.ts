import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
export declare class ClientesController {
    private readonly clientesService;
    constructor(clientesService: ClientesService);
    create(createClienteDto: CreateClienteDto): import("@prisma/client").Prisma.Prisma__ClienteClient<{
        nombre: string;
        apellido: string;
        telefono: string | null;
        email: string | null;
        cliente_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        apellido: string;
        telefono: string | null;
        email: string | null;
        cliente_id: number;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__ClienteClient<{
        nombre: string;
        apellido: string;
        telefono: string | null;
        email: string | null;
        cliente_id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateClienteDto: UpdateClienteDto): import("@prisma/client").Prisma.Prisma__ClienteClient<{
        nombre: string;
        apellido: string;
        telefono: string | null;
        email: string | null;
        cliente_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__ClienteClient<{
        nombre: string;
        apellido: string;
        telefono: string | null;
        email: string | null;
        cliente_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
