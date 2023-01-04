import { Test, TestingModule } from '@nestjs/testing'
import { Coins } from 'shared-types/src/crud'
import { fastSpendCoins, simpleSpendCoins, spendCoins, UserAccountService } from './user-account.service'

describe('UserAccountService support functions', () => {
  it('given a set amount of coins deposit, user spend an amount that can generate a rest with its given coins', async () => {
    const coins: Coins = {
      '5': 4, // 5 * 4 = 20
      '10': 0,
      '20': 2, // 20 * 2 = 40
      '50': 0,
      '100': 1, // 100 * 1 = 100
    } // 160

    // REST solution could be
    // (a) { '5': 3, '10': 0, '20': 1, '50': 0, '100': 0 }
    // (b) { '5': 1, '10': 1, '20': 1, '50': 0, '100': 0 }
    // but I would prefer (a), so fastSpendCoins does that
    const { partialRest, remaining } = fastSpendCoins(coins, 125)

    expect(partialRest['5']).toBe(3)
    expect(partialRest['10']).toBe(0)
    expect(partialRest['20']).toBe(1)
    expect(partialRest['50']).toBe(0)
    expect(partialRest['100']).toBe(0)
    expect(remaining).toBe(0)
  })

  it('given a set amount of coins deposit, user spend an amount that needs another iteration to generate a proper rest', async () => {
    const coins: Coins = {
      '5': 2, // 10
      '10': 0,
      '20': 0,
      '50': 1, // 50
      '100': 1, // 100
    } // 160
    const { partialRest, remaining } = fastSpendCoins(coins, 115)

    expect(partialRest['5']).toBe(0)
    expect(partialRest['10']).toBe(0)
    expect(partialRest['20']).toBe(0)
    expect(partialRest['50']).toBe(1)
    expect(partialRest['100']).toBe(0)
    expect(remaining).toBe(5)
  })

  it.only('user spend an amount that needs another iteration to generate a proper rest', () => {
    const coins: Coins = {
      '5': 2, // 10
      '10': 0,
      '20': 0,
      '50': 1, // 50
      '100': 1, // 100
    } // 160
    const { partialRest, remaining } = fastSpendCoins(coins, 115)

    expect(partialRest['5']).toBe(0)
    expect(partialRest['10']).toBe(0)
    expect(partialRest['20']).toBe(0)
    expect(partialRest['50']).toBe(1)
    expect(partialRest['100']).toBe(0)
    expect(remaining).toBe(5)

    const restCoins = simpleSpendCoins(partialRest, remaining)
    expect(restCoins['5']).toBe(1)
    expect(restCoins['20']).toBe(2)
  })

  it('same case as before but with spendCoins', () => {
    const coins: Coins = {
      '5': 2, // 10
      '10': 0,
      '20': 0,
      '50': 1, // 50
      '100': 1, // 100
    } // 160
    const restCoins = spendCoins(coins, 115)
    console.log({ restCoins })
    expect(restCoins['5']).toBe(1)
    expect(restCoins['10']).toBe(0)
    expect(restCoins['20']).toBe(2)
    expect(restCoins['50']).toBe(0)
    expect(restCoins['100']).toBe(0)
  })
})

describe('UserAccountService', () => {
  let service: UserAccountService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAccountService],
    }).compile()

    service = module.get<UserAccountService>(UserAccountService)

    await service.createAccount('user1')
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('given a set of coins, user can deposit them', async () => {
    const coins: Coins = {
      '5': 4, // 5 * 4 = 20
      '10': 0,
      '20': 2, // 20 * 2 = 40
      '50': 0,
      '100': 1, // 100 * 1 = 100
    } // 160
    await service.depositAccount('user1', coins)

    const returnCoins = await service.checkAccount('user1')
    expect(returnCoins).toEqual(coins)
  })

  // it('given a previous deposit, user can spend coins', async () => {
})
