import { CreateProductCommand } from '../commands/create-product.command'
import { RemoveProductCommand } from '../commands/remove-product.command'
import { UpdateProductCommand } from '../commands/update-product.command'
import { Product } from '../entities/product'
import { FindAllProductsQuery } from '../queries/find-all-products.query'
import { FindProductByIdQuery } from '../queries/find-product-by-id.query'

export interface ProductRepositoryPort {
  findById(query: FindProductByIdQuery): Promise<Product | null>
  findAll(query: FindAllProductsQuery): Promise<Product[]>
  create(command: CreateProductCommand): Promise<void>
  update(command: UpdateProductCommand): Promise<void>
  remove(command: RemoveProductCommand): Promise<void>
}
