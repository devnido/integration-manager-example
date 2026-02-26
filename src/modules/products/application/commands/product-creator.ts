import { CreateProductCommand } from '../../domain/commands/create-product.command'
import { Inject } from '@nestjs/common'
import { UseCase } from 'src/base/lib/application/use-case.base'
import { PRODUCT_REMOTE_REPOSITORY_PORT } from '../../products-di.tokens'
import type { ProductRepositoryPort } from '../../domain/ports/product.repository.port'

export class ProductCreator implements UseCase<CreateProductCommand> {
  constructor(
    @Inject(PRODUCT_REMOTE_REPOSITORY_PORT)
    private readonly repository: ProductRepositoryPort,
  ) {}

  execute(input: CreateProductCommand): Promise<void> {
    return this.repository.create(input)
  }
}
