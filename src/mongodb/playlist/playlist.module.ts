import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { AuthorGuard } from 'src/auth/guards/author.guard';
import { CombinedAuthorGuard } from 'src/auth/guards/combined-author.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
@Module({
  imports: [PrismaModule],
  controllers: [PlaylistController],
  providers: [PlaylistService, JwtAuthGuard, RolesGuard, AuthorGuard, CombinedAuthorGuard],
})
export class PlaylistModule {}
