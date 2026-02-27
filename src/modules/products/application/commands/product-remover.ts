import { UseCase } from 'src/base/lib/application/use-case.base'
import { RemoveProductCommand } from '../../domain/commands/remove-product.command'
import { Inject } from '@nestjs/common'
import { PRODUCT_EXTERNAL_SERVICE_ADAPTER } from '../../products-di.tokens'
import type { ProductRepositoryPort } from '../../domain/ports/product.repository.port'

export class ProductRemover implements UseCase<RemoveProductCommand> {
  constructor(
    @Inject(PRODUCT_EXTERNAL_SERVICE_ADAPTER)
    private readonly repository: ProductRepositoryPort,
  ) {}

  execute(input: RemoveProductCommand): Promise<void> {
    return this.repository.remove(input)
  }
}
