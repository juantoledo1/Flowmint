import { Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usuariosService.findByUsername(username);

    if (user && (await bcrypt.compare(pass, user.pass))) {
      const { pass: userPass, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { username: user.user, sub: user.usuario_id };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }
}
