import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Human-readable message describing the result',
    example: 'Request completed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'The actual data returned by the API',
    required: false,
  })
  data?: T;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static success<T>(
    data?: T,
    message: string = 'Request completed successfully',
  ): ApiResponseDto<T> {
    return new ApiResponseDto(true, message, data);
  }

  static error(
    message: string = 'An error occurred',
    data?: any,
  ): ApiResponseDto {
    return new ApiResponseDto(false, message, data);
  }
}
