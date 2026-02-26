import { Message } from 'src/base/lib/domain/message.base'

export interface MqClientPort {
  receiveMessage(queue: string): Promise<Message | null>
}
