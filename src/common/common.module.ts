import { Global, Module } from '@nestjs/common';
import { AuthorizationGuard } from './guards/authorization.guard';
import { PermissionGuard } from './guards/permission.guard';
import { PermissionsService } from './permissions.service';

@Global() // Makes providers available globally
@Module({
  providers: [
    AuthorizationGuard,
    PermissionGuard,
    PermissionsService,
  ],
  exports: [
    AuthorizationGuard,
    PermissionGuard,
    PermissionsService,
  ],
})
export class CommonModule {}