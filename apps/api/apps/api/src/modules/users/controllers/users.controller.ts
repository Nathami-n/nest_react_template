import { Controller, Get, UseGuards, Param, Patch, Body, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '@api/modules/auth/guards';
import { Roles } from '@api/modules/auth/decorators';
import { UserRole } from '@prisma/client';
import { UsersService } from '@api/modules/users/services/users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.usersService.findAll(page, limit);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
  ) {
    const user = await this.usersService.updateUserStatus(id, body.isActive);
    return {
      success: true,
      message: 'User status updated successfully',
      data: user,
    };
  }
}
