import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ApiResponseDto } from './common/dto/api-response.dto';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get API welcome information' })
  @ApiResponse({
    status: 200,
    description: 'API information retrieved successfully',
  })
  getWelcome(): ApiResponseDto<any> {
    const welcome = this.appService.getWelcome();
    return ApiResponseDto.success(welcome, 'API information retrieved successfully');
  }
}
