import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { FirebaseAuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('signin')
  // async signin(@Body() login: LoginUserDto) {
  //   return this.authService.signIn(login.email, login.password);
  // }

  @Post('signup')
  async signup(@Body() createUser: CreateUserDto & { firebaseUid: string }) {
    return this.authService.signUp(createUser);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    // El usuario ya está validado por el guard y contiene la información correcta
    return req.user;
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('validate')
  async validateToken(@Req() req) {
    // Devuelve el usuario validado
    return {
      isValid: true,
      user: req.user
    };
  }
}
