import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);

// Common permission decorators
export const RequireAdmin = () => Permissions('admin');
export const RequireSuperAdmin = () => Permissions('super_admin');
export const RequireUser = () => Permissions('user');
export const RequireModerator = () => Permissions('moderator');
