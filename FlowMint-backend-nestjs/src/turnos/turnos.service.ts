import { Injectable } from '@nestjs/common';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TurnosService {
  constructor(private prisma: PrismaService) {}

  create(createTurnoDto: CreateTurnoDto) {
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

  findOne(id: number) {
    return this.prisma.turno.findUnique({
      where: { turno_id: id },
      include: {
        cliente: true,
        empleado: true,
        servicio: true,
      },
    });
  }

  update(id: number, updateTurnoDto: UpdateTurnoDto) {
    return this.prisma.turno.update({
      where: { turno_id: id },
      data: updateTurnoDto,
    });
  }

  remove(id: number) {
    return this.prisma.turno.delete({ where: { turno_id: id } });
  }
}
