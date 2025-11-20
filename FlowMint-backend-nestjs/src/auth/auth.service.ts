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
    console.log('AuthService.validateUser - username:', username);
    const user = await this.usuariosService.findByUsername(username);
    console.log('AuthService.validateUser - user from service:', user ? { usuario_id: user.usuario_id, user: user.user } : null);

    if (user) {
      console.log('Comparando contraseña...');
      const isMatch = await bcrypt.compare(pass, user.pass);
      console.log('Contraseña coincide:', isMatch);
      if (isMatch) {
        const { pass: userPass, ...result } = user;
        console.log('Usuario validado exitosamente:', { usuario_id: result.usuario_id, user: result.user });
        return result;
      }
    }

    console.log('Usuario no encontrado o contraseña incorrecta');
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
