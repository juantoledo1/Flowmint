import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'user', passReqToCallback: false });
  }

  async validate(user: string, pass: string): Promise<any> {
    console.log('LocalStrategy validate called with user:', user);
    const validatedUser = await this.authService.validateUser(user, pass);
    console.log('LocalStrategy validate - validatedUser result:', validatedUser ? { usuario_id: validatedUser.usuario_id, user: validatedUser.user } : 'null');

    if (!validatedUser) {
      console.log('LocalStrategy validate - throwing UnauthorizedException');
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('LocalStrategy validate - returning validated user');
    return validatedUser;
  }
}
