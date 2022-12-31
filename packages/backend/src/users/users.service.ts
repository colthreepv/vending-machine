import { Injectable } from '@nestjs/common'
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
}
