import { ConflictException, Injectable } from '@nestjs/common'
import { AuthUser } from 'shared-types/src/user'
import { UserAccountService } from 'src/user-account/user-account.service'

const users: AuthUser[] = []

const admin: AuthUser = {
  username: 'admin',
  password: 'admin',
  deposit: 1000,
  role: 'seller',
}

@Injectable()
export class UsersService {
  constructor(private readonly userAccountService: UserAccountService) {
    void this.init()
  }

  async init() {
    await this.create(admin)
  }

  async get(username: string): Promise<AuthUser | undefined> {
    return users.find((user) => user.username === username)
  }

  async create(user: AuthUser): Promise<AuthUser> {
    const existingUser = await this.get(user.username)
    if (existingUser != null) {
      throw new ConflictException('User already exists')
    }

    users.push(user)
    await this.userAccountService.createAccount(user.username)
    return user
  }
}
