import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { JwtUser } from 'shared-types/src/user'

@Injectable()
export class UserRole implements CanActivate {
  constructor(private readonly role: string) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user as JwtUser
    if (user == null) return false

    return user.role === this.role
  }
}
