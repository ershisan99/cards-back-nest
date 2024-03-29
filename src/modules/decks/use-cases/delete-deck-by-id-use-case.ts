import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { DecksRepository } from '../infrastructure/decks.repository'

export class DeleteDeckByIdCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string
  ) {}
}

@CommandHandler(DeleteDeckByIdCommand)
export class DeleteDeckByIdHandler implements ICommandHandler<DeleteDeckByIdCommand> {
  constructor(private readonly deckRepository: DecksRepository) {}

  async execute(command: DeleteDeckByIdCommand) {
    const deck = await this.deckRepository.findDeckById(command.id)

    if (!deck) throw new NotFoundException(`Deck with id ${command.id} not found`)
    if (deck.userId !== command.userId) {
      throw new ForbiddenException(`You can't delete a deck that you don't own`)
    }

    return await this.deckRepository.deleteDeckById(command.id)
  }
}
