import { Injectable } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServiciosService {
  constructor(private prisma: PrismaService) {}

  create(createServicioDto: CreateServicioDto) {
    return this.prisma.servicio.create({ data: createServicioDto });
  }

  findAll() {
    return this.prisma.servicio.findMany();
  }

  findOne(id: number) {
    return this.prisma.servicio.findUnique({ where: { servicio_id: id } });
  }

  update(id: number, updateServicioDto: UpdateServicioDto) {
    return this.prisma.servicio.update({
      where: { servicio_id: id },
      data: updateServicioDto,
    });
  }

  remove(id: number) {
    return this.prisma.servicio.delete({ where: { servicio_id: id } });
  }
}
