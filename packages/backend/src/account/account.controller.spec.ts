import { Test, TestingModule } from '@nestjs/testing'
import { ProductModule } from 'src/product/product.module'
import { UserAccountModule } from 'src/user-account/user-account.module'
import { UsersModule } from 'src/users/users.module'
import { AccountController } from './account.controller'
import { AccountService } from './account.service'

describe('AccountController', () => {
  let controller: AccountController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [AccountService],
      imports: [UsersModule, UserAccountModule, ProductModule],
    }).compile()

    controller = module.get<AccountController>(AccountController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
