import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user and return JWT token',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        user: {
          type: 'object',
          properties: {
            usuario_id: { type: 'number', example: 1 },
            nombre: { type: 'string', example: 'Admin' },
            apellido: { type: 'string', example: 'Sistema' },
            user: { type: 'string', example: 'admin' },
            rol_id: { type: 'number', example: 1 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    console.log('Direct login endpoint called with:', loginDto);
    const user = await this.authService.validateUser(loginDto.user, loginDto.pass);
    if (!user) {
      console.log('Direct login - user validation failed');
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log('Direct login - user validated successfully, generating token');
    return this.authService.login(user);
  }

  @Post('debug-login')
  async debugLogin(@Query('username') username: string, @Query('password') password: string) {
    console.log('Debug login endpoint called with:', { username, password });
    const user = await this.authService.validateUser(username, password);
    return {
      userFound: !!user,
      userId: user?.usuario_id,
      userName: user?.user,
      message: user ? 'User validated successfully' : 'User validation failed'
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Get authenticated user profile information',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        usuario_id: { type: 'number', example: 1 },
        nombre: { type: 'string', example: 'Admin' },
        apellido: { type: 'string', example: 'Sistema' },
        user: { type: 'string', example: 'admin' },
        correo: { type: 'string', example: 'admin@flowmint.com' },
        rol_id: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req) {
    return req.user;
  }
}
