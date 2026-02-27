import { CreateProductCommand } from 'src/modules/products/domain/commands/create-product.command'
import { CreateProductMessage } from '../dto/create-product.message'

export class CreateProductMapper {
  static toCommand(message: CreateProductMessage): CreateProductCommand {
    return new CreateProductCommand({
      name: message.name,
      description: message.description,
      price: message.price,
    })
  }
}
