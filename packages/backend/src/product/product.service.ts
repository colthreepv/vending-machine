import { Injectable } from '@nestjs/common'
import { ProductCreatePayload, Product, ProductUpdatePayload } from 'shared-types/src/crud'
import { JwtUser } from 'shared-types/src/user'

const productStorage: Product[] = []

@Injectable()
export class ProductService {
  async get(id: string) {
    const product = productStorage.find((product) => product.name === id)

    return product
  }

  async create(product: ProductCreatePayload, user: JwtUser) {
    const newProduct: Product = { ...product, owner: user.username }
    productStorage.push(newProduct)
    return newProduct
  }

  async delete(id: string) {
    const idx = productStorage.findIndex((product) => product.name === id)
    productStorage.splice(idx, 1)
  }

  async update(id: string, product: ProductUpdatePayload) {
    const idx = productStorage.findIndex((product) => product.name === id)
    const formerProduct = productStorage[idx]
    const updatedProduct: Product = { ...formerProduct, price: product.price, quantity: product.quantity }
    productStorage.splice(idx, 1, updatedProduct)

    return product
  }

  async buy(id: string, qty: number) {
    const idx = productStorage.findIndex((product) => product.name === id)
    if (idx === -1) throw new Error('Product not found')
    const formerProduct = productStorage[idx]
    const updatedProduct: Product = { ...formerProduct, quantity: formerProduct.quantity - qty }
    productStorage.splice(idx, 1, updatedProduct)

    return updatedProduct
  }

  async list() {
    return productStorage
  }
}
