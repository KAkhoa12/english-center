import { useEffect, useState } from "react";

import { DashboardListPageHeader } from "@/components/Dashboard/Comon";
import { RolesListTable } from "@/components/Dashboard/Roles/RolesListTable";
import { Input } from "@/components/ui/input";
import { useRolesStore } from "@/services/roles/roles.store";

export const DashboardRolesPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { roles, pagination, isLoading, listRoles } = useRolesStore();

  useEffect(() => {
    void listRoles({ page, page_size: pageSize, search: search.trim() || undefined });
  }, [listRoles, page, pageSize, search]);

  return (
    <section>
      <DashboardListPageHeader
        title="Quản lý vai trò"
        description="Theo dõi và quản trị danh sách vai trò"
      />

      <div className="mb-4 max-w-sm">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Tìm theo tên vai trò"
        />
      </div>

      <RolesListTable
        data={roles}
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

export default DashboardRolesPage;
