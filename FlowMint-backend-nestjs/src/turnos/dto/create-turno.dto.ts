import { IsString, IsNotEmpty, IsOptional, IsInt, IsDateString } from 'class-validator';

export class CreateTurnoDto {
  @IsDateString()
  @IsNotEmpty()
  fecha_hora: Date;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsInt()
  @IsNotEmpty()
  cliente_id: number;

  @IsInt()
  @IsNotEmpty()
  empleado_id: number;

  @IsInt()
  @IsNotEmpty()
  servicio_id: number;
}
