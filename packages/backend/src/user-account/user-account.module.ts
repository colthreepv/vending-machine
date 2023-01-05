import { Module } from '@nestjs/common'
import { UserAccountService } from './user-account.service'

// this module is required to break circular dependency
@Module({
  providers: [UserAccountService],
  exports: [UserAccountService],
})
export class UserAccountModule {}
