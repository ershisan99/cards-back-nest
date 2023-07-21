import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { omit } from 'remeda'

import { GetAllCardsInDeckDto } from '../../cards/dto'
import { PaginatedCards, PaginatedCardsWithGrade } from '../../cards/entities/cards.entity'
import { CardsRepository } from '../../cards/infrastructure/cards.repository'
import { DecksRepository } from '../infrastructure/decks.repository'

export class GetAllCardsInDeckCommand {
  constructor(
    public readonly userId: string,
    public readonly deckId: string,
    public readonly params: GetAllCardsInDeckDto
  ) {}
}

@CommandHandler(GetAllCardsInDeckCommand)
export class GetAllCardsInDeckHandler implements ICommandHandler<GetAllCardsInDeckCommand> {
  constructor(
    private readonly cardsRepository: CardsRepository,
    private readonly decksRepository: DecksRepository
  ) {}
  private transformGrade(cards: PaginatedCardsWithGrade): PaginatedCards {
    return {
      ...cards,
      items: cards.items.map(card => {
        if (card.grades.length === 0) return omit({ ...card, grade: 0 }, ['grades'])

        const grade = card.grades.reduce((acc, grade) => acc + grade.grade, 0) / card.grades.length

        return omit(
          {
            ...card,
            grade,
          },
          ['grades']
        )
      }),
    }
  }

  async execute(command: GetAllCardsInDeckCommand): Promise<PaginatedCards> {
    const deck = await this.decksRepository.findDeckById(command.deckId)

    if (!deck) throw new NotFoundException(`Deck with id ${command.deckId} not found`)

    if (deck.userId !== command.userId && deck.isPrivate) {
      throw new ForbiddenException(`You can't get a private deck that you don't own`)
    }
    const cards = await this.cardsRepository.findCardsByDeckId(
      command.deckId,
      command.userId,
      command.params
    )

    return this.transformGrade(cards)
  }
}
