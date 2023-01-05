import { Coins } from 'shared-types/src/crud'
import { Vault } from './vault'
import { spendCoins } from './vault.utils'

describe('vault', () => {
  let vault: Vault
  beforeEach(() => {
    vault = new Vault()
  })

  it('given a set amount of coins deposited, user spend some #1', () => {
    const coins: Coins = {
      '5': 4, // 5 * 4 = 20
      '10': 0,
      '20': 2, // 20 * 2 = 40
      '50': 0,
      '100': 1, // 100 * 1 = 100
    } // 160

    const restCoins = spendCoins(coins, 125, vault)

    expect(restCoins['5']).toBe(1)
    expect(restCoins['10']).toBe(1)
    expect(restCoins['20']).toBe(1)
    expect(restCoins['50']).toBe(0)
    expect(restCoins['100']).toBe(0)
  })

  it('given a set amount of coins deposited, user spend some #2', () => {
    const coins: Coins = {
      '5': 2, // 10
      '10': 0,
      '20': 0,
      '50': 1, // 50
      '100': 1, // 100
    } // 160
    const restCoins = spendCoins(coins, 115, vault)

    expect(restCoins['5']).toBe(1)
    expect(restCoins['10']).toBe(0)
    expect(restCoins['20']).toBe(2)
    expect(restCoins['50']).toBe(0)
    expect(restCoins['100']).toBe(0)
  })

  it('given a weird balance in Vault, cannot give out proper rest', () => {
    const v2 = new Vault({
      '5': 0,
      '10': 0,
      '20': 4, // 80
      '50': 2, // 100
      '100': 0,
    }) // 180

    const coins: Coins = {
      '5': 0,
      '10': 0,
      '20': 0,
      '50': 0,
      '100': 3, // 300
    } // 300

    const restCoins = spendCoins(coins, 185, v2)

    // expected missing 15
    expect(restCoins['5']).toBe(0)
    expect(restCoins['10']).toBe(0)
    expect(restCoins['20']).toBe(0)
    expect(restCoins['50']).toBe(0)
    expect(restCoins['100']).toBe(1)

    const v = v2.check()
    expect(v['20']).toBe(4)
    expect(v['50']).toBe(2)
    expect(v['100']).toBe(2)
  })
})
