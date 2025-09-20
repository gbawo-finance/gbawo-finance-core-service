import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { RatesService } from './rates.service';
import { RateCalculationDto, RateResponseDto } from '../common/dto/rates.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('Rates')
@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Get()
  @ApiOperation({ summary: 'Calculate exchange rates' })
  @ApiResponse({
    status: 200,
    description: 'Exchange rates calculated successfully',
    type: RateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid rate calculation data',
  })
  @ApiResponse({
    status: 403,
    description: 'User not eligible for transaction',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
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
