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

@Injectable()
export class UserAccountService {
  async createAccount(username: string): Promise<void> {
    VMAccounts.set(username, freshAccount())
  }
}
