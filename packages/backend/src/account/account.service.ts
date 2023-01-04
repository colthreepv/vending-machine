import { Injectable } from '@nestjs/common'
import { Coins } from 'shared-types/src/crud'
import { UsersService } from 'src/users/users.service'
import { UserAccountService } from '../user-account/user-account.service'

@Injectable()
export class AccountService {
  constructor(private readonly userService: UsersService, private readonly userAccountService: UserAccountService) {}

  async deposit(username: string, coins: Coins): Promise<Coins> {
    const user = await this.userService.get(username)
    // never going to happen because its checked on the guard
    if (user == null) throw new Error('User not found')

    const newCoins = await this.userAccountService.depositAccount(username, coins)
    return newCoins
  }

  async buy(username: string, product: string, qty: number): Promise<void> {
    const user = await this.userService.get(username)
    // never going to happen because its checked on the guard
    if (user == null) throw new Error('User not found')
  }
}
