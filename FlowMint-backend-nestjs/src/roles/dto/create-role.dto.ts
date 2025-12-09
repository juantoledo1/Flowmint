import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: 'The name of the role.', example: 'Administrador' })
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
