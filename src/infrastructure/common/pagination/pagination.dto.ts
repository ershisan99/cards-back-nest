import { Type } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  currentPage?: number

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  itemsPerPage?: number
}

export class Pagination {
  currentPage: number
  itemsPerPage: number
  totalPages: number
  totalItems: number
}
