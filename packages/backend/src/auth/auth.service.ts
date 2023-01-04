import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from 'shared-types/src/user'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOne(username)
    if (user != null && user.password === pass) {
      const { password, ...result } = user
      return result as User
    }
    return null
  }

  async login(user: User) {
    const payload = {
      sub: user.username,
      role: user.role,
    }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
