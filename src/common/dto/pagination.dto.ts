import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, Min, Max } from 'class-validator';

/**
 * Standardized pagination metadata for all list responses
 */
export class PaginationMetaDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
    minimum: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 8,
  })
  total_pages: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  has_next: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  has_previous: boolean;

  @ApiProperty({
    description: 'Index of the first item on current page',
    example: 21,
  })
  start_index: number;

  @ApiProperty({
    description: 'Index of the last item on current page',
    example: 40,
  })
  end_index: number;
}

/**
 * Standardized pagination query parameters for all list endpoints
 */
export class PaginationQueryDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(100)
  limit?: number;
}

/**
 * Utility class for generating pagination metadata
 */
export class PaginationUtils {
  static createPaginationMeta(
    page: number,
    limit: number,
    total: number,
  ): PaginationMetaDto {
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit + 1;
    const endIndex = Math.min(startIndex + limit - 1, total);

    return {
      page,
      limit,
      total,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_previous: page > 1,
      start_index: total > 0 ? startIndex : 0,
      end_index: total > 0 ? endIndex : 0,
    };
  }

  static getDefaultPaginationParams(
    page?: number,
    limit?: number,
  ): { page: number; limit: number } {
    return {
      page: page && page > 0 ? page : 1,
      limit: limit && limit > 0 && limit <= 100 ? limit : 20,
    };
  }
}
