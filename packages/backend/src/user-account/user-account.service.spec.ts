import { Test, TestingModule } from '@nestjs/testing'
import { Coins } from 'shared-types/src/crud'
import { UserAccountService } from './user-account.service'

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
})
