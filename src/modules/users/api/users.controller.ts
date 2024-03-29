import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiTags } from '@nestjs/swagger'

import { Pagination } from '../../../infrastructure/common/pagination/pagination.service'
import { BaseAuthGuard } from '../../auth/guards'
import { CreateUserCommand } from '../../auth/use-cases'
import { CreateUserDto } from '../dto/create-user.dto'
import { UsersService } from '../services/users.service'

@ApiTags('Admin')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private commandBus: CommandBus
  ) {}

  @Get()
  async findAll(@Query() query) {
    const { currentPage, itemsPerPage } = Pagination.getPaginationData(query)

    const users = await this.usersService.getUsers(
      currentPage,
      itemsPerPage,
      query.name,
      query.email
    )

    if (!users) throw new NotFoundException('Users not found')

    return users
  }

  @UseGuards(BaseAuthGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.commandBus.execute(
      new CreateUserCommand({
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
      })
    )
  }

  @UseGuards(BaseAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.deleteUserById(id)
  }

  @UseGuards(BaseAuthGuard)
  @Delete()
  async removeAll() {
    return await this.usersService.deleteAllUsers()
  }
}
