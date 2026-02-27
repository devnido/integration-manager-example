import { Inject, Injectable } from '@nestjs/common'
import { SQS_INITIALIZED_CLIENT } from 'src/base/config/message/message.di-tokens'
import type { LoggerPort } from 'src/base/lib/domain/logger.port'

import { Message } from 'src/base/lib/domain/message.base'
import { SQSConsumerBase } from 'src/base/lib/interface/sqs.consumer.base'
import { SQSClient } from '@aws-sdk/client-sqs'
import { LOGGER_ADAPTER } from 'src/base/config/logger/logger-di-tokens'
import { EnvConfigService } from 'src/base/config/env/env-config.service'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class CreateProductSQSConsumer extends SQSConsumerBase {
  constructor(
    envConfig: EnvConfigService,
    @Inject(SQS_INITIALIZED_CLIENT) client: SQSClient,
    @Inject(LOGGER_ADAPTER) logger: LoggerPort,
  ) {
    super(envConfig.sqsQueueUrl, client, logger)
    this.logger.setContext(CreateProductSQSConsumer.name)
    this.logger.log('CreateProductSQSConsumer initialized')
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async consume(): Promise<void> {
    // console.log('consuming')
    await this.retrieveMessages()
  }

  async processMessage(message: Message): Promise<void> {
    console.log('message', message)
  }
}
