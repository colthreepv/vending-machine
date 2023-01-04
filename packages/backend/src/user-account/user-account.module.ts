import { Module } from '@nestjs/common'
import { UserAccountService } from './user-account.service'

@Module({
  providers: [UserAccountService],
  exports: [UserAccountService],
})
export class UserAccountModule {}
