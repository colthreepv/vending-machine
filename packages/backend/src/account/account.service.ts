import { Injectable } from '@nestjs/common'
import { Coins } from 'shared-types/src/crud'
import { UsersService } from 'src/users/users.service'
import { fromCoinsToNumber } from '../user-account/user-account.service'

@Injectable()
export class AccountService {
  constructor(private readonly userService: UsersService) {}

  async deposit(username: string, coins: Coins): Promise<number> {
    const user = await this.userService.get(username)

    // never going to happen because its checked on the guard
    if (user == null) throw new Error('User not found')

    user.balance += fromCoinsToNumber(coins)
    return user.balance
  }
}