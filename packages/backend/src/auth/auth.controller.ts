import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { LoginPayload } from 'shared-types/src/user'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  async login(@Request() req): Promise<LoginPayload> {
    return await this.authService.login(req.user)
  }
}
