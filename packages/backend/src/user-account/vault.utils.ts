import { Coins } from 'shared-types/src/crud'
import { Vault } from './vault'

export const freshAccount = (): Coins => ({
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

export const calculateRest = (vault: Vault, rest: number): Coins => {
  const newCoins = freshAccount()
  let remaining = rest

  const vaultCoins = vault.check()

  for (const coinValue of [100, 50, 20, 10, 5]) {
    const availableCoins = vaultCoins[coinValue] ?? 0
    if (availableCoins === 0) continue

    const amountTaken = Math.min(availableCoins, Math.floor(remaining / coinValue))
    remaining -= amountTaken * coinValue
    newCoins[coinValue] = amountTaken
    if (remaining <= 0) break
  }

  return newCoins
}

// from a Coin object spend a specified amount and return the leftover coins
export const spendCoins = (coins: Coins, amount: number, vault: Vault): Coins => {
  const total = fromCoinsToNumber(coins)
  if (total < amount) {
    throw new Error('Not enough coins')
  }

  vault.deposit(coins)

  const restToGive = total - amount
  const restCoins = calculateRest(vault, restToGive)
  vault.withdraw(restCoins)

  return restCoins
}
