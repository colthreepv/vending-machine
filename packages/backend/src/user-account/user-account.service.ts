import { Injectable } from '@nestjs/common'
import { Coins } from 'shared-types/src/crud'

const VMAccounts = new Map<string, Coins>()

const unlimitedVault: Coins = {
  '5': 999,
  '10': 999,
  '20': 999,
  '50': 999,
  '100': 999,
}

const freshAccount = (): Coins => ({
  '5': 0,
  '10': 0,
  '20': 0,
  '50': 0,
  '100': 0,
})

export const fromCoinsToNumber = (coins: Coins): number => {
  return (
    (coins['5'] ?? 0) * 5 +
    (coins['10'] ?? 0) * 10 +
    (coins['20'] ?? 0) * 20 +
    (coins['50'] ?? 0) * 50 +
    (coins['100'] ?? 0) * 100
  )
}

export const sumCoins = (coin0: Coins, coin1: Coins) => {
  const newCoins = freshAccount()
  for (const coinValue of [100, 50, 20, 10, 5]) {
    newCoins[coinValue] = Number(coin0[coinValue] ?? 0) + Number(coin1[coinValue] ?? 0)
  }
  return newCoins
}

// tries to spend the coins matching them by coinvalue, top -> bottom
export const fastSpendCoins = (coins: Coins, amount: number): { partialRest: Coins; remaining: number } => {
  let remaining = amount
  const partialRest = freshAccount()

  for (const coinValue of [100, 50, 20, 10, 5]) {
    const availableCoins = coins[coinValue] ?? 0
    if (availableCoins === 0) continue

    const amountTaken = Math.min(availableCoins, Math.floor(remaining / coinValue))
    console.log({
      coinValue,
      availableCoins,
      amountTaken,
      val: Math.floor(remaining / coinValue),
    })
    remaining -= amountTaken * coinValue
    partialRest[coinValue] = availableCoins - amountTaken
    if (remaining <= 0) break
  }

  return { partialRest, remaining }
}

export const restFromVault = (vault: Coins, rest: number): Coins => {
  const newCoins = freshAccount()
  let remaining = rest

  for (const coinValue of [100, 50, 20, 10, 5]) {
    const availableCoins = vault[coinValue] ?? 0
    if (availableCoins === 0) continue

    const amountTaken = Math.min(availableCoins, Math.floor(remaining / coinValue))
    remaining -= amountTaken * coinValue
    newCoins[coinValue] = amountTaken
    if (remaining <= 0) break
  }

  return newCoins
}

// from a Coin object spend a specified amount and return the leftover coins
export const simpleSpendCoins = (coins: Coins, amount: number): Coins => {
  const total = fromCoinsToNumber(coins)
  if (total < amount) {
    throw new Error('Not enough coins')
  }

  const restToGive = total - amount
  return restFromVault(unlimitedVault, restToGive)
}

// returns the rest, or an error
export const spendCoins = (coins: Coins, amount: number): Coins => {
  const total = fromCoinsToNumber(coins)
  if (total < amount) {
    throw new Error('Not enough coins')
  }
  const { partialRest: newCoins, remaining } = fastSpendCoins(coins, amount)

  if (remaining === 0) return newCoins
  return sumCoins(newCoins, restFromVault(unlimitedVault, remaining))
}

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

  async checkAccount(username: string): Promise<Coins> {
    const account = VMAccounts.get(username)
    if (account == null) {
      throw new Error('Account not found')
    }

    return account
  }
}
