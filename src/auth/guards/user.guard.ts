import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UserGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userId = user.userId;
    const Id = request.params.id;
    if (!user.roles.length) {
      throw new UnauthorizedException('Truy cập bị từ chối, thông tin người dùng bị thiếu hoặc không hợp lệ');
    }
    return String(Id) === String(userId);
  }
}