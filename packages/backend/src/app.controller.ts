import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtUser } from 'shared-types/src/user'
import { AppService } from './app.service'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { RequestUser } from './auth/user.decorator'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getHelloProtected(@RequestUser() user: JwtUser) {
    return this.appService.getProtectedHello(user.username)
  }
}
