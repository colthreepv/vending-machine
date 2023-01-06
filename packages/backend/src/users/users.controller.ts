import { Body, Controller, Post } from '@nestjs/common'
import { AuthUser } from 'shared-types/src/user'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() body: AuthUser) {
    return await this.userService.create(body)
  }
}
