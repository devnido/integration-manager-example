import { UpdateProductCommand } from '../../domain/commands/update-product.command'
import { Inject } from '@nestjs/common'
import { PRODUCT_EXTERNAL_SERVICE_ADAPTER } from '../../products-di.tokens'
import type { ProductRepositoryPort } from '../../domain/ports/product.repository.port'
import { UseCase } from 'src/base/lib/application/use-case.base'

export class ProductUpdater implements UseCase<UpdateProductCommand> {
  constructor(
    @Inject(PRODUCT_EXTERNAL_SERVICE_ADAPTER)
    private readonly repository: ProductRepositoryPort,
  ) {}

  execute(input: UpdateProductCommand): Promise<void> {
    return this.repository.update(input)
  }
}
