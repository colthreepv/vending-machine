import { ConflictException, Injectable } from '@nestjs/common'
import { AuthUser } from 'shared-types/src/user'

const builtInUsers: AuthUser[] = [
  {
    username: 'admin',
    password: 'admin',
    deposit: 1000,
    role: 'seller',
  },
]

@Injectable()
export class UsersService {
  async findOne(username: string): Promise<AuthUser | undefined> {
    return builtInUsers.find((user) => user.username === username)
  }

  async create(user: AuthUser): Promise<AuthUser> {
    const existingUser = await this.findOne(user.username)
    if (existingUser != null) {
      throw new ConflictException('User already exists')
    }

    builtInUsers.push(user)
    return user
  }
}
