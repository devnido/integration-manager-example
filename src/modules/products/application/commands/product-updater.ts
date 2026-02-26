import { UpdateProductCommand } from '../../domain/commands/update-product.command'
import { Inject } from '@nestjs/common'
import { PRODUCT_REMOTE_REPOSITORY_PORT } from '../../products-di.tokens'
import type { ProductRepositoryPort } from '../../domain/ports/product.repository.port'
import { UseCase } from 'src/base/lib/application/use-case.base'

export class ProductUpdater implements UseCase<UpdateProductCommand> {
  constructor(
    @Inject(PRODUCT_REMOTE_REPOSITORY_PORT)
    private readonly repository: ProductRepositoryPort,
  ) {}

  execute(input: UpdateProductCommand): Promise<void> {
    return this.repository.update(input)
  }
}
