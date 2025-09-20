import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ApiResponseDto } from './common/dto/api-response.dto';
import { ApiSuccessResponse } from './common/decorators/api-response.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get API welcome information' })
  @ApiSuccessResponse('API information retrieved successfully')
  getWelcome(): ApiResponseDto<any> {
    const welcome = this.appService.getWelcome();
    return ApiResponseDto.success(welcome, 'API information retrieved successfully');
  }
}
