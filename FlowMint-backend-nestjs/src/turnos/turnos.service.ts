import { Injectable, ConflictException } from '@nestjs/common';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TurnosService {
  constructor(private prisma: PrismaService) {}

  private async checkAvailability(
    empleado_id: number,
    fecha_hora: Date,
    servicio_id: number,
    turno_id?: number,
  ) {
    const servicio = await this.prisma.servicio.findUnique({
      where: { servicio_id },
    });
    if (!servicio) {
      throw new ConflictException('El servicio especificado no existe.');
    }

    const newTurnoStartTime = new Date(fecha_hora);
    const newTurnoEndTime = new Date(
      newTurnoStartTime.getTime() + servicio.duracion * 60000,
    );

    // Get all appointments for the employee on the same day to check for overlaps in code.
    // This is more robust than a complex Prisma query.
    const dayStart = new Date(newTurnoStartTime);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(newTurnoStartTime);
    dayEnd.setHours(23, 59, 59, 999);

    const turnosDelDia = await this.prisma.turno.findMany({
      where: {
        empleado_id,
        estado: { not: 'cancelado' }, // Ignore cancelled appointments
        turno_id: { not: turno_id }, // Exclude the current turno when updating
        fecha_hora: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      include: {
        servicio: true,
      },
    });
    
    // Now, check for overlaps in the application logic
    for (const turno of turnosDelDia) {
      const existingStartTime = new Date(turno.fecha_hora);
      const existingEndTime = new Date(
        existingStartTime.getTime() + turno.servicio.duracion * 60000,
      );

      // Standard overlap condition: (StartA < EndB) and (EndA > StartB)
      if (
        existingStartTime < newTurnoEndTime &&
        existingEndTime > newTurnoStartTime
      ) {
        throw new ConflictException(
          `El empleado ya tiene un turno programado (${
            turno.servicio.nombre
          } a las ${existingStartTime.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}) que se superpone con este horario.`,
        );
      }
    }
  }

  async create(createTurnoDto: CreateTurnoDto) {
    await this.checkAvailability(
      createTurnoDto.empleado_id,
      createTurnoDto.fecha_hora,
      createTurnoDto.servicio_id,
    );
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

  async update(id: number, updateTurnoDto: UpdateTurnoDto) {
    const turnoActual = await this.prisma.turno.findUnique({ where: { turno_id: id } });
    if (!turnoActual) {
      throw new ConflictException('El turno que intenta actualizar no existe.');
    }

    const empleado_id = updateTurnoDto.empleado_id ?? turnoActual.empleado_id;
    const fecha_hora = updateTurnoDto.fecha_hora ?? turnoActual.fecha_hora;
    const servicio_id = updateTurnoDto.servicio_id ?? turnoActual.servicio_id;

    await this.checkAvailability(
      empleado_id,
      fecha_hora,
      servicio_id,
      id,
    );

    return this.prisma.turno.update({
      where: { turno_id: id },
      data: updateTurnoDto,
    });
  }

  remove(id: number) {
    return this.prisma.turno.delete({ where: { turno_id: id } });
  }
}
