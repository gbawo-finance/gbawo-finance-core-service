import { Body, Controller, Get, Param, Post, Patch, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import {
  CreateUserDto,
  CreateUserResponseDto,
  SubmitKycDto,
  UserProfileDto,
  UpdateUserProfileDto,
  UserKycStatusDto,
  ReserveAccountNumberDto,
  ReserveWalletAddressDto,
  ReservedAccountDto,
  ReservedWalletDto,
  ListUsersQueryDto,
  ListUsersResponseDto,
} from '../common/dto/users.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List users with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: ListUsersResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async listUsers(
    @Query() query: ListUsersQueryDto,
  ): Promise<ApiResponseDto<ListUsersResponseDto>> {
    const users = await this.usersService.listUsers(query);
    return ApiResponseDto.success(users, 'Users retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Create user account' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: CreateUserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user data provided',
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponseDto<CreateUserResponseDto>> {
    const user = await this.usersService.createUser(createUserDto);
    return ApiResponseDto.success(user, 'User created successfully');
  }

  @Post(':userId/kyc/submit/:level')
  @ApiOperation({ summary: 'Submit KYC verification' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 'usr_123456789',
  })
  @ApiParam({
    name: 'level',
    description: 'KYC level to submit',
    enum: ['1', '2'],
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'KYC submission successful',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid KYC submission data',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async submitKyc(
    @Param('userId') userId: string,
    @Param('level') level: string,
    @Body() submitKycDto: SubmitKycDto,
  ): Promise<ApiResponseDto<{ status: string; message: string }>> {
    const result = await this.usersService.submitKyc(
      userId,
      level,
      submitKycDto,
    );
    return ApiResponseDto.success(result, 'KYC submission processed');
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user profile & current status' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 'usr_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async getUserProfile(
    @Param('userId') userId: string,
  ): Promise<ApiResponseDto<UserProfileDto>> {
    const profile = await this.usersService.getUserProfile(userId);
    return ApiResponseDto.success(
      profile,
      'User profile retrieved successfully',
    );
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 'usr_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user data',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async updateUserProfile(
    @Param('userId') userId: string,
    @Body() updateData: UpdateUserProfileDto,
  ): Promise<ApiResponseDto<UserProfileDto>> {
    const updatedProfile = await this.usersService.updateUserProfile(
      userId,
      updateData,
    );
    return ApiResponseDto.success(
      updatedProfile,
      'User profile updated successfully',
    );
  }

  @Get(':userId/kyc')
  @ApiOperation({ summary: 'Detailed KYC status & history' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 'usr_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'KYC status retrieved successfully',
    type: UserKycStatusDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async getUserKycStatus(
    @Param('userId') userId: string,
  ): Promise<ApiResponseDto<UserKycStatusDto>> {
    const kycStatus = await this.usersService.getUserKycStatus(userId);
    return ApiResponseDto.success(
      kycStatus,
      'KYC status retrieved successfully',
    );
  }

  @Post(':userId/accounts/reserve')
  @ApiOperation({ summary: 'Reserve bank account number for user' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 'usr_123456789',
  })
  @ApiResponse({
    status: 201,
    description: 'Account number reserved successfully',
    type: ReservedAccountDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid reservation request',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied or insufficient KYC level',
  })
  async reserveAccountNumber(
    @Param('userId') userId: string,
    @Body() reserveAccountDto: ReserveAccountNumberDto,
  ): Promise<ApiResponseDto<ReservedAccountDto>> {
    const reservedAccount = await this.usersService.reserveAccountNumber(
      userId,
      reserveAccountDto,
    );
    return ApiResponseDto.success(
      reservedAccount,
      'Account number reserved successfully',
    );
  }

  @Post(':userId/wallets/reserve')
  @ApiOperation({ summary: 'Reserve wallet address for user' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 'usr_123456789',
  })
  @ApiResponse({
    status: 201,
    description: 'Wallet address reserved successfully',
    type: ReservedWalletDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid reservation request',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied or insufficient KYC level',
  })
  async reserveWalletAddress(
    @Param('userId') userId: string,
    @Body() reserveWalletDto: ReserveWalletAddressDto,
  ): Promise<ApiResponseDto<ReservedWalletDto>> {
    const reservedWallet = await this.usersService.reserveWalletAddress(
      userId,
      reserveWalletDto,
    );
    return ApiResponseDto.success(
      reservedWallet,
      'Wallet address reserved successfully',
    );
  }

  @Get(':userId/accounts/reserved')
  @ApiOperation({ summary: 'Get reserved bank accounts for user' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 'usr_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserved accounts retrieved successfully',
    type: [ReservedAccountDto],
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async getReservedAccounts(
    @Param('userId') userId: string,
  ): Promise<ApiResponseDto<ReservedAccountDto[]>> {
    const reservedAccounts = await this.usersService.getReservedAccounts(userId);
    return ApiResponseDto.success(
      reservedAccounts,
      'Reserved accounts retrieved successfully',
    );
  }

  @Get(':userId/wallets/reserved')
  @ApiOperation({ summary: 'Get reserved wallet addresses for user' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 'usr_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserved wallets retrieved successfully',
    type: [ReservedWalletDto],
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async getReservedWallets(
    @Param('userId') userId: string,
  ): Promise<ApiResponseDto<ReservedWalletDto[]>> {
    const reservedWallets = await this.usersService.getReservedWallets(userId);
    return ApiResponseDto.success(
      reservedWallets,
      'Reserved wallets retrieved successfully',
    );
  }
}
