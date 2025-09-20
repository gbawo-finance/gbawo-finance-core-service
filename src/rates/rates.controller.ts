import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RatesService } from './rates.service';
import { RateCalculationDto, RateResponseDto } from '../common/dto/rates.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { ApiSuccessResponse, CommonApiResponses } from '../common/decorators/api-response.decorator';

@ApiTags('Rates')
@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Get()
  @ApiOperation({ summary: 'Calculate exchange rates' })
  @ApiSuccessResponse('Exchange rates calculated successfully', RateResponseDto)
  @CommonApiResponses.BadRequest
  @CommonApiResponses.Forbidden
  @CommonApiResponses.NotFound
  async calculateRates(
    @Query() rateCalculationDto: RateCalculationDto,
  ): Promise<ApiResponseDto<RateResponseDto>> {
    const rates = await this.ratesService.calculateRates(rateCalculationDto);
    return ApiResponseDto.success(
      rates,
      'Exchange rates calculated successfully',
    );
  }
}
