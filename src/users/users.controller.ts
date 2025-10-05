import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../common/entities/user.entity';
import { UpdateProfileDto, ChangePasswordDto } from './dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  async getProfile(@CurrentUser() user: User) {
    const userProfile = await this.usersService.findById(user.id);
    return {
      success: true,
      message: 'Profile retrieved successfully',
      data: { user: userProfile },
    };
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const updatedUser = await this.usersService.updateProfile(user.id, updateProfileDto);
    return {
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser },
    };
  }

  @Put('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Current password is incorrect' })
  async changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(
      user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
    return {
      success: true,
      message: 'Password changed successfully',
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const { users, total } = await this.usersService.findAll(page, limit);
    return {
      success: true,
      message: 'Users retrieved successfully',
      data: { users },
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Get('search')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Search users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Search query' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  async searchUsers(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const { users, total } = await this.usersService.searchUsers(query, page, limit);
    return {
      success: true,
      message: 'Search results retrieved successfully',
      data: { users },
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findById(id);
    return {
      success: true,
      message: 'User retrieved successfully',
      data: { user },
    };
  }

  @Put(':id/deactivate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Deactivate user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  async deactivateUser(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.deactivateUser(id);
    return {
      success: true,
      message: 'User deactivated successfully',
      data: { user },
    };
  }

  @Put(':id/activate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Activate user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User activated successfully' })
  async activateUser(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.activateUser(id);
    return {
      success: true,
      message: 'User activated successfully',
      data: { user },
    };
  }
}
