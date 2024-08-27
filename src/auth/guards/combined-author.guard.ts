import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { AuthorGuard } from './author.guard';

@Injectable()
export class CombinedAuthorGuard implements CanActivate {
  constructor(
    private readonly rolesGuard: RolesGuard,
    private readonly authorGuard: AuthorGuard,
  ) {}

  async canActivate(context: ExecutionContext){

    const rolesGuardResult = await this.rolesGuard.canActivate(context);
    const authorGuardResult = await this.authorGuard.canActivate(context);

    if (rolesGuardResult || authorGuardResult) {
      return true; 
    }

    throw new ForbiddenException('Truy cập bị từ chối, không đủ quyền');
  }
}