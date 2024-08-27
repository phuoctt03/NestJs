import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class AuthorGuard implements CanActivate {

  constructor( private readonly prisma: PrismaService){}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const username = user.username;
    const Id = request.params.id;
    const authorVideo = await this.prisma.playlist.findUnique({
        where: { id: Id },
        select: { author: true }
      });
    if (!user.roles.length) {
      throw new UnauthorizedException('Truy cập bị từ chối, thông tin người dùng bị thiếu hoặc không hợp lệ');
    }
    return authorVideo?.author === username;
  }
}
