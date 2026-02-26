import { ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import { MqClientPort } from './mq-client.port'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { EnvConfigService } from '../env/env-config.service'
import type { LoggerPort } from '../logger/logger.port'
import { LOGGER_PORT } from '../logger/logger-di-tokens'
import { Inject } from '@nestjs/common'
import { Message } from 'src/base/lib/domain/message.base'

@Injectable()
export class SQSAdapter implements MqClientPort, OnModuleInit {
  private client: SQSClient

  constructor(
    private readonly envConfig: EnvConfigService,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {
    this.logger.setContext(SQSAdapter.name)
  }

  onModuleInit() {
    this.logger.log('Initializing SQS client')
    this.client = new SQSClient({
      region: this.envConfig.awsRegion,
    })
    this.logger.log('SQS client initialized')
  }

  async receiveMessage(queue: string): Promise<Message | null> {
    this.logger.log('Receiving message from SQS')
    const command = new ReceiveMessageCommand({
      QueueUrl: queue,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 20,
    })
    try {
      const result = await this.client.send(command)
      this.logger.log(`Message received successfully. MessageId: ${result.Messages?.[0]?.MessageId}`)
      return JSON.parse(result.Messages?.[0]?.Body as string) as Message
    } catch (error) {
      this.logger.error(`Failed to receive message from SQS: ${error.message}`, error.stack)
      throw error
    }
  }
}
