import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GananciasService {
  constructor(private prisma: PrismaService) {}

  async getGananciasDiarias(startDate?: Date, endDate?: Date) {
    const whereClause = {
      estado: 'confirmado', // Solo turnos confirmados generan ingresos
      ...(startDate && endDate && {
        fecha_hora: {
          gte: startDate,
          lte: endDate,
        },
      }),
    };

    const turnos = await this.prisma.turno.findMany({
      where: whereClause,
      include: {
        servicio: true,
      },
    });

    // Agrupar por fecha
    const gananciasPorFecha = turnos.reduce((acc, turno) => {
      const fecha = turno.fecha_hora.toISOString().split('T')[0]; // YYYY-MM-DD
      if (!acc[fecha]) {
        acc[fecha] = { fecha: new Date(fecha), total: 0 };
      }
      acc[fecha].total += turno.servicio.precio;
      return acc;
    }, {});

    return Object.values(gananciasPorFecha)
      .sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }

  async getGananciasSemanales(startDate?: Date, endDate?: Date) {
    const whereClause = {
      estado: 'confirmado',
      ...(startDate && endDate && {
        fecha_hora: {
          gte: startDate,
          lte: endDate,
        },
      }),
    };

    const turnos = await this.prisma.turno.findMany({
      where: whereClause,
      include: {
        servicio: true,
      },
    });

    // Agrupar por semana (número de semana del año)
    const gananciasPorSemana = turnos.reduce((acc, turno) => {
      const fecha = new Date(turno.fecha_hora);
      const primerDiaAnio = new Date(fecha.getFullYear(), 0, 1);
      const numeroSemana = Math.ceil(((fecha.getTime() - primerDiaAnio.getTime()) / 86400000 + primerDiaAnio.getDay() + 1) / 7);

      const semanaKey = `${fecha.getFullYear()}-W${numeroSemana.toString().padStart(2, '0')}`;
      
      if (!acc[semanaKey]) {
        acc[semanaKey] = { 
          año: fecha.getFullYear(), 
          semana: numeroSemana, 
          total: 0 
        };
      }
      acc[semanaKey].total += turno.servicio.precio;
      return acc;
    }, {});

    return Object.values(gananciasPorSemana)
      .sort((a: any, b: any) => (a.año - b.año) * 100 + (a.semana - b.semana));
  }

  async getGananciasMensuales(startDate?: Date, endDate?: Date) {
    const whereClause = {
      estado: 'confirmado',
      ...(startDate && endDate && {
        fecha_hora: {
          gte: startDate,
          lte: endDate,
        },
      }),
    };

    const turnos = await this.prisma.turno.findMany({
      where: whereClause,
      include: {
        servicio: true,
      },
    });

    // Agrupar por mes y año
    const gananciasPorMes = turnos.reduce((acc, turno) => {
      const fecha = new Date(turno.fecha_hora);
      const mesKey = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!acc[mesKey]) {
        acc[mesKey] = { 
          año: fecha.getFullYear(), 
          mes: fecha.getMonth() + 1, 
          total: 0 
        };
      }
      acc[mesKey].total += turno.servicio.precio;
      return acc;
    }, {});

    return Object.values(gananciasPorMes)
      .sort((a: any, b: any) => (a.año - b.año) * 100 + (a.mes - b.mes));
  }

  async getGananciasAnuales(startDate?: Date, endDate?: Date) {
    const whereClause = {
      estado: 'confirmado',
      ...(startDate && endDate && {
        fecha_hora: {
          gte: startDate,
          lte: endDate,
        },
      }),
    };

    const turnos = await this.prisma.turno.findMany({
      where: whereClause,
      include: {
        servicio: true,
      },
    });

    // Agrupar por año
    const gananciasPorAnio = turnos.reduce((acc, turno) => {
      const fecha = new Date(turno.fecha_hora);
      const anio = fecha.getFullYear();
      
      if (!acc[anio]) {
        acc[anio] = { año: anio, total: 0 };
      }
      acc[anio].total += turno.servicio.precio;
      return acc;
    }, {});

    return Object.values(gananciasPorAnio)
      .sort((a: any, b: any) => a.año - b.año);
  }

  async getGananciasMensualesPorServicio(startDate?: Date, endDate?: Date) {
    const whereClause = {
      estado: 'confirmado',
      ...(startDate && endDate && {
        fecha_hora: {
          gte: startDate,
          lte: endDate,
        },
      }),
    };

    const turnos = await this.prisma.turno.findMany({
      where: whereClause,
      include: {
        servicio: true,
      },
    });

    // Agrupar por mes y servicio
    const gananciasPorMesServicio = turnos.reduce((acc, turno) => {
      const fecha = new Date(turno.fecha_hora);
      const mesKey = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
      const key = `${mesKey}-${turno.servicio.servicio_id}`;
      
      if (!acc[key]) {
        acc[key] = { 
          año: fecha.getFullYear(), 
          mes: fecha.getMonth() + 1,
          servicio_id: turno.servicio.servicio_id,
          servicio: turno.servicio.nombre,
          total: 0 
        };
      }
      acc[key].total += turno.servicio.precio;
      return acc;
    }, {});

    return Object.values(gananciasPorMesServicio)
      .sort((a: any, b: any) => 
        (a.año - b.año) * 100 + (a.mes - b.mes) || (a.servicio_id - b.servicio_id)
      );
  }

  async getGananciasAnualesPorServicio(startDate?: Date, endDate?: Date) {
    const whereClause = {
      estado: 'confirmado',
      ...(startDate && endDate && {
        fecha_hora: {
          gte: startDate,
          lte: endDate,
        },
      }),
    };

    const turnos = await this.prisma.turno.findMany({
      where: whereClause,
      include: {
        servicio: true,
      },
    });

    // Agrupar por año y servicio
    const gananciasPorAnioServicio = turnos.reduce((acc, turno) => {
      const fecha = new Date(turno.fecha_hora);
      const key = `${fecha.getFullYear()}-${turno.servicio.servicio_id}`;
      
      if (!acc[key]) {
        acc[key] = { 
          año: fecha.getFullYear(), 
          servicio_id: turno.servicio.servicio_id,
          servicio: turno.servicio.nombre,
          total: 0 
        };
      }
      acc[key].total += turno.servicio.precio;
      return acc;
    }, {});

    return Object.values(gananciasPorAnioServicio)
      .sort((a: any, b: any) => 
        (a.año - b.año) * 100 + (a.servicio_id - b.servicio_id)
      );
  }

  async getGananciasMensualesPorEmpleado(startDate?: Date, endDate?: Date) {
    const whereClause = {
      estado: 'confirmado',
      ...(startDate && endDate && {
        fecha_hora: {
          gte: startDate,
          lte: endDate,
        },
      }),
    };

    const turnos = await this.prisma.turno.findMany({
      where: whereClause,
      include: {
        servicio: true,
        empleado: true,
      },
    });

    // Agrupar por mes y empleado
    const gananciasPorMesEmpleado = turnos.reduce((acc, turno) => {
      const fecha = new Date(turno.fecha_hora);
      const mesKey = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
      const key = `${mesKey}-${turno.empleado.empleado_id}`;
      
      if (!acc[key]) {
        acc[key] = { 
          año: fecha.getFullYear(), 
          mes: fecha.getMonth() + 1,
          empleado_id: turno.empleado.empleado_id,
          empleado: turno.empleado.nombre + ' ' + turno.empleado.apellido,
          total: 0 
        };
      }
      acc[key].total += turno.servicio.precio;
      return acc;
    }, {});

    return Object.values(gananciasPorMesEmpleado)
      .sort((a: any, b: any) => 
        (a.año - b.año) * 100 + (a.mes - b.mes) || (a.empleado_id - b.empleado_id)
      );
  }

  async getGananciasAnualesPorEmpleado(startDate?: Date, endDate?: Date) {
    const whereClause = {
      estado: 'confirmado',
      ...(startDate && endDate && {
        fecha_hora: {
          gte: startDate,
          lte: endDate,
        },
      }),
    };

    const turnos = await this.prisma.turno.findMany({
      where: whereClause,
      include: {
        servicio: true,
        empleado: true,
      },
    });

    // Agrupar por año y empleado
    const gananciasPorAnioEmpleado = turnos.reduce((acc, turno) => {
      const fecha = new Date(turno.fecha_hora);
      const key = `${fecha.getFullYear()}-${turno.empleado.empleado_id}`;
      
      if (!acc[key]) {
        acc[key] = { 
          año: fecha.getFullYear(), 
          empleado_id: turno.empleado.empleado_id,
          empleado: turno.empleado.nombre + ' ' + turno.empleado.apellido,
          total: 0 
        };
      }
      acc[key].total += turno.servicio.precio;
      return acc;
    }, {});

    return Object.values(gananciasPorAnioEmpleado)
      .sort((a: any, b: any) => 
        (a.año - b.año) * 100 + (a.empleado_id - b.empleado_id)
      );
  }

  async getResumenGanancias(startDate?: Date, endDate?: Date) {
    const whereClause = {
      estado: 'confirmado',
      ...(startDate && endDate && {
        fecha_hora: {
          gte: startDate,
          lte: endDate,
        },
      }),
    };

    const turnos = await this.prisma.turno.findMany({
      where: whereClause,
      include: {
        servicio: true,
      },
    });

    const total = turnos.reduce((sum, turno) => sum + turno.servicio.precio, 0);
    
    // Calcular promedio por día si hay un rango de fechas
    let promedioPorDia = 0;
    if (startDate && endDate) {
      const dias = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      promedioPorDia = dias > 0 ? total / dias : 0;
    } else {
      // Si no hay rango, calcular promedio de los últimos 30 días
      const hoy = new Date();
      const hace30Dias = new Date(hoy);
      hace30Dias.setDate(hace30Dias.getDate() - 30);
      
      const turnosRecientes = await this.prisma.turno.findMany({
        where: {
          estado: 'confirmado',
          fecha_hora: {
            gte: hace30Dias,
          },
        },
        include: {
          servicio: true,
        },
      });
      
      const totalReciente = turnosRecientes.reduce((sum, turno) => sum + turno.servicio.precio, 0);
      promedioPorDia = 30 > 0 ? totalReciente / 30 : 0;
    }

    return {
      total,
      promedioPorDia,
      totalTurnos: turnos.length,
    };
  }
}