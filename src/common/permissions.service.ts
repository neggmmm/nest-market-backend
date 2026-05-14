import { Injectable } from '@nestjs/common';
import { Role } from './enum/role.enum';
import { ProductPermission } from './enum/permissions/product-permissions.eunm';
// Import other permission enums as needed

export interface User {
  id: number;
  role: Role;
  permissions?: string[]; // Optional direct permissions
  // Add subscriptionLevel?: string; later for subscriptions
}

@Injectable()
export class PermissionsService {
  // Base permissions mapped to roles
  private readonly rolePermissions: Record<Role, string[]> = {
    [Role.SUPERADMIN]: [
      ProductPermission.PRODUCTSCREATE,
      ProductPermission.PRODUCTSUPDATE,
      ProductPermission.PRODUCTSDELETE,
      // Add all permissions for super admin
    ],
    [Role.ADMIN]: [
      ProductPermission.PRODUCTSCREATE,
      ProductPermission.PRODUCTSUPDATE,
      ProductPermission.PRODUCTSDELETE,
      // Add admin permissions
    ],
    [Role.CUSTOMER]: [
      // Basic customer permissions
    ],
    [Role.PROVIDER]: [
      ProductPermission.PRODUCTSCREATE,
      ProductPermission.PRODUCTSUPDATE,
      // Provider can manage their own products
    ],
    [Role.DELIVERY]: [
      // Delivery permissions
    ],
  };

  /**
   * Gets all effective permissions for a user based on their role and direct permissions
   * Later: Also consider subscription level
   */
  async getUserPermissions(user: User): Promise<string[]> {
    const permissions = new Set<string>();

    // Add role-based permissions
    if (user.role && this.rolePermissions[user.role]) {
      this.rolePermissions[user.role].forEach(perm => permissions.add(perm));
    }

    // Add any direct permissions assigned to the user
    if (user.permissions) {
      user.permissions.forEach(perm => permissions.add(perm));
    }

    // TODO: Add subscription-based permissions here later
    // if (user.subscriptionLevel) {
    //   const subPerms = this.getSubscriptionPermissions(user.subscriptionLevel);
    //   subPerms.forEach(perm => permissions.add(perm));
    // }

    return Array.from(permissions);
  }

  /**
   * Checks if user has a specific permission
   */
  hasPermission(userPermissions: string[], requiredPermission: string): boolean {
    return userPermissions.includes(requiredPermission);
  }

  /**
   * Checks if user has all required permissions
   */
  hasAllPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.every(permission => userPermissions.includes(permission));
  }

  // TODO: Add this method later for subscriptions
  // private getSubscriptionPermissions(subscriptionLevel: string): string[] {
  //   // Return permissions based on subscription
  // }
}