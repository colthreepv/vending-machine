import { Test, TestingModule } from '@nestjs/testing'
import { Coins, ProductCreatePayload } from 'shared-types/src/crud'
import { AuthUser } from 'shared-types/src/user'

import { ProductModule } from 'src/product/product.module'
import { ProductService } from 'src/product/product.service'
import { UsersModule } from 'src/users/users.module'
import { UsersService } from 'src/users/users.service'
import { AccountModule } from 'src/account/account.module'
import { AccountService } from 'src/account/account.service'
import { UserAccountModule } from 'src/user-account/user-account.module'

describe('Accounting integration test', () => {
  let accountService: AccountService
  let userService: UsersService
  let productModule: ProductService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService, UsersModule, ProductService],
      imports: [AccountModule, UsersModule, ProductModule, UserAccountModule],
    }).compile()

    accountService = module.get<AccountService>(AccountService)
    userService = module.get<UsersService>(UsersService)
    productModule = module.get<ProductService>(ProductService)
  })

  it('should be defined', () => {
    expect(accountService).toBeDefined()
    expect(userService).toBeDefined()
  })

  it('2 users, one buy a product from the other one', async () => {
    const seller: AuthUser = { username: 'seller01', role: 'seller', password: '123456' }
    const buyer: AuthUser = { username: 'buyer01', role: 'buyer', password: '123456' }
    await Promise.all([seller, buyer].map(async (user) => await userService.create(user)))

    const product: ProductCreatePayload = { name: 'product01', price: 80, quantity: 10 }
    await productModule.create(product, seller)

    const productList = await productModule.list()
    expect(productList.length).toBe(1)

    const buyerCoins: Coins = {
      '5': 3,
      '10': 0,
      '20': 0,
      '50': 2,
      '100': 0,
    }
    await accountService.deposit(buyer.username, buyerCoins)
    const restCoins = await accountService.buy(buyer.username, product.name, 1)

    expect(restCoins).toHaveProperty('spent', product.price)
    expect(restCoins).toHaveProperty('product', product.name)
    expect(restCoins).toHaveProperty('qty', 1)
    expect(restCoins).toHaveProperty('change', [1, 1, 1, 0, 0])

    const productListAfter = await productModule.list()
    expect(productListAfter.length).toBe(1)
    expect(productListAfter[0].quantity).toBe(9)
  })

  it('a user deposit coins and gets them back, without a purchase', async () => {
    const user: AuthUser = { username: 'user01', role: 'buyer', password: '123456' }
    await userService.create(user)

    const coins: Coins = {
      '5': 3,
      '10': 0,
      '20': 0,
      '50': 2,
      '100': 0,
    }
    await accountService.deposit(user.username, coins)
    const restCoins = await accountService.flush(user.username)

    expect(restCoins).toEqual(coins)
  })
})
