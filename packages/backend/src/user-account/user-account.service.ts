import { Injectable } from '@nestjs/common'
import { Coins } from 'shared-types/src/crud'

const VMAccounts = new Map<string, Coins>()

const freshAccount = (): Coins => ({
  '5': 0,
  '10': 0,
  '20': 0,
  '50': 0,
  '100': 0,
})

export const fromCoinsToNumber = (coins: Coins): number => {
  return (
    (coins['5'] ?? 0 * 5) +
    (coins['10'] ?? 0 * 10) +
    (coins['20'] ?? 0 * 20) +
    (coins['50'] ?? 0 * 50) +
    (coins['100'] ?? 0 * 100)
  )
}

// export const spendCoins = (coins: Coins, amount: number): Coins => {}

@Injectable()
export class UserAccountService {
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
}
