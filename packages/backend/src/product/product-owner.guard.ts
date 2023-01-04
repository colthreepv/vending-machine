import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtUser } from 'shared-types/src/user'
import { ProductService } from './product.service'

@Injectable()
export class IsProductOwner implements CanActivate {
  constructor(private readonly productService: ProductService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user as JwtUser
    if (user == null) return false

    const id = request.params.id
    const product = await this.productService.get(id)
    if (product == null) return false

    return product.owner === user.username
  }
}
