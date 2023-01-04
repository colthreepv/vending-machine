import { Injectable } from '@nestjs/common'
import { User } from 'shared-types/src/user'

export interface Product {
  name: string
  owner: string // username
}

const productStorage: Product[] = []

@Injectable()
export class ProductService {
  async get(id: string) {
    const product = productStorage.find((product) => product.name === id)

    return product
  }

  async create(product: Product, user: User) {
    const newProduct: Product = {
      name: product.name,
      owner: user.username,
    }
    productStorage.push(newProduct)
    return newProduct
  }

  async delete(id: string) {
    const idx = productStorage.findIndex((product) => product.name === id)
    productStorage.splice(idx, 1)
  }

  async update(id: string, product: Product) {
    const idx = productStorage.findIndex((product) => product.name === id)
    productStorage.splice(idx, 1, product)

    return product
  }

  async list() {
    return productStorage
  }
}
