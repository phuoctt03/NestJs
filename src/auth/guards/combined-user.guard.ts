import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { UserGuard } from './user.guard';

@Injectable()
export class CombinedUserGuard implements CanActivate {
  constructor(
    private readonly rolesGuard: RolesGuard,
    private readonly userGuard: UserGuard,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const rolesGuardResult = await this.rolesGuard.canActivate(context);
    const userGuardResult = await this.userGuard.canActivate(context);

    if (rolesGuardResult || userGuardResult) {
      return true; 
    }

    throw new ForbiddenException('Truy cập bị từ chối, không đủ quyền');
  }
}