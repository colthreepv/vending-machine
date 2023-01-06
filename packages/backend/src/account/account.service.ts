import { Injectable } from '@nestjs/common'
import { BuyResponse, Change } from 'shared-types/src/account'
import { Coins } from 'shared-types/src/crud'
import { ProductService } from 'src/product/product.service'
import { fromCoinsToNumber } from 'src/user-account/vault.utils'
import { UsersService } from 'src/users/users.service'
import { UserAccountService } from '../user-account/user-account.service'

@Injectable()
export class AccountService {
  constructor(
    private readonly userService: UsersService,
    private readonly userAccountService: UserAccountService,
    private readonly productService: ProductService,
  ) {}

  async deposit(username: string, coins: Coins): Promise<Coins> {
    const user = await this.userService.get(username)
    // never going to happen because its checked on the guard
    if (user == null) throw new Error('User not found')

    const newCoins = await this.userAccountService.depositAccount(username, coins)
    return newCoins
  }

  async buy(username: string, productId: string, qty: number): Promise<BuyResponse> {
    const user = await this.userService.get(username)
    // never going to happen because its checked on the guard
    if (user == null) throw new Error('User not found')

    const product = await this.productService.get(productId)
    if (product == null) throw new Error('Product not found')
    if (product.quantity < qty) throw new Error('Insufficient product quantity')

    const amount = product.price * qty

    const userBalance = fromCoinsToNumber(await this.userAccountService.checkAccount(username))
    if (userBalance < amount) throw new Error('Insufficient user balance')

    const restCoins = await this.userAccountService.buy(username, amount)

    const change: Change = [
      restCoins['5'] ?? 0,
      restCoins['10'] ?? 0,
      restCoins['20'] ?? 0,
      restCoins['50'] ?? 0,
      restCoins['100'] ?? 0,
    ]

    const response: BuyResponse = {
      spent: amount,
      product: productId,
      qty,
      change,
    }
    return response
  }

  async flush(username: string): Promise<Coins> {
    const user = await this.userService.get(username)
    // never going to happen because its checked on the guard
    if (user == null) throw new Error('User not found')

    const coins = await this.userAccountService.flushAccount(username)
    return coins
  }
}
