// roles-permissions.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/users/entities/user.entity';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class RolesPermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) return true;
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    const requiredPermissions = this.reflector.get<string[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) return false;

    const userRoles = await user.roles; // Assumes roles and permissions are loaded in auth process

    const hasRole = requiredRoles
      ? userRoles.some((role) => requiredRoles.includes(role.name))
      : true;

    const hasPermission = requiredPermissions
      ? userRoles.some((role) =>
          role.permissions.some((permission) =>
            requiredPermissions.includes(permission.name),
          ),
        )
      : true;

    return hasRole && hasPermission;
  }
}
