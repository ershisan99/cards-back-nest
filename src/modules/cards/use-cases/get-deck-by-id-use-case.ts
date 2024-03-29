import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { Card } from '../entities/cards.entity'
import { CardsRepository } from '../infrastructure/cards.repository'

export class GetDeckByIdCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(GetDeckByIdCommand)
export class GetDeckByIdHandler implements ICommandHandler<GetDeckByIdCommand> {
  constructor(private readonly deckRepository: CardsRepository) {}

  async execute(command: GetDeckByIdCommand): Promise<Card> {
    return await this.deckRepository.findCardById(command.id)
  }
}
