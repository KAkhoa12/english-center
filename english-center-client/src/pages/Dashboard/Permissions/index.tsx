import { useEffect, useState } from "react";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { PermissionsListTable } from "@/components/Dashboard/Permissions/PermissionsListTable";
import { Input } from "@/components/ui/input";
import { usePermissionsStore } from "@/services/permissions/permissions.store";

export const DashboardPermissionsPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { permissions, pagination, isLoading, listPermissions } = usePermissionsStore();

  useEffect(() => {
    void listPermissions({ page, page_size: pageSize, search: search.trim() || undefined });
  }, [listPermissions, page, pageSize, search]);

  return (
    <section>
      <DashboardListPageHeader
        title="Quản lý quyền"
        description="Theo dõi và quản trị danh sách quyền trong hệ thống"
      />

      <div className="mb-4 max-w-sm">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Tìm theo mã quyền hoặc tên quyền"
        />
      </div>

      <PermissionsListTable
        data={permissions}
        loading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
      />
    </section>
  );
};

export default DashboardPermissionsPage;
