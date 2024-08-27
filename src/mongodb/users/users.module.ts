import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../../config/prisma/prisma.module'; 
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserGuard } from 'src/auth/guards/user.guard';
import { CombinedUserGuard } from 'src/auth/guards/combined-user.guard';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, JwtAuthGuard, RolesGuard, UserGuard, CombinedUserGuard],
  exports: [UsersService], 
})
export class UsersModule {}

