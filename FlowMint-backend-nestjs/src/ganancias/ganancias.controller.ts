import { Controller, Get, Query } from '@nestjs/common';
import { GananciasService } from './ganancias.service';

@Controller('ganancias')
export class GananciasController {
  constructor(private readonly gananciasService: GananciasService) {}

  @Get('diarias')
  getGananciasDiarias(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gananciasService.getGananciasDiarias(start, end);
  }

  @Get('semanales')
  getGananciasSemanales(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gananciasService.getGananciasSemanales(start, end);
  }

  @Get('mensuales')
  getGananciasMensuales(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gananciasService.getGananciasMensuales(start, end);
  }

  @Get('anuales')
  getGananciasAnuales(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gananciasService.getGananciasAnuales(start, end);
  }

  @Get('mensuales-por-servicio')
  getGananciasMensualesPorServicio(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gananciasService.getGananciasMensualesPorServicio(start, end);
  }

  @Get('anuales-por-servicio')
  getGananciasAnualesPorServicio(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gananciasService.getGananciasAnualesPorServicio(start, end);
  }

  @Get('mensuales-por-empleado')
  getGananciasMensualesPorEmpleado(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gananciasService.getGananciasMensualesPorEmpleado(start, end);
  }

  @Get('anuales-por-empleado')
  getGananciasAnualesPorEmpleado(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gananciasService.getGananciasAnualesPorEmpleado(start, end);
  }

  @Get('resumen')
  getResumenGanancias(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gananciasService.getResumenGanancias(start, end);
  }
}