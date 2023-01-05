import { Injectable } from '@nestjs/common'
import { JwtUser } from 'shared-types/src/user'

export interface Product {
  name: string
  owner: string // username
  price: number // value is expressed in cents, ex: 1000 = 10.00
  quantity: number
}

const productStorage: Product[] = []

@Injectable()
export class ProductService {
  async get(id: string) {
    const product = productStorage.find((product) => product.name === id)

    return product
  }

  async create(product: Product, user: JwtUser) {
    const newProduct: Product = { ...product, owner: user.username }
    productStorage.push(newProduct)
    return newProduct
  }

  async delete(id: string) {
    const idx = productStorage.findIndex((product) => product.name === id)
    productStorage.splice(idx, 1)
  }

  async update(id: string, product: Product) {
    const idx = productStorage.findIndex((product) => product.name === id)
    const formerProduct = productStorage[idx]
    const updatedProduct: Product = { ...formerProduct, price: product.price, quantity: product.quantity }
    productStorage.splice(idx, 1, updatedProduct)

    return product
  }

  async list() {
    return productStorage
  }
}
