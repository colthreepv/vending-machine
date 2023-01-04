import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtUser } from 'shared-types/src/user'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super()
  }

  async validate(username: string, password: string): Promise<JwtUser> {
    const user = await this.authService.validateUser(username, password)
    if (user == null) {
      throw new UnauthorizedException()
    }
    return user
  }
}
