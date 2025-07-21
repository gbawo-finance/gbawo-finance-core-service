import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get API welcome information' })
  @ApiResponse({
    status: 200,
    description: 'API information retrieved successfully',
  })
  getWelcome() {
    return this.appService.getWelcome();
  }
}
