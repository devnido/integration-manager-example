import { DeleteMessageCommand, ReceiveMessageCommand, ReceiveMessageCommandOutput, SQSClient } from '@aws-sdk/client-sqs'

import { Message } from 'src/base/lib/domain/message.base'
import type { LoggerPort } from 'src/base/lib/domain/logger.port'

export abstract class SQSConsumerBase {
  constructor(
    private readonly queueUrl: string,
    private readonly client: SQSClient,
    protected readonly logger: LoggerPort,
  ) {}

  async retrieveMessages(): Promise<void> {
    this.logger.log('Consuming message from SQS')
    const command = new ReceiveMessageCommand({
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 20,
    })
    const result: ReceiveMessageCommandOutput = await this.client.send(command)

    const message = result.Messages?.[0] ?? null
    const receiptHandle = message?.ReceiptHandle ?? ''
    const messageId = message?.MessageId ?? ''

    if (message && receiptHandle && messageId) {
      try {
        await this.processMessage(message)
        await this.deleteMessage(this.queueUrl, receiptHandle, messageId)
      } catch (error) {
        this.logger.error('Error processing message', error)
        throw error
      }
    }
  }

  private async deleteMessage(queue: string, receiptHandle: string, messageId: string): Promise<void> {
    this.logger.log('Deleting message from SQS')
    const command = new DeleteMessageCommand({
      QueueUrl: queue,
      ReceiptHandle: receiptHandle,
    })
    await this.client.send(command)
    this.logger.log(`Message deleted from SQS: ${receiptHandle.toString()} ${messageId.toString()}`)
  }

  abstract consume(): Promise<void>

  abstract processMessage(message: Message): Promise<void>
}
