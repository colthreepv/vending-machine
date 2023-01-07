import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ProductCreatePayload, ProductUpdatePayload } from 'shared-types/src/crud'
import { JwtUser } from 'shared-types/src/user'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserRole } from 'src/auth/user-role.guard'
import { RequestUser } from 'src/auth/user.decorator'
import { IsProductOwner } from './product-owner.guard'
import { ProductService } from './product.service'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async listProducts() {
    return await this.productService.list()
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    const product = await this.productService.get(id)
    if (product == null) throw new NotFoundException('Product not found')

    return product
  }

  @Post()
  @UseGuards(JwtAuthGuard, new UserRole('seller'))
  async createProduct(@Body() product: ProductCreatePayload, @RequestUser() user: JwtUser) {
    const previous = await this.productService.get(product.name)
    if (previous != null) throw new ConflictException('Product already exists')

    return await this.productService.create(product, user)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, new UserRole('seller'), IsProductOwner)
  async updateProduct(@Param('id') id: string, @Body() product: ProductUpdatePayload) {
    const oldProduct = await this.productService.get(id)
    if (oldProduct == null) throw new NotFoundException('Product not found')

    return await this.productService.update(id, product)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, new UserRole('seller'), IsProductOwner)
  async deleteProduct(@Param('id') id: string) {
    const product = await this.productService.get(id)
    if (product == null) throw new NotFoundException('Product not found')

    await this.productService.delete(id)

    return { msg: 'ok' }
  }
}
