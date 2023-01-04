import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtUser } from 'shared-types/src/user'

export const RequestUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.user as JwtUser
})
