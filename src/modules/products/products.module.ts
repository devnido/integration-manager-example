import { Module } from '@nestjs/common'
import { FindProductByIdHttpController } from './interface/controllers/find-product-by-id/find-product-by-id.http.controller'
import { FindAllProductsHttpController } from './interface/controllers/find-all-products/find-all-products.http.controller'
import { ProductCreator } from './application/commands/product-creator'
import { ProductUpdater } from './application/commands/product-updater'
import { ProductRemover } from './application/commands/product-remover'
import { ProductByIdFinder } from './application/queries/product-by-id-finder'
import { ProductsFinder } from './application/queries/products-finder'
import { PRODUCT_EXTERNAL_SERVICE_ADAPTER } from './products-di.tokens'
import { CreateProductSQSConsumer } from './interface/consumer/create-product/create-product.sqs.consumer'
import { ProductExternalServiceAdapter } from './infrastructure/repository/external-service/product.external-service.adapter'

@Module({
  imports: [],
  controllers: [FindProductByIdHttpController, FindAllProductsHttpController],
  providers: [
    ProductCreator,
    ProductUpdater,
    ProductRemover,
    ProductByIdFinder,
    ProductsFinder,
    CreateProductSQSConsumer,
    {
      provide: PRODUCT_EXTERNAL_SERVICE_ADAPTER,
      useClass: ProductExternalServiceAdapter,
    },
  ],
})
export class ProductsModule {}
