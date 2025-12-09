import { IsString, IsNotEmpty, IsOptional, IsNumber, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServicioDto {
  @ApiProperty({ description: 'The name of the service.', example: 'Corte de Cabello' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    description: 'A brief description of the service.',
    example: 'Corte de cabello clásico para caballero.',
    required: false,
  })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ description: 'The price of the service.', example: 15.00 })
  @IsNumber()
  @IsNotEmpty()
  precio: number;

  @ApiProperty({
    description: 'The duration of the service in minutes.',
    example: 30,
  })
  @IsInt()
  @IsNotEmpty()
  duracion: number;
}
