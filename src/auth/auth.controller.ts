import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BaseResultType } from 'src/common/type/base-result.type';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {

    return BaseResultType.successResult({
      result: await this.authService.login(req.user),
      message: 'Login Success.'
    })
  }
}
