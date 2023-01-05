import { Injectable } from '@nestjs/common'
import { Coins } from 'shared-types/src/crud'
import { Vault } from './vault'
import { freshAccount } from './vault.utils'

const VMAccounts = new Map<string, Coins>()

@Injectable()
export class UserAccountService {
  private readonly vault = new Vault()

  async createAccount(username: string): Promise<void> {
    VMAccounts.set(username, freshAccount())
  }

  async depositAccount(username: string, coins: Coins): Promise<Coins> {
    const account = VMAccounts.get(username)
    if (account == null) {
      throw new Error('Account not found')
    }

    const nextAccount = freshAccount()
    ;[5, 10, 20, 50, 100].forEach((coin) => {
      const prev = Number(account[coin]) ?? 0
      const actual = Number(coins[coin]) ?? 0
      nextAccount[coin] = prev + actual
    })

    VMAccounts.set(username, nextAccount)
    return nextAccount
  }

  async checkAccount(username: string): Promise<Coins> {
    const account = VMAccounts.get(username)
    if (account == null) {
      throw new Error('Account not found')
    }

    return account
  }
}
