import { Injectable } from '@nestjs/common'
import { Coins, ValidCoin } from 'shared-types/src/crud'
import { Vault } from './vault'
import { freshAccount, spendCoins } from './vault.utils'

@Injectable()
export class UserAccountService {
  private readonly vault = new Vault()
  private readonly accounts = new Map<string, Coins>()

  async createAccount(username: string): Promise<void> {
    this.accounts.set(username, freshAccount())
  }

  async depositAccount(username: string, coins: Coins): Promise<Coins> {
    const account = this.accounts.get(username)
    if (account == null) {
      throw new Error('Account not found')
    }

    const nextAccount = freshAccount()
    ;['5', '10', '20', '50', '100'].forEach((coin: ValidCoin) => {
      const prev = account[coin]
      const actual = coins[coin]
      nextAccount[coin] = prev + actual
    })

    this.accounts.set(username, nextAccount)
    return nextAccount
  }

  async checkAccount(username: string): Promise<Coins> {
    const account = this.accounts.get(username)
    if (account == null) {
      throw new Error('Account not found')
    }

    return account
  }

  async spend(username: string, amount: number): Promise<Coins> {
    const account = this.accounts.get(username)
    if (account == null) {
      throw new Error('Account not found')
    }

    const change = spendCoins(account, amount, this.vault)
    await this.flushAccount(username)

    return change
  }

  async flushAccount(username: string): Promise<Coins> {
    const account = this.accounts.get(username)
    if (account == null) {
      throw new Error('Account not found')
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const coins = this.accounts.get(username)!
    this.accounts.delete(username)

    return coins
  }
}
