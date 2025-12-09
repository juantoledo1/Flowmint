import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmpleadoDto {
  @ApiProperty({ description: 'The first name of the employee.', example: 'Maria' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'The last name of the employee.', example: 'Gonzalez' })
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiProperty({
    description: 'The position or role of the employee.',
    example: 'Estilista Senior',
    required: false,
  })
  @IsString()
  @IsOptional()
  puesto?: string;
}
