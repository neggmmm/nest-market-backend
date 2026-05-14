import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
import { Role } from '../enum/role.enum';
import { PermissionsService, User } from '../permissions.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required roles from decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Get required permissions from decorator
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles or permissions required, allow access
    if (!requiredRoles?.length && !requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check permissions first (more granular control)
    if (requiredPermissions?.length) {
      const userPermissions = await this.permissionsService.getUserPermissions(user);
      if (!this.permissionsService.hasAllPermissions(userPermissions, requiredPermissions)) {
        throw new ForbiddenException('You do not have the required permissions to access this resource');
      }
    }

    // Then check roles if specified
    if (requiredRoles?.length && (!user.role || !requiredRoles.includes(user.role))) {
      throw new ForbiddenException('You do not have the required role to access this resource');
    }

    return true;
  }
}
