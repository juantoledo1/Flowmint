import { IsNotEmpty, IsOptional, IsInt, IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTurnoDto {
  @ApiProperty({
    description: 'The date and time of the appointment in ISO 8601 format.',
    example: '2025-12-01T15:30:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  fecha_hora: Date;

  @ApiProperty({
    description: 'The status of the appointment.',
    example: 'pendiente',
    required: false,
  })
  @IsString()
  @IsOptional()
  estado?: string;

  @ApiProperty({ description: 'The ID of the client.', example: 1 })
  @IsInt()
  @IsNotEmpty()
  cliente_id: number;

  @ApiProperty({ description: 'The ID of the employee.', example: 1 })
  @IsInt()
  @IsNotEmpty()
  empleado_id: number;

  @ApiProperty({ description: 'The ID of the service.', example: 1 })
  @IsInt()
  @IsNotEmpty()
  servicio_id: number;
}
