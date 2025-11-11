import { Injectable } from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmpleadosService {
  constructor(private prisma: PrismaService) {}

  create(createEmpleadoDto: CreateEmpleadoDto) {
    return this.prisma.empleado.create({ data: createEmpleadoDto });
  }

  findAll() {
    return this.prisma.empleado.findMany();
  }

  findOne(id: number) {
    return this.prisma.empleado.findUnique({ where: { empleado_id: id } });
  }

  update(id: number, updateEmpleadoDto: UpdateEmpleadoDto) {
    return this.prisma.empleado.update({
      where: { empleado_id: id },
      data: updateEmpleadoDto,
    });
  }

  remove(id: number) {
    return this.prisma.empleado.delete({ where: { empleado_id: id } });
  }
}
