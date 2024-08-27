import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PlaylistModule } from './mongodb/playlist/playlist.module';
import { UsersModule } from './mongodb/users/users.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { PrismaModule } from './config/prisma/prisma.module';
import { AvtUserModule } from './mongodb/avtUser/avtUser.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.mongodb.env'],
      isGlobal: true, 
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    PrismaModule,
    UsersModule,
    PlaylistModule,
    AvtUserModule,
    AuthModule,
  ],
  // controllers: [AppController],
  providers: [RolesGuard, AppService, JwtService],
  
})
export class AppModule {}