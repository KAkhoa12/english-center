import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RoleForm } from "@/components/Dashboard/Roles/RoleForm";
import { usePermissionsStore } from "@/services/permissions/permissions.store";
import { useRolesStore } from "@/services/roles/roles.store";
import { useParams } from "react-router-dom";

export default function DashboardRoleEditPage() {
  const { roleId = "" } = useParams();
  const [search, setSearch] = useState("");
  const [updatingPermissionId, setUpdatingPermissionId] = useState<string | null>(null);
  const { permissions, listPermissions } = usePermissionsStore();
  const { selectedRole, isLoading, getRole, updateRole, assignPermissions, removePermission, clearSelectedRole } = useRolesStore();

  useEffect(() => {
    if (!roleId) return;
    void getRole(roleId).catch(() => toast.error("Không thể tải vai trò"));
    void listPermissions({ page: 1, page_size: 500, sort_by: "code", sort_order: "asc" }).catch(() =>
      toast.error("Không thể tải danh sách quyền"),
    );
    return () => clearSelectedRole();
  }, [roleId, getRole, listPermissions, clearSelectedRole]);

  const activePermissionIds = useMemo(() => new Set(selectedRole?.permission_ids ?? []), [selectedRole?.permission_ids]);
  const filteredPermissions = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return permissions;
    return permissions.filter((permission) =>
      [permission.code, permission.name, permission.description].some((value) => value?.toLowerCase().includes(keyword)),
    );
  }, [permissions, search]);

  const groupedPermissions = useMemo(() => {
    return filteredPermissions.reduce<Record<string, typeof filteredPermissions>>((acc, permission) => {
      const group = permission.code.split(".")[0] || "other";
      acc[group] = acc[group] || [];
      acc[group].push(permission);
      return acc;
    }, {});
  }, [filteredPermissions]);

  const togglePermission = async (permissionId: string, checked: boolean) => {
    if (!roleId) return;
    try {
      setUpdatingPermissionId(permissionId);
      if (checked) {
        await assignPermissions(roleId, { permission_ids: [permissionId] });
      } else {
        await removePermission(roleId, permissionId);
      }
      await getRole(roleId);
      toast.success(checked ? "Đã bật quyền cho vai trò" : "Đã tắt quyền khỏi vai trò");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cập nhật quyền thất bại");
    } finally {
      setUpdatingPermissionId(null);
    }
  };

  return (
    <section>
      <DashboardListPageHeader
        title="Chỉnh sửa vai trò"
        description="Cập nhật thông tin vai trò và bật/tắt quyền theo permission code"
      />

      <div className="space-y-5">
        <RoleForm
          initialData={selectedRole}
          loading={isLoading}
          onSubmit={async (payload) => {
            try {
              await updateRole(roleId, payload);
              toast.success("Cập nhật vai trò thành công");
            } catch {
              toast.error("Cập nhật vai trò thất bại");
            }
          }}
        />

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ma trận quyền</h3>
              <p className="mt-1 text-sm text-gray-500">
                Bật switch để gán quyền cho role. Tắt switch sẽ xóa quyền khỏi role hiện tại.
              </p>
            </div>
            <Badge className="bg-brand-50 text-brand-700">{activePermissionIds.size} quyền đang bật</Badge>
          </div>

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm permission code, tên hoặc mô tả"
            className="mt-4 max-w-md"
          />

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {Object.entries(groupedPermissions).map(([group, items]) => (
              <div key={group} className="rounded-2xl border border-gray-100">
                <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-700">{group}</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {items.map((permission) => {
                    const checked = activePermissionIds.has(permission.id);
                    const disabled = updatingPermissionId === permission.id;

                    return (
                      <label key={permission.id} className="flex cursor-pointer items-start justify-between gap-4 px-4 py-3">
                        <span className="min-w-0">
                          <span className="block font-mono text-sm font-semibold text-gray-900">{permission.code}</span>
                          <span className="mt-1 block text-sm text-gray-500">
                            {permission.name || permission.description || "Chưa có mô tả quyền"}
                          </span>
                        </span>
                        <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={(event) => void togglePermission(permission.id, event.target.checked)}
                            className="peer sr-only"
                          />
                          <span className="absolute inset-0 rounded-full bg-gray-200 transition-colors peer-checked:bg-brand-500 peer-disabled:opacity-50" />
                          <span className="absolute left-1 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
