import { Length, Matches } from 'class-validator'

export class CreateUserDto {
  @Length(3, 10)
  name: string

  @Length(6, 20)
  password: string

  /** User's email address */
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string
}
