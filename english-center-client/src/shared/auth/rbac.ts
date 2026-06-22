import type { MeResponse } from "@/services/auth/auth.type";

export type AppRole = "admin" | "staff" | "teacher" | "student" | string;

export type AccessRule = {
  allowedRoles?: AppRole[];
  requiredPermissions?: string[];
  requireAllPermissions?: boolean;
};

export const hasRole = (me: MeResponse | null, role: AppRole) =>
  Boolean(me?.roles?.includes(role));

export const hasAnyRole = (me: MeResponse | null, roles?: AppRole[]) => {
  if (!roles?.length) return true;
  return roles.some((role) => hasRole(me, role));
};

export const hasPermission = (me: MeResponse | null, permission: string) => {
  const permissions = me?.permissions ?? [];
  if (permissions.includes(permission) || permissions.includes("admin.all")) return true;
  const resource = permission.split(".").slice(0, -1).join(".");
  return Boolean(resource && permissions.includes(`${resource}.all`));
};

export const hasAnyPermission = (me: MeResponse | null, permissions?: string[]) => {
  if (!permissions?.length) return true;
  return permissions.some((permission) => hasPermission(me, permission));
};

export const hasRequiredPermissions = (
  me: MeResponse | null,
  permissions?: string[],
  requireAll = false,
) => {
  if (!permissions?.length) return true;
  return requireAll
    ? permissions.every((permission) => hasPermission(me, permission))
    : permissions.some((permission) => hasPermission(me, permission));
};

export const canAccess = (me: MeResponse | null, rule: AccessRule) => {
  if (!me) return false;
  if (!hasAnyRole(me, rule.allowedRoles)) return false;
  if (hasRole(me, "admin")) return true;

  return hasRequiredPermissions(me, rule.requiredPermissions, rule.requireAllPermissions);
};
