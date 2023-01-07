import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtUser } from 'shared-types/src/user'
import { UsersService } from 'src/users/users.service'
import Prando from 'prando'

interface LoginTrack {
  iterations: number
  lastId: string
}

@Injectable()
export class AuthService {
  private readonly trackLogins: Map<string, LoginTrack> = new Map<string, LoginTrack>()
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<JwtUser | null> {
    const user = await this.usersService.get(username)
    if (user != null && user.password === pass) {
      const { password, ...result } = user
      return result as JwtUser
    }
    return null
  }

  async login(user: JwtUser) {
    const rng = new Prando(user.username)
    // if user has previously logged in, skip ahead in the random number sequence
    const previous = this.trackLogins.get(user.username)
    let iterations = 0
    if (previous != null) {
      iterations = previous.iterations
      rng.skip(iterations)
    }

    const jti = rng.nextString(4)
    this.trackLogins.set(user.username, { iterations: ++iterations, lastId: jti })

    const payload = {
      sub: user.username,
      role: user.role,
      jti,
    }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async validateJwtId(jwtId: string, username: string): Promise<boolean> {
    const previous = this.trackLogins.get(username)
    if (previous == null) return false
    if (previous.lastId === jwtId) return true
    return false
  }
}
