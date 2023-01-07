import { Test, TestingModule } from '@nestjs/testing'
import { ProductModule } from 'src/product/product.module'
import { UserAccountModule } from 'src/user-account/user-account.module'
import { UsersModule } from 'src/users/users.module'
import { AccountService } from './account.service'

describe('AccountService', () => {
  let service: AccountService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService],
      imports: [UsersModule, UserAccountModule, ProductModule],
    }).compile()

    service = module.get<AccountService>(AccountService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
