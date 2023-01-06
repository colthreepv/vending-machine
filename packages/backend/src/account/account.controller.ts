import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  PreconditionFailedException,
  UseGuards,
} from '@nestjs/common'
import { Coins } from 'shared-types/src/crud'
import { JwtUser } from 'shared-types/src/user'
import { BuyPayload } from 'shared-types/src/account'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserRole } from 'src/auth/user-role.guard'
import { RequestUser } from 'src/auth/user.decorator'
import { AccountService } from './account.service'

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('deposit')
  @UseGuards(JwtAuthGuard, new UserRole('buyer'))
  async deposit(@Body() body: Coins, @RequestUser() user: JwtUser) {
    return await this.accountService.deposit(user.username, body)
  }

  @Post('buy')
  @UseGuards(JwtAuthGuard, new UserRole('buyer'))
  async buy(@Body() payload: BuyPayload, @RequestUser() user: JwtUser) {
    const { product, qty } = payload
    try {
      return await this.accountService.buy(user.username, product, qty)
    } catch (error) {
      // this is not the best way to handle errors
      if (error.message === 'Insufficient user balance') throw new PreconditionFailedException(error.message)
      if (error.message === 'Insufficient product quantity') throw new PreconditionFailedException(error.message)
      if (error.message === 'Product not found') throw new PreconditionFailedException(error.message)
      throw new InternalServerErrorException(error)
    }
  }

  @Post('reset')
  @UseGuards(JwtAuthGuard, new UserRole('buyer'))
  async reset(@RequestUser() user: JwtUser) {
    try {
      return await this.accountService.flush(user.username)
    } catch (error) {
      if (error.message === 'User not found') throw new PreconditionFailedException(error.message)
    }
  }
}
