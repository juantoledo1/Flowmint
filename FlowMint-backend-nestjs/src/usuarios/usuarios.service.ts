import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.pass, 10);
    const { pass, ...result } = await this.prisma.usuario.create({
      data: {
        ...createUsuarioDto,
        pass: hashedPassword,
      },
    });
    return result;
  }

  async findAll() {
    const users = await this.prisma.usuario.findMany();
    return users.map(({ pass, ...rest }) => rest);
  }

  async findOne(id: number) {
    const user = await this.prisma.usuario.findUnique({ where: { usuario_id: id } });
    if (user) {
      const { pass, ...rest } = user;
      return rest;
    }
    return null;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    if (updateUsuarioDto.pass) {
      updateUsuarioDto.pass = await bcrypt.hash(updateUsuarioDto.pass, 10);
    }
    const { pass, ...result } = await this.prisma.usuario.update({
      where: { usuario_id: id },
      data: updateUsuarioDto,
    });
    return result;
  }

  remove(id: number) {
    return this.prisma.usuario.delete({ where: { usuario_id: id } });
  }

  async findByUsername(username: string) {
    console.log('Buscando usuario con username:', username);
    const user = await this.prisma.usuario.findUnique({ where: { user: username } });
    console.log('Usuario encontrado:', user ? { usuario_id: user.usuario_id, user: user.user, hasPass: !!user.pass } : 'No encontrado');
    return user;
  }
}
