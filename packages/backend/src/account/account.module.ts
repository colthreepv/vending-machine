import { Module } from '@nestjs/common'
import { AccountService } from './account.service'
import { AccountController } from './account.controller'
import { UsersModule } from 'src/users/users.module'
import { UserAccountModule } from 'src/user-account/user-account.module'
import { ProductModule } from 'src/product/product.module'

@Module({
  providers: [AccountService],
  controllers: [AccountController],
  imports: [UsersModule, UserAccountModule, ProductModule],
})
export class AccountModule {}
