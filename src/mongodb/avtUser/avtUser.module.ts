import { Module } from '@nestjs/common';
import { AvtUserController } from './avtUser.controller';
import { AvtUserService } from './avtUser.service';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserGuard } from 'src/auth/guards/user.guard';
import { CombinedUserGuard } from 'src/auth/guards/combined-user.guard';

@Module({
    imports: [PrismaModule],
    controllers: [AvtUserController],
    providers: [AvtUserService, JwtAuthGuard, RolesGuard, UserGuard, CombinedUserGuard],
})
export class AvtUserModule {}