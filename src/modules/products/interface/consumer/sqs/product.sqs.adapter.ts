import { Inject, Injectable } from '@nestjs/common'
import { SQS_CLIENT_PORT } from 'src/base/config/message/mq-client.di-tokens'
import type { MqClientPort } from 'src/base/config/message/mq-client.port'

import { ProductSQSMapper } from './mapper/product.sqs.mapper'

@Injectable()
export class Product {
  constructor(
    @Inject(SQS_CLIENT_PORT)
    private readonly sqsClient: MqClientPort,
  ) {}

  async create(command: CreateProductCommand): Promise<void> {
    const message = ProductSQSMapper.toCreateProductMessage(command)
    await this.sqsClient.sendMessage(message)
  }

  async update(command: UpdateProductCommand): Promise<void> {
    const message = ProductSQSMapper.toUpdateProductMessage(command)
    await this.sqsClient.sendMessage(message)
  }

  async remove(command: RemoveProductCommand): Promise<void> {
    const message = ProductSQSMapper.toRemoveProductMessage(command)
    await this.sqsClient.sendMessage(message)
  }
}
