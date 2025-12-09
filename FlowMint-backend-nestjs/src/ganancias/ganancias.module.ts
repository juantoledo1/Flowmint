import { Module } from '@nestjs/common';
import { GananciasController } from './ganancias.controller';
import { GananciasService } from './ganancias.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [GananciasController],
  providers: [GananciasService, PrismaService],
  exports: [GananciasService], // Exportar el servicio por si se necesita en otros módulos
})
export class GananciasModule {}