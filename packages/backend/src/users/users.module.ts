import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { UserAccountModule } from 'src/user-account/user-account.module'

@Module({
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
  imports: [UserAccountModule],
})
export class UsersModule {}
