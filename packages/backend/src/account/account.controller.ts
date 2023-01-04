import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { Coins } from 'shared-types/src/crud'
import { JwtUser } from 'shared-types/src/user'
import { BuyPayload } from 'shared-types/src/account'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserRole } from 'src/auth/user-role.guard'
import { RequestUser } from 'src/auth/user.decorator'
import { AccountService } from './account.service'

@Controller('account')
export class AccountController {
  constructor(private readonly userService: AccountService) {}

  @Post('deposit')
  @UseGuards(JwtAuthGuard, new UserRole('buyer'))
  async deposit(@Body() body: Coins, @RequestUser() user: JwtUser) {
    return await this.userService.deposit(user.username, body)
  }

  @Post('buy')
  @UseGuards(JwtAuthGuard, new UserRole('buyer'))
  async buy(@Body() payload: BuyPayload, @RequestUser() user: JwtUser) {
    const { product, qty } = payload
    return await this.userService.buy(user.username, product, qty)
  }
}
