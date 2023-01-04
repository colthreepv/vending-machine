import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ProductModule } from './product/product.module'
import { AccountModule } from './account/account.module'
import { UserAccountModule } from './user-account/user-account.module';

@Module({
  imports: [AuthModule, UsersModule, ConfigModule.forRoot(), ProductModule, AccountModule, UserAccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
