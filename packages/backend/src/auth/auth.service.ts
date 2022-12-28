import { Injectable } from '@nestjs/common'
import { User } from 'shared-types/src/user'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOne(username)
    if (user != null && user.password === pass) {
      const { password, ...result } = user
      return result as User
    }
    return null
  }
}
