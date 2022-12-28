import { Module } from '@nestjs/common'
import { UsersModule } from 'src/users/users.module'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { LocalStrategy } from './local.strategy'

@Module({
  imports: [UsersModule],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
