import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signin(@Body() dto: SignInDto) {
    return await this.authService.signin(dto);
  }

  @Get('me')
  async getMe(@Headers('authorization') authHeader: string) {
    return this.authService.getMe(authHeader);
  }
}
