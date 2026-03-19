import { Module } from '@nestjs/common';
import { UsersController } from '@api/modules/users/controllers/users.controller';
import { UsersService } from '@api/modules/users/services/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
