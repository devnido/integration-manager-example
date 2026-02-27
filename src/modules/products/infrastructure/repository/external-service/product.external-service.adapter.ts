import { ProductRepositoryPort } from 'src/modules/products/domain/ports/product.repository.port'
import { FindProductByIdQuery } from 'src/modules/products/domain/queries/find-product-by-id.query'
import { FindAllProductsQuery } from 'src/modules/products/domain/queries/find-all-products.query'
import { CreateProductCommand } from 'src/modules/products/domain/commands/create-product.command'
import { UpdateProductCommand } from 'src/modules/products/domain/commands/update-product.command'
import { RemoveProductCommand } from 'src/modules/products/domain/commands/remove-product.command'
import { Product } from 'src/modules/products/domain/entities/product'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ProductExternalServiceAdapter implements ProductRepositoryPort {
  constructor() {}

  async findById(query: FindProductByIdQuery): Promise<Product | null> {
    console.log('findById', query)
    return null
  }

  async findAll(query: FindAllProductsQuery): Promise<Product[]> {
    console.log('findAll', query)
    return []
  }

  async create(command: CreateProductCommand): Promise<void> {
    console.log('create', command)
  }

  async update(command: UpdateProductCommand): Promise<void> {
    console.log('update', command)
  }

  async remove(command: RemoveProductCommand): Promise<void> {
    console.log('remove', command)
  }
}
