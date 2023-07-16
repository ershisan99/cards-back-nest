import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateDeckDto } from '../dto'
import { DecksRepository } from '../infrastructure/decks.repository'
import { FileUploadService } from '../../../infrastructure/file-upload-service/file-upload.service'

export class CreateDeckCommand {
  constructor(public readonly deck: CreateDeckDto, public readonly cover: Express.Multer.File) {}
}

@CommandHandler(CreateDeckCommand)
export class CreateDeckHandler implements ICommandHandler<CreateDeckCommand> {
  constructor(
    private readonly deckRepository: DecksRepository,
    private readonly fileUploadService: FileUploadService
  ) {}

  async execute(command: CreateDeckCommand) {
    let cover

    if (command.cover) {
      const result = await this.fileUploadService.uploadFile(
        command.cover.buffer,
        command.cover.originalname
      )
      cover = result.fileUrl
    }

    return await this.deckRepository.createDeck({ ...command.deck, cover })
  }
}
