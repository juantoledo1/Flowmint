import { IsString, IsNotEmpty, IsEmail, IsOptional, IsInt, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsString()
  @IsOptional()
  dni?: string;

  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  pass: string;

  @IsEmail()
  @IsOptional()
  correo?: string;

  @IsInt()
  @IsOptional()
  rol_id?: number;
}
